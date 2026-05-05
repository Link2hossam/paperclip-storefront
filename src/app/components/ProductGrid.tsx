"use client";

import { PRODUCTS, formatPrice } from "@/lib/products";
import { useState } from "react";

function BuyButton({ productId }: { productId: string; productName?: string; price?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ productId, quantity: 1 }] }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.625rem 1rem",
          backgroundColor: loading ? "#94a3b8" : "#0f172a",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: "0.875rem",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Redirecting..." : "Buy Now"}
      </button>
      {error && <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}

export default function ProductGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
      {PRODUCTS.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{product.name}</h2>
            <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "1rem" }}>
              {product.description}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
              {formatPrice(product.priceInCents, product.currency)}
              <span style={{ fontSize: "0.875rem", fontWeight: 400, color: "#64748b" }}>/mo</span>
            </p>
            <BuyButton
              productId={product.id}
              productName={product.name}
              price={formatPrice(product.priceInCents, product.currency)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
