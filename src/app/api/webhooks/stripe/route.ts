import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { getDb } from "@/lib/db";
import { orders, lineItems as lineItemsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { capturePurchase } from "@/lib/analytics";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutExpired(session);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!env.DATABASE_URL) {
    capturePurchaseFromSession(session);
    return;
  }

  const db = getDb();

  const existing = await db.query.orders.findFirst({
    where: eq(orders.stripeSessionId, session.id),
  });

  if (existing?.status === "paid") {
    console.log(`Order for session ${session.id} already marked paid — idempotent skip`);
    return;
  }

  const paymentIntentId = session.payment_intent as string | null;
  const customerEmail = session.customer_details?.email ?? null;

  if (existing) {
    await db
      .update(orders)
      .set({
        status: "paid",
        stripePaymentIntentId: paymentIntentId,
        customerEmail,
        updatedAt: new Date(),
      })
      .where(eq(orders.stripeSessionId, session.id));
  } else {
    const [order] = await db
      .insert(orders)
      .values({
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        status: "paid",
        customerEmail,
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
      })
      .returning();

    if (order) {
      const itemsFromMetadata = session.metadata?.itemsJson;
      if (itemsFromMetadata) {
        try {
          const parsed = JSON.parse(itemsFromMetadata) as Array<{
            productId: string;
            name: string;
            quantity: number;
            unitPrice: number;
          }>;
          await db.insert(lineItemsTable).values(
            parsed.map((i) => ({
              orderId: order.id,
              productId: i.productId,
              productName: i.name,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            }))
          );
        } catch {
          console.error("Failed to parse line items from session metadata");
        }
      }
    }
  }

  capturePurchaseFromSession(session);
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  if (!env.DATABASE_URL) return;

  const db = getDb();
  await db
    .update(orders)
    .set({ status: "failed", updatedAt: new Date() })
    .where(eq(orders.stripeSessionId, session.id));
}

function capturePurchaseFromSession(session: Stripe.Checkout.Session) {
  let items: Array<{ productId: string; name: string; quantity: number }> = [];
  try {
    const raw = session.metadata?.itemsJson;
    if (raw) {
      items = JSON.parse(raw);
    }
  } catch {
    // ignore parse failures for analytics
  }

  capturePurchase({
    orderId: session.id,
    valueCents: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    items,
    customerEmail: session.customer_details?.email ?? undefined,
  });
}
