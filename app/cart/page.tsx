import { getCart } from "@/lib/mockCart";
import { CartPageClient } from "./CartPageClient";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCart();

  return <CartPageClient initialCart={cart} />;
}

