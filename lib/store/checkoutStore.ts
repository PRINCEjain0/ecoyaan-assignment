import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartResponse, ShippingAddress } from "../types";

type CheckoutState = {
  hasHydrated: boolean;
  cart: CartResponse | null;
  addresses: ShippingAddress[];
  selectedAddressId: string | null;
  setHasHydrated: (hasHydrated: boolean) => void;
  setCart: (cart: CartResponse) => void;
  addAddress: (address: ShippingAddress) => void;
  updateAddress: (address: ShippingAddress) => void;
  removeAddress: (addressId: string) => void;
  selectAddress: (addressId: string | null) => void;
  clearCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      cart: null,
      addresses: [],
      selectedAddressId: null,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setCart: (cart) => set({ cart }),
      addAddress: (address) =>
        set((state) => ({
          addresses: [address, ...state.addresses],
          selectedAddressId: address.id,
        })),
      updateAddress: (address) =>
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === address.id ? address : a,
          ),
        })),
      removeAddress: (addressId) =>
        set((state) => {
          const nextAddresses = state.addresses.filter((a) => a.id !== addressId);
          const nextSelected =
            state.selectedAddressId === addressId
              ? nextAddresses[0]?.id ?? null
              : state.selectedAddressId;
          return { addresses: nextAddresses, selectedAddressId: nextSelected };
        }),
      selectAddress: (selectedAddressId) => set({ selectedAddressId }),
      clearCheckout: () => set({ cart: null, selectedAddressId: null }),
    }),
    {
      name: "ecoyaan-checkout",
      partialize: (state) => ({
        cart: state.cart,
        addresses: state.addresses,
        selectedAddressId: state.selectedAddressId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

