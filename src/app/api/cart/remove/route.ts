import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { removeFromCart } from "@/lib/cart";

const RemoveSchema = z.object({
  productId: z.string().uuid(),
});

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const parsed = RemoveSchema.safeParse(body);

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

  const { productId } = parsed.data;
  const db = getDb();

  try {
    await removeFromCart(db, cookieCartId, productId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to remove item";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
