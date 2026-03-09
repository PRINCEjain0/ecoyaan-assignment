"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCheckoutStore } from "@/lib/store/checkoutStore";
import type { CartResponse } from "@/lib/types";

type CartPageClientProps = {
  initialCart: CartResponse;
};

export function CartPageClient({ initialCart }: CartPageClientProps) {
  const { cart, setCart } = useCheckoutStore();

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart, setCart]);

  const effectiveCart = cart ?? initialCart;

  const subtotal = effectiveCart.cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );
  const shipping = effectiveCart.shipping_fee;
  const total = subtotal + shipping - effectiveCart.discount_applied;

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 md:flex-row">
        <section className="flex-1 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-2xl font-semibold text-zinc-900">
            Cart summary
          </h1>
          <div className="space-y-4">
            {effectiveCart.cartItems.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center gap-4 rounded-xl border border-zinc-100 p-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={item.image}
                    alt={item.product_name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm font-medium text-zinc-900">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right text-sm font-semibold text-zinc-900">
                  ₹{item.product_price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Order summary
          </h2>
          <dl className="space-y-2 text-sm text-zinc-700">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>₹{subtotal}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>₹{shipping}</dd>
            </div>
            {effectiveCart.discount_applied > 0 && (
              <div className="flex justify-between text-emerald-600">
                <dt>Discount</dt>
                <dd>-₹{effectiveCart.discount_applied}</dd>
              </div>
            )}
            <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4 text-base font-semibold text-zinc-900">
              <dt>Total</dt>
              <dd>₹{total}</dd>
            </div>
          </dl>

          <Link
            href="/shipping"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

