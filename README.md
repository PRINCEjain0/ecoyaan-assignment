## Ecoyaan Checkout Flow (Frontend Assignment)

This repository implements a simplified Ecoyaan-style checkout experience using **Next.js App Router**, **Zustand** for shared state, and **React Hook Form + Zod** for form handling and validation.

The flow guides a user from reviewing their cart to entering a shipping address, confirming the order, and finally seeing an **“Order successful!”** success screen after a simulated payment.

### Tech stack

- **Next.js 16 (App Router)** with Server Components
- **TypeScript**
- **Zustand** for global checkout state (cart + shipping address)
- **React Hook Form + Zod** for type-safe, validated forms
- **Tailwind CSS** for styling

### Pages / flow

- `/cart` – **Cart / order summary**
  - Uses an async server function (`getCart`) to fetch mock cart data during SSR.
  - Renders cart items, subtotal, shipping, and total.
  - Hydrates the cart into the Zustand `useCheckoutStore`.
  - “Proceed to checkout” navigates to `/shipping`.

- `/shipping` – **Shipping address**
  - `"use client"` page using **React Hook Form + Zod**.
  - Fields: full name, email, phone (10 digits), PIN code (6 digits), city, state.
  - Shows inline validation messages for invalid/empty fields.
  - Displays a compact **order summary sidebar** using data from the Zustand cart.
  - If there is no cart in state (direct access / refresh), redirects back to `/cart`.
  - On submit, saves the shipping address into Zustand and navigates to `/payment`.

- `/payment` – **Payment / confirmation + success**
  - Reads cart + shipping address from Zustand.
  - Shows a full order summary and the chosen shipping address.
  - “Pay securely” simulates a payment.
  - On success, renders an **“Order successful!”** state with a button back to the cart.


### Running the project locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/cart` in your browser.

### State management

The shared checkout state lives in `lib/store/checkoutStore.ts`:

- `cart`: server-fetched cart data (items, shipping fee, discount).
- `shippingAddress`: values captured from the shipping form.
- `setCart`, `setShippingAddress`, `clearCheckout`: helper actions for the flow.

### Form validation

The shipping form uses a Zod schema to validate:

- Non-empty full name, city, and state.
- Valid email format.
- 10-digit numeric phone number.
- 6-digit numeric PIN code.

The schema is wired into React Hook Form via `zodResolver`, so errors are displayed inline under each field.

