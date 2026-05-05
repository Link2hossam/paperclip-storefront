import Stripe from "stripe";
import { requireEnv } from "../env";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiVersion: "2026-04-22.dahlia" as any,
      typescript: true,
    });
  }
  return _stripe;
}
