import { PostHog } from "posthog-node";
import { env } from "./env";

let _posthog: PostHog | null = null;

export function getPostHog(): PostHog | null {
  if (!_posthog && env.NEXT_PUBLIC_POSTHOG_KEY) {
    _posthog = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  }
  return _posthog;
}

export function capturePurchase(params: {
  orderId: string;
  valueCents: number;
  currency: string;
  items: Array<{ productId: string; name: string; quantity: number }>;
  customerEmail?: string;
}) {
  try {
    const client = getPostHog();
    if (!client) return;
    const distinctId = params.customerEmail ?? params.orderId;
    client.capture({
      distinctId,
      event: "purchase",
      properties: {
        orderId: params.orderId,
        value: params.valueCents / 100,
        valueCents: params.valueCents,
        currency: params.currency,
        items: params.items,
      },
    });
  } catch {}
}

export function captureCheckoutStarted(params: {
  sessionId: string;
  valueCents: number;
  currency: string;
  items: Array<{ productId: string; name: string; quantity: number }>;
}) {
  try {
    const client = getPostHog();
    if (!client) return;
    client.capture({
      distinctId: params.sessionId,
      event: "begin_checkout",
      properties: {
        checkoutSessionId: params.sessionId,
        value: params.valueCents / 100,
        valueCents: params.valueCents,
        currency: params.currency,
        items: params.items,
      },
    });
  } catch {}
}
