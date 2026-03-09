"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCheckoutStore } from "@/lib/store/checkoutStore";

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be a 10-digit number"),
  pinCode: z
    .string()
    .regex(/^[0-9]{6}$/, "PIN code must be 6 digits"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export function ShippingPageClient() {
  const router = useRouter();
  const { cart, shippingAddress, setShippingAddress } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingAddress ?? {
      fullName: "",
      email: "",
      phone: "",
      pinCode: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = (values: ShippingFormValues) => {
    setShippingAddress(values);
    router.push("/payment");
  };

  useEffect(() => {
    if (!cart) {
      router.replace("/cart");
    }
  }, [cart, router]);

  const subtotal =
    cart?.cartItems.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0,
    ) ?? 0;
  const shipping = cart?.shipping_fee ?? 0;
  const total = subtotal + shipping - (cart?.discount_applied ?? 0);

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 md:flex-row">
        <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-2xl font-semibold text-zinc-900">
            Shipping address
          </h1>
          <p className="mb-6 text-sm text-zinc-500">
            Enter your details so we can deliver your eco-friendly order.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-800">
              Full name
            </label>
            <input
              type="text"
              {...register("fullName")}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-800">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-800">
              Phone number
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">
                PIN code
              </label>
              <input
                type="text"
                inputMode="numeric"
                {...register("pinCode")}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
              />
              {errors.pinCode && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.pinCode.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">
                City
              </label>
              <input
                type="text"
                {...register("city")}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-800">
              State
            </label>
            <input
              type="text"
              {...register("state")}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
            />
            {errors.state && (
              <p className="mt-1 text-xs text-red-600">
                {errors.state.message}
              </p>
            )}
          </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              Continue to payment
            </button>
          </form>
        </div>

        <aside className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            Order summary
          </h2>
          {cart ? (
            <>
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
            </>
          ) : (
            <p className="text-sm text-zinc-500">
              Your cart summary will appear here once items are added.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

