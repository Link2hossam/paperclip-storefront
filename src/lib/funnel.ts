export type FunnelEvent =
  | "add_to_cart"
  | "view_cart"
  | "begin_checkout";

interface FunnelEventPayload {
  event: FunnelEvent;
  productId?: string;
  cartId?: string;
  quantity?: number;
  [key: string]: unknown;
}

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export async function trackEvent(
  distinctId: string,
  payload: FunnelEventPayload
): Promise<void> {
  if (!POSTHOG_KEY) {
    return;
  }

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event: payload.event,
        properties: {
          distinct_id: distinctId,
          $lib: "paperclip-storefront",
          ...payload,
        },
      }),
    });
  } catch {}
}
