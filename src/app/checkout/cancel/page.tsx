import Link from "next/link";

export default function CheckoutCancelPage() {
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
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>&#10005;</div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Checkout Cancelled</h1>
      <p style={{ color: "#64748b", marginBottom: "2rem" }}>
        Your payment was not completed. No charge has been made.
      </p>
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
