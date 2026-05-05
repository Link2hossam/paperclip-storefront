import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/products";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;
  let customerEmail: string | null = null;
  let lineItemsDisplay: Array<{ name: string; quantity: number; amount: string }> = [];

  if (sessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });
      customerEmail = session.customer_details?.email ?? null;

      if (session.line_items?.data) {
        lineItemsDisplay = session.line_items.data.map((item) => ({
          name: item.description ?? "Item",
          quantity: item.quantity ?? 1,
          amount: formatPrice(item.amount_total ?? 0, session.currency ?? "usd"),
        }));
      }
    } catch {
      // Session retrieval is best-effort for the success page
    }
  }

  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: 600,
        margin: "0 auto",
        padding: "4rem 1rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>&#10003;</div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Payment Successful</h1>
      <p style={{ color: "#64748b", marginBottom: "2rem" }}>
        Thank you for your purchase! Your order has been confirmed.
      </p>

      {customerEmail && (
        <p style={{ color: "#64748b", marginBottom: "1rem", fontSize: "0.875rem" }}>
          Confirmation sent to <strong>{customerEmail}</strong>
        </p>
      )}

      {lineItemsDisplay.length > 0 && (
        <div
          style={{
            textAlign: "left",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ fontSize: "0.875rem", textTransform: "uppercase", color: "#64748b", marginBottom: "0.75rem" }}>
            Order Summary
          </h2>
          {lineItemsDisplay.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.375rem 0",
                fontSize: "0.875rem",
              }}
            >
              <span>
                {item.name} &times; {item.quantity}
              </span>
              <span>{item.amount}</span>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "0.625rem 1.5rem",
          backgroundColor: "#0f172a",
          color: "#fff",
          borderRadius: 6,
          textDecoration: "none",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        Back to Store
      </Link>
    </main>
  );
}
