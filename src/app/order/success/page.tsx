import Link from "next/link";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { getValidatedCart, formatCents } from "@/lib/cart";

export default async function OrderSuccessPage() {
  const cookieStore = await cookies();
  const cookieCartId = cookieStore.get("paperclip_cart_id")?.value;

  let lastOrder = null;
  if (cookieCartId && process.env.DATABASE_URL) {
    try {
      const db = getDb();
      const cart = await getValidatedCart(db, cookieCartId);
      if (cart.items.length > 0) {
        lastOrder = cart;
      }
    } catch {}
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '0 auto', padding: 24, textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, color: '#0a0', marginBottom: 16 }}>Order Confirmed!</h1>
      <p style={{ fontSize: 16, marginBottom: 24 }}>Thank you for your purchase.</p>
      {lastOrder && (
        <div style={{ textAlign: 'left', background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          {lastOrder.items.map((item) => (
            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span>{item.name} &times; {item.quantity}</span>
              <span>{formatCents(item.priceCents * item.quantity)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #ddd', marginTop: 8, paddingTop: 8, fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
            <span>Total</span>
            <span>{formatCents(lastOrder.subtotalCents)}</span>
          </div>
        </div>
      )}
      <Link href="/products" style={{ color: '#0066cc', fontWeight: 600 }}>Continue Shopping</Link>
    </main>
  );
}
