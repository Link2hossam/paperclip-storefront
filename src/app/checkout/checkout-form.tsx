"use client";

import { useState } from "react";
import { formatCents } from "@/lib/cart/format-cents";

interface CheckoutFormProps {
  subtotalCents: number;
}

export default function CheckoutForm({ subtotalCents }: CheckoutFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = {
      email: form.get("email"),
      name: form.get("name"),
      address_line1: form.get("address_line1"),
      address_line2: form.get("address_line2"),
      city: form.get("city"),
      state: form.get("state"),
      postal_code: form.get("postal_code"),
      country: form.get("country"),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Checkout failed");
      }
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    fontSize: 15,
    border: "1px solid #ccc",
    borderRadius: 4,
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ fontSize: 20, marginBottom: 12 }}>Shipping Address</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Email</label>
          <input type="email" name="email" required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Full Name</label>
          <input type="text" name="name" required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Address Line 1</label>
          <input type="text" name="address_line1" required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Address Line 2</label>
          <input type="text" name="address_line2" style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>City</label>
            <input type="text" name="city" required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>State</label>
            <input type="text" name="state" required style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Postal Code</label>
            <input type="text" name="postal_code" required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Country</label>
            <input type="text" name="country" required defaultValue="US" style={inputStyle} />
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: "8px 12px", background: "#fee", borderRadius: 4, color: "#c00", marginBottom: 16 }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%",
          padding: "14px 24px",
          fontSize: 16,
          fontWeight: 600,
          background: submitting ? "#999" : "#0066cc",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: submitting ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "Processing..." : `Pay ${formatCents(subtotalCents)}`}
      </button>
    </form>
  );
}
