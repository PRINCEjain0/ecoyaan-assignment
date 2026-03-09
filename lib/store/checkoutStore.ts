import { create } from "zustand";
import type { CartResponse, ShippingAddress } from "../types";

type CheckoutState = {
  cart: CartResponse | null;
  shippingAddress: ShippingAddress | null;
  setCart: (cart: CartResponse) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  clearCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  cart: null,
  shippingAddress: null,
  setCart: (cart) => set({ cart }),
  setShippingAddress: (shippingAddress) => set({ shippingAddress }),
  clearCheckout: () => set({ cart: null, shippingAddress: null }),
}));

