import Link from "next/link";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { getValidatedCart, formatCents } from "@/lib/cart";
import { trackEvent } from "@/lib/funnel";
import CheckoutForm from "./checkout-form";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const cookieCartId = cookieStore.get("paperclip_cart_id")?.value;

  if (!cookieCartId || !process.env.DATABASE_URL) {
    return (
      <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 28 }}>Checkout</h1>
        <p>Your cart is empty. <Link href="/products" style={{ color: '#0066cc' }}>Browse products</Link></p>
      </main>
    );
  }

  const db = getDb();
  const cart = await getValidatedCart(db, cookieCartId);

  if (cart.items.length === 0) {
    return (
      <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 28 }}>Checkout</h1>
        <p>Your cart is empty. <Link href="/products" style={{ color: '#0066cc' }}>Browse products</Link></p>
      </main>
    );
  }

  await trackEvent(cookieCartId, { event: "begin_checkout", cartId: cart.cartId });

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Checkout</h1>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Order Summary</h2>
        {cart.items.map((item) => (
          <div
            key={item.productId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              {item.name} &times; {item.quantity}
            </span>
            <span style={{ fontWeight: 600 }}>
              {formatCents(item.priceCents * item.quantity)}
            </span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 12,
            marginTop: 8,
            borderTop: "2px solid #e0e0e0",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          <span>Subtotal</span>
          <span>{formatCents(cart.subtotalCents)}</span>
        </div>
      </section>

      <CheckoutForm subtotalCents={cart.subtotalCents} />
    </main>
  );
}
