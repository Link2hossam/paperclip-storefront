import { eq, and } from "drizzle-orm";
import { cartSessions, cartItems, products } from "../db/schema";
import { trackEvent } from "../funnel";
import type { Db } from "../db";

export { getOrCreateCartId, cartCookieOptions } from "./cookie";

export interface CartLineItem {
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
}

export interface ValidatedCart {
  cartId: string;
  isNew: boolean;
  items: CartLineItem[];
  subtotalCents: number;
}

export async function getOrCreateCart(db: Db, cookieCartId: string) {
  const existing = await db
    .select()
    .from(cartSessions)
    .where(eq(cartSessions.cookieId, cookieCartId))
    .limit(1);

  if (existing.length > 0) {
    return { session: existing[0], isNew: false };
  }

  const [session] = await db
    .insert(cartSessions)
    .values({ cookieId: cookieCartId })
    .returning();

  return { session, isNew: true };
}

export async function addToCart(
  db: Db,
  cookieCartId: string,
  productId: string,
  quantity: number = 1
): Promise<{ cartId: string; isNew: boolean }> {
  const { session, isNew } = await getOrCreateCart(db, cookieCartId);

  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (product.length === 0) {
    throw new Error("Product not found");
  }

  if (!product[0].inStock) {
    throw new Error("Product out of stock");
  }

  const existingItem = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.cartSessionId, session.id),
        eq(cartItems.productId, productId)
      )
    )
    .limit(1);

  if (existingItem.length > 0) {
    await db
      .update(cartItems)
      .set({
        quantity: existingItem[0].quantity + quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, existingItem[0].id));
  } else {
    await db.insert(cartItems).values({
      cartSessionId: session.id,
      productId,
      quantity,
    });
  }

  await trackEvent(cookieCartId, {
    event: "add_to_cart",
    productId,
    quantity,
    cartId: session.id,
  });

  return { cartId: session.id, isNew };
}

export async function updateCartItemQuantity(
  db: Db,
  cookieCartId: string,
  productId: string,
  quantity: number
): Promise<void> {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const { session } = await getOrCreateCart(db, cookieCartId);

  await db
    .update(cartItems)
    .set({ quantity, updatedAt: new Date() })
    .where(
      and(
        eq(cartItems.cartSessionId, session.id),
        eq(cartItems.productId, productId)
      )
    );
}

export async function removeFromCart(
  db: Db,
  cookieCartId: string,
  productId: string
): Promise<void> {
  const { session } = await getOrCreateCart(db, cookieCartId);

  await db
    .delete(cartItems)
    .where(
      and(
        eq(cartItems.cartSessionId, session.id),
        eq(cartItems.productId, productId)
      )
    );
}

export async function getValidatedCart(
  db: Db,
  cookieCartId: string
): Promise<ValidatedCart> {
  const { session, isNew } = await getOrCreateCart(db, cookieCartId);

  const rows = await db
    .select({
      productId: products.id,
      name: products.name,
      slug: products.slug,
      priceCents: products.priceCents,
      imageUrl: products.imageUrl,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartSessionId, session.id));

  const subtotalCents = rows.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  return {
    cartId: session.id,
    isNew,
    items: rows,
    subtotalCents,
  };
}

export { formatCents } from "./format-cents";
