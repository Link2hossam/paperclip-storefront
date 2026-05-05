"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "0 auto", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Payment Successful!</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Thank you for your purchase. Your order is being processed.
        {sessionId && (
          <span style={{ display: "block", fontSize: 13, marginTop: 8, color: "#94a3b8" }}>
            Session: {sessionId}
          </span>
        )}
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          background: "#0066cc",
          color: "#fff",
          borderRadius: 6,
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Continue Shopping
      </Link>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 48 }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
