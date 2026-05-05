import Link from "next/link";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let allProducts: (typeof products.$inferSelect)[] = [];

  if (process.env.DATABASE_URL) {
    try {
      const db = getDb();
      allProducts = await db.select().from(products);
    } catch {
      // DB unavailable — show empty state
    }
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Products</h1>
      {allProducts.length === 0 ? (
        <p style={{ color: '#666' }}>No products available yet. Run <code>npm run db:seed</code> to add sample products.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {allProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: 16,
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{product.name}</div>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                {product.description?.slice(0, 100)}{product.description && product.description.length > 100 ? '...' : ''}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                ${(product.priceCents / 100).toFixed(2)}
              </div>
              {!product.inStock && (
                <div style={{ color: '#c00', fontSize: 13, marginTop: 4 }}>Out of stock</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
