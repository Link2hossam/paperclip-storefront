"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatCents } from "@/lib/cart/format-cents";

interface CartItem {
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId") ?? "";
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cartId) {
      setLoading(false);
      return;
    }
    fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setItems(data.items ?? []);
        }
      })
      .catch(() => setError("Failed to load cart"))
      .finally(() => setLoading(false));
  }, [cartId]);

  const subtotal = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);

  async function handleCheckout() {
    if (!cartId) return;
    setRedirecting(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setRedirecting(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Checkout failed. Please try again.");
      setRedirecting(false);
    }
  }

  if (loading) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "0 auto", padding: 24 }}>
        <p>Loading cart...</p>
      </main>
    );
  }

  if (!cartId) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Checkout</h1>
        <p style={{ color: "#666" }}>No cart found. <Link href="/" style={{ color: "#0066cc" }}>Continue shopping</Link></p>
      </main>
    );
  }

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <Link href="/" style={{ color: "#0066cc", fontSize: 14 }}>&larr; Continue shopping</Link>
      <h1 style={{ fontSize: 28, margin: "16px 0 24px" }}>Checkout</h1>

      {items.length === 0 ? (
        <p style={{ color: "#666" }}>Your cart is empty.</p>
      ) : (
        <>
          <div style={{ borderTop: "1px solid #e2e8f0" }}>
            {items.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: "#64748b", fontSize: 14 }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 600 }}>{formatCents(item.priceCents * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", fontWeight: 700, fontSize: 18 }}>
            <span>Total</span>
            <span>{formatCents(subtotal)}</span>
          </div>

          {error && (
            <p style={{ color: "#c00", fontSize: 14, marginBottom: 12 }}>{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={redirecting}
            style={{
              width: "100%",
              padding: "14px 24px",
              fontSize: 16,
              fontWeight: 600,
              background: redirecting ? "#94a3b8" : "#0066cc",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: redirecting ? "wait" : "pointer",
            }}
          >
            {redirecting ? "Redirecting to Stripe..." : "Proceed to Payment"}
          </button>

          <p style={{ color: "#64748b", fontSize: 13, marginTop: 12, textAlign: "center" }}>
            You will be redirected to Stripe to complete your payment securely.
            We never see your card details.
          </p>
        </>
      )}
    </main>
  );
}
