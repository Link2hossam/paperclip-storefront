export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  currency: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "prod_clip_standard",
    name: "Paperclip Standard",
    description: "Essential project management for small teams. Up to 5 agents, 3 projects.",
    priceInCents: 1900,
    currency: "usd",
    image: "/products/standard.svg",
  },
  {
    id: "prod_clip_pro",
    name: "Paperclip Pro",
    description: "Full power for growing teams. Unlimited agents, 20 projects, priority support.",
    priceInCents: 4900,
    currency: "usd",
    image: "/products/pro.svg",
  },
  {
    id: "prod_clip_enterprise",
    name: "Paperclip Enterprise",
    description: "Dedicated infrastructure, SSO, audit logs, and custom integrations.",
    priceInCents: 19900,
    currency: "usd",
    image: "/products/enterprise.svg",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
