import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";

async function seed() {
  const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

  const sampleProducts = [
    {
      name: "Classic Paperclip",
      slug: "classic-paperclip",
      description: "The original gem-style paperclip. 1.125 inches of corrosion-resistant steel wire. The shape that defined an industry.",
      priceCents: 499,
      imageUrl: "/images/classic-paperclip.jpg",
      inStock: true,
    },
    {
      name: "Jumbo Paperclip",
      slug: "jumbo-paperclip",
      description: "When regular just won't cut it. 2 inches of stainless steel for your biggest stacks. Purple accent optional.",
      priceCents: 799,
      imageUrl: "/images/jumbo-paperclip.jpg",
      inStock: true,
    },
    {
      name: "Bulldog Clip",
      slug: "bulldog-clip",
      description: "Spring-loaded grip. Fold-back handles. The bulldog doesn't let go. Holds up to 40 sheets.",
      priceCents: 1299,
      imageUrl: "/images/bulldog-clip.jpg",
      inStock: true,
    },
    {
      name: "Binder Clip Set (12)",
      slug: "binder-clip-set",
      description: "Twelve black-finished binder clips in small, medium, and large. The satisfying snap. The firm hold.",
      priceCents: 1999,
      imageUrl: "/images/binder-clips.jpg",
      inStock: true,
    },
    {
      name: "Paperclip Tin (100)",
      slug: "paperclip-tin",
      description: "One hundred premium paperclips in a reusable metal tin. Nostalgic. Practical. Always there when you need one.",
      priceCents: 2499,
      imageUrl: "/images/paperclip-tin.jpg",
      inStock: false,
    },
  ];

  for (const product of sampleProducts) {
    await db.insert(schema.products).values(product).onConflictDoNothing();
  }

  console.log("Seeded", sampleProducts.length, "products");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
