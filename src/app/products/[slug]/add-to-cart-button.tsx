"use client";

import { useState } from "react";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">("idle");

  async function handleAdd() {
    setStatus("loading");
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={status === "loading"}
      style={{
        padding: "12px 24px",
        fontSize: 16,
        fontWeight: 600,
        background: status === "added" ? "#0a0" : status === "error" ? "#c00" : "#0066cc",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: status === "loading" ? "wait" : "pointer",
      }}
    >
      {status === "loading"
        ? "Adding..."
        : status === "added"
        ? "Added!"
        : status === "error"
        ? "Error"
        : "Add to Cart"}
    </button>
  );
}
