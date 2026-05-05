import Link from "next/link";

export default function CancelPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "0 auto", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>&#10005;</div>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Payment Cancelled</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Your payment was not completed. Your cart is still available if you&apos;d like to try again.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link
          href="/checkout"
          style={{
            padding: "12px 24px",
            background: "#0066cc",
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Try Again
        </Link>
        <Link
          href="/"
          style={{
            padding: "12px 24px",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
            color: "#333",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
