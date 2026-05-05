import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getValidatedCart } from "@/lib/cart";
import { getOrCreateCartId, cartCookieOptions } from "@/lib/cart/cookie";
import { trackEvent } from "@/lib/funnel";

export async function GET(request: NextRequest) {
  const cookieCartId = request.cookies.get("paperclip_cart_id")?.value ?? await getOrCreateCartId();
  const db = getDb();

  try {
    const cart = await getValidatedCart(db, cookieCartId);

    await trackEvent(cookieCartId, {
      event: "view_cart",
      cartId: cart.cartId,
    });

    const response = NextResponse.json(cart);
    if (cart.isNew) {
      response.cookies.set(cartCookieOptions(cookieCartId));
    }
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get cart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
