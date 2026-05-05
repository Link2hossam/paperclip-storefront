import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { getValidatedCart } from "@/lib/cart";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { captureCheckoutStarted } from "@/lib/analytics";

const CheckoutSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  address_line1: z.string().min(1),
  address_line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postal_code: z.string().min(1),
  country: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const cookieCartId = request.cookies.get("paperclip_cart_id")?.value;
  if (!cookieCartId) {
    return NextResponse.json({ error: "No cart" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = CheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid shipping details", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();
  const cart = await getValidatedCart(db, cookieCartId);

  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const shipping = parsed.data;

  captureCheckoutStarted({
    sessionId: cart.cartId,
    valueCents: cart.subtotalCents,
    currency: "usd",
    items: cart.items.map((i) => ({ productId: i.productId, name: i.name, quantity: i.quantity })),
  });

  if (env.STRIPE_SECRET_KEY) {
    const stripe = getStripe();

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: shipping.email,
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB"] },
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        cart_id: cart.cartId,
        name: shipping.name,
        address_line1: shipping.address_line1,
        address_line2: shipping.address_line2 ?? "",
        city: shipping.city,
        state: shipping.state,
        postal_code: shipping.postal_code,
        country: shipping.country,
        itemsJson: JSON.stringify(
          cart.items.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.priceCents,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  }

  return NextResponse.json({
    url: `/checkout/success?cart_id=${cart.cartId}`,
    message: "Stripe not configured — checkout simulated",
  });
}
