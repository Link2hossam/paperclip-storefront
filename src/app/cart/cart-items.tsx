"use client";

import { useState } from "react";
import type { CartLineItem } from "@/lib/cart";

export default function CartItems({ items: initialItems }: { items: CartLineItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState<string | null>(null);

  async function updateQuantity(productId: string, quantity: number) {
    setLoading(productId);
    try {
      const res = await fetch("/api/cart/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
      }
    } finally {
      setLoading(null);
    }
  }

  async function removeItem(productId: string) {
    setLoading(productId);
    try {
      const res = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.productId}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #eee",
            opacity: loading === item.productId ? 0.6 : 1,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            <div style={{ fontSize: 14, color: "#666" }}>
              ${(item.priceCents / 100).toFixed(2)} each
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
              disabled={loading === item.productId}
              style={{ padding: "4px 8px", fontSize: 14 }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span style={{ fontWeight: 600, minWidth: 60, textAlign: "right" }}>
              ${((item.priceCents * item.quantity) / 100).toFixed(2)}
            </span>
            <button
              onClick={() => removeItem(item.productId)}
              disabled={loading === item.productId}
              style={{
                background: "none",
                border: "none",
                color: "#c00",
                cursor: "pointer",
                fontSize: 13,
                padding: "4px 8px",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
