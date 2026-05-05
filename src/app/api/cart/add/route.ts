import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { addToCart } from "@/lib/cart";
import { getOrCreateCartId, cartCookieOptions } from "@/lib/cart/cookie";

const AddToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = AddToCartSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { productId, quantity } = parsed.data;
  const cookieCartId = await getOrCreateCartId();
  const db = getDb();

  try {
    const { cartId, isNew } = await addToCart(db, cookieCartId, productId, quantity);

    const response = NextResponse.json({ ok: true, cartId });
    if (isNew) {
      response.cookies.set(cartCookieOptions(cookieCartId));
    }
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add to cart";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
