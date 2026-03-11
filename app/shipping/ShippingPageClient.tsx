"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckoutHeader } from "@/components/CheckoutHeader";
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

const inputClassName =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2";

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `addr_${Date.now()}`;
}

function addressToFormValues(address: {
  fullName: string;
  email: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
}): ShippingFormValues {
  return {
    fullName: address.fullName,
    email: address.email,
    phone: address.phone,
    pinCode: address.pinCode,
    city: address.city,
    state: address.state,
  };
}

export function ShippingPageClient() {
  const router = useRouter();
  const {
    cart,
    addresses,
    selectedAddressId,
    addAddress,
    removeAddress,
    updateAddress,
    selectAddress,
    hasHydrated,
  } = useCheckoutStore();

  const selectedAddress = useMemo(() => {
    return selectedAddressId
      ? addresses.find((a) => a.id === selectedAddressId) ?? null
      : null;
  }, [addresses, selectedAddressId]);

  type Mode = "select" | "add" | "edit";
  const [mode, setMode] = useState<Mode>(addresses.length ? "select" : "add");
  const effectiveMode: Mode = addresses.length === 0 ? "add" : mode;
  const [selectError, setSelectError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      pinCode: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = (values: ShippingFormValues) => {
    if (effectiveMode === "edit" && selectedAddress) {
      updateAddress({ id: selectedAddress.id, ...values });
      setMode("select");
      router.push("/payment");
      return;
    }

    addAddress({ id: createId(), ...values });
    setMode("select");
    router.push("/payment");
  };

  useEffect(() => {
    if (hasHydrated && !cart) {
      router.replace("/cart");
    }
  }, [cart, hasHydrated, router]);

  useEffect(() => {
    if (!hasHydrated) return;
    // If addresses were cleared, force add mode.
    if (addresses.length === 0) {
      selectAddress(null);
      reset({
        fullName: "",
        email: "",
        phone: "",
        pinCode: "",
        city: "",
        state: "",
      });
      return;
    }

    // In edit mode, keep the form synced to the selected address.
    if (effectiveMode === "edit" && selectedAddress) {
      reset(addressToFormValues(selectedAddress));
    }
  }, [
    addresses.length,
    effectiveMode,
    hasHydrated,
    reset,
    selectAddress,
    selectedAddress,
  ]);

  const subtotal =
    cart?.cartItems.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0,
    ) ?? 0;
  const shipping = cart?.shipping_fee ?? 0;
  const total = subtotal + shipping - (cart?.discount_applied ?? 0);

  return (
    <div className="min-h-screen bg-zinc-50">
      <CheckoutHeader currentStep="shipping" />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row md:px-0">
        <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-50">
          <h1 className="mb-1 text-2xl font-semibold text-zinc-900">
            Shipping address
          </h1>
          <p className="mb-6 text-sm text-zinc-500">
            Enter your details so we can deliver your eco-friendly order.
          </p>

          {addresses.length > 0 && (
            <div className="mb-6 rounded-2xl border border-zinc-100 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Saved addresses
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setMode("add");
                    selectAddress(null);
                    setSelectError(null);
                    reset({
                      fullName: "",
                      email: "",
                      phone: "",
                      pinCode: "",
                      city: "",
                      state: "",
                    });
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Add new
                </button>
              </div>

              <div className="space-y-2">
                {addresses.map((a) => {
                  const isSelected = a.id === selectedAddressId;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        selectAddress(a.id);
                        setMode("select");
                        setSelectError(null);
                      }}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-zinc-100 bg-white hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">
                            {a.fullName}
                          </p>
                          <p className="text-xs text-zinc-600">
                            {a.city}, {a.state} {a.pinCode}
                          </p>
                          <p className="text-xs text-zinc-500">{a.phone}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {isSelected && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMode("edit");
                                setSelectError(null);
                                reset(addressToFormValues(a));
                              }}
                              className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const ok = window.confirm(
                                "Delete this address? This cannot be undone.",
                              );
                              if (!ok) return;
                              removeAddress(a.id);
                            }}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                          <div
                            className={`mt-0.5 h-4 w-4 rounded-full border ${
                              isSelected
                                ? "border-emerald-600 bg-emerald-600"
                                : "border-zinc-300 bg-white"
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {(effectiveMode === "add" || effectiveMode === "edit") && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-zinc-900">
              {effectiveMode === "edit" ? "Edit address" : "Add new address"}
            </h2>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMode("select");
                }}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-800"
              >
                Cancel
              </button>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-800">
              Full name
            </label>
            <input
              type="text"
              {...register("fullName")}
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
                className={inputClassName}
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
                className={inputClassName}
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
              className={inputClassName}
            />
            {errors.state && (
              <p className="mt-1 text-xs text-red-600">
                {errors.state.message}
              </p>
            )}
          </div>
          </form>
          )}

          <div className="mt-8 flex flex-col gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => router.push("/cart")}
              className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 sm:w-auto"
            >
              Back
            </button>

            {effectiveMode === "select" ? (
              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedAddressId) {
                      setSelectError("Please select an address to continue.");
                      return;
                    }
                    router.push("/payment");
                  }}
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
                >
                  Next step
                </button>
                {selectError && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {selectError}
                  </p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:w-auto"
              >
                Save & continue
              </button>
            )}
          </div>
        </div>

        <aside className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-50">
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
      </main>
    </div>
  );
}

