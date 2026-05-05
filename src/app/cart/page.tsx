import Link from "next/link";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { getValidatedCart, formatCents } from "@/lib/cart";
import { trackEvent } from "@/lib/funnel";
import CartItems from "./cart-items";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cookieStore = await cookies();
  const cookieCartId = cookieStore.get("paperclip_cart_id")?.value;

  let cart;
  if (cookieCartId && process.env.DATABASE_URL) {
    const db = getDb();
    cart = await getValidatedCart(db, cookieCartId);
    await trackEvent(cookieCartId, { event: "view_cart", cartId: cart.cartId });
  } else {
    cart = { items: [], subtotalCents: 0, cartId: "", isNew: false };
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Your Cart</h1>
      {cart.items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ fontSize: 18, color: '#666', marginBottom: 16 }}>Your cart is empty</p>
          <Link href="/products" style={{ color: '#0066cc', fontWeight: 600 }}>Browse products</Link>
        </div>
      ) : (
        <>
          <CartItems items={cart.items} />
          <div style={{ borderTop: '2px solid #e0e0e0', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>Subtotal</span>
            <span style={{ fontSize: 24, fontWeight: 700 }}>{formatCents(cart.subtotalCents)}</span>
          </div>
          <Link
            href="/checkout"
            style={{
              display: 'block',
              marginTop: 24,
              padding: '14px 24px',
              background: '#0066cc',
              color: '#fff',
              textAlign: 'center',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              textDecoration: 'none',
            }}
          >
            Proceed to Checkout
          </Link>
        </>
      )}
    </main>
  );
}
