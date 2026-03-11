"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutHeader } from "@/components/CheckoutHeader";
import { useCheckoutStore } from "@/lib/store/checkoutStore";

export function PaymentPageClient() {
  const router = useRouter();
  const { cart, addresses, selectedAddressId, clearCheckout, hasHydrated } =
    useCheckoutStore();
  const [isPaying, setIsPaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");

  const shippingAddress = selectedAddressId
    ? addresses.find((a) => a.id === selectedAddressId) ?? null
    : null;

  useEffect(() => {
    if (hasHydrated && (!cart || !shippingAddress)) {
      router.replace("/cart");
    }
  }, [cart, hasHydrated, shippingAddress, router]);

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
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <span className="text-xl font-semibold">✓</span>
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-emerald-800">
              Order successful!
            </h1>
            <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-zinc-600">
              Payment received. We’ll start preparing your eco-friendly order and
              send updates to your email.
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
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-0">
        <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-50">
          <h1 className="mb-4 text-2xl font-semibold text-zinc-900">
            Review & pay
          </h1>

          <div className="mb-4 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 text-sm text-zinc-700">
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

          <div className="rounded-xl border border-zinc-100 p-4">
            <h2 className="mb-2 text-sm font-semibold text-zinc-900">
              Payment method
            </h2>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
              <span className="font-medium">Total payable</span>
              <span className="font-semibold">₹{total}</span>
            </div>

            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex w-full items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  paymentMethod === "card"
                    ? "border-emerald-200 bg-emerald-50/40 shadow-sm"
                    : "border-zinc-100 bg-white hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100">
                    <span className="text-sm font-semibold">C</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Card
                    </p>
                    <p className="text-xs text-zinc-500">
                      Visa / Mastercard / RuPay
                    </p>
                  </div>
                </div>
                <div
                  className={`mt-1 h-4 w-4 rounded-full border ${
                    paymentMethod === "card"
                      ? "border-emerald-600 bg-emerald-600"
                      : "border-zinc-300 bg-white"
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`flex w-full items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  paymentMethod === "upi"
                    ? "border-emerald-200 bg-emerald-50/40 shadow-sm"
                    : "border-zinc-100 bg-white hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-50 text-zinc-700 ring-1 ring-zinc-100">
                    <span className="text-sm font-semibold">U</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">UPI</p>
                    <p className="text-xs text-zinc-500">
                      Pay using any UPI app
                    </p>
                  </div>
                </div>
                <div
                  className={`mt-1 h-4 w-4 rounded-full border ${
                    paymentMethod === "upi"
                      ? "border-emerald-600 bg-emerald-600"
                      : "border-zinc-300 bg-white"
                  }`}
                />
              </button>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              Payments are processed securely. We do not store your card details.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => router.push("/shipping")}
                className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 sm:w-auto"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={isPaying}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:w-auto"
              >
                {isPaying ? "Processing..." : "Pay securely"}
              </button>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-50 md:sticky md:top-6">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            Order summary
          </h2>
          <ul className="mb-4 space-y-2 text-sm text-zinc-700">
            {cart.cartItems.map((item) => (
              <li
                key={item.product_id}
                className="flex items-start justify-between gap-3"
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
        </div>
      </main>
    </div>
  );
}

