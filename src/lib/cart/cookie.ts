import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const CART_COOKIE_NAME = "paperclip_cart_id";

export function getCartCookieName(): string {
  return CART_COOKIE_NAME;
}

export async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE_NAME);

  if (existing?.value) {
    return existing.value;
  }

  const newId = uuidv4();
  return newId;
}

export async function getCartId(): Promise<string | null> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE_NAME);
  return existing?.value ?? null;
}

export function cartCookieOptions(cartId: string) {
  return {
    name: CART_COOKIE_NAME,
    value: cartId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  };
}
