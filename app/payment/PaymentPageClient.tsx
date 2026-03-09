"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutHeader } from "@/components/CheckoutHeader";
import { useCheckoutStore } from "@/lib/store/checkoutStore";

export function PaymentPageClient() {
  const router = useRouter();
  const { cart, shippingAddress, clearCheckout } = useCheckoutStore();
  const [isPaying, setIsPaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!cart || !shippingAddress) {
      router.replace("/cart");
    }
  }, [cart, shippingAddress, router]);

  if (!cart || !shippingAddress) {
    return null;
  }

  const subtotal = cart.cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );
  const shipping = cart.shipping_fee;
  const total = subtotal + shipping - cart.discount_applied;

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsSuccess(true);
      setIsPaying(false);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <CheckoutHeader currentStep="payment" />
        <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-0">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-emerald-50">
          <h1 className="mb-2 text-2xl font-semibold text-emerald-700">
            Order successful!
          </h1>
          <p className="mb-6 text-sm text-zinc-600">
            Thank you for choosing sustainable products with Ecoyaan.
          </p>
          <button
            type="button"
            onClick={() => {
              clearCheckout();
              router.push("/cart");
            }}
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Back to cart
          </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <CheckoutHeader currentStep="payment" />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row md:px-0">
        <section className="flex-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-50">
          <h1 className="mb-4 text-2xl font-semibold text-zinc-900">
            Review & pay
          </h1>

          <div className="mb-6 rounded-xl border border-zinc-100 p-4 text-sm text-zinc-700">
            <h2 className="mb-2 text-sm font-semibold text-zinc-900">
              Shipping to
            </h2>
            <p className="font-medium">{shippingAddress.fullName}</p>
            <p>{shippingAddress.email}</p>
            <p>{shippingAddress.phone}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.pinCode}
            </p>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={isPaying}
            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isPaying ? "Processing..." : "Pay securely"}
          </button>
        </section>

        <aside className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-50">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            Order summary
          </h2>
          <ul className="mb-4 space-y-2 text-sm text-zinc-700">
            {cart.cartItems.map((item) => (
              <li
                key={item.product_id}
                className="flex items-center justify-between"
              >
                <span className="line-clamp-1">
                  {item.product_name}{" "}
                  <span className="text-xs text-zinc-500">
                    × {item.quantity}
                  </span>
                </span>
                <span className="ml-2 font-medium">
                  ₹{item.product_price * item.quantity}
                </span>
              </li>
            ))}
          </ul>
          <dl className="space-y-1 text-sm text-zinc-700">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>₹{subtotal}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>₹{shipping}</dd>
            </div>
            {cart.discount_applied > 0 && (
              <div className="flex justify-between text-emerald-600">
                <dt>Discount</dt>
                <dd>-₹{cart.discount_applied}</dd>
              </div>
            )}
            <div className="mt-3 flex justify-between border-t border-zinc-200 pt-3 text-base font-semibold text-zinc-900">
              <dt>Total</dt>
              <dd>₹{total}</dd>
            </div>
          </dl>
        </aside>
      </main>
    </div>
  );
}

