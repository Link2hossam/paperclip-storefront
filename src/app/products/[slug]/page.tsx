import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import AddToCartButton from "./add-to-cart-button";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!process.env.DATABASE_URL) {
    return (
      <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '0 auto', padding: 24 }}>
        <p>Database not configured.</p>
      </main>
    );
  }

  const db = getDb();
  const product = await db.select().from(products).where(eq(products.slug, slug)).limit(1);

  if (product.length === 0) {
    notFound();
  }

  const p = product[0];

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <Link href="/products" style={{ color: '#0066cc', fontSize: 14 }}>&larr; All products</Link>
      <h1 style={{ fontSize: 28, margin: '16px 0 8px' }}>{p.name}</h1>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        ${(p.priceCents / 100).toFixed(2)}
      </div>
      {p.description && (
        <p style={{ fontSize: 16, lineHeight: 1.6, color: '#333', marginBottom: 24 }}>
          {p.description}
        </p>
      )}
      {!p.inStock ? (
        <div style={{ padding: '12px 16px', background: '#fee', borderRadius: 6, color: '#c00', fontWeight: 600 }}>
          Out of stock
        </div>
      ) : (
        <AddToCartButton productId={p.id} />
      )}
    </main>
  );
}
