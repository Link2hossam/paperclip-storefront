import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { updateCartItemQuantity } from "@/lib/cart";

const UpdateSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(99),
});

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const parsed = UpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const cookieCartId = request.cookies.get("paperclip_cart_id")?.value;
  if (!cookieCartId) {
    return NextResponse.json({ error: "No cart" }, { status: 404 });
  }

  const { productId, quantity } = parsed.data;
  const db = getDb();

  try {
    await updateCartItemQuantity(db, cookieCartId, productId, quantity);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update cart";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
