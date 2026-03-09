import Link from "next/link";

type CheckoutStep = "cart" | "shipping" | "payment";

type CheckoutHeaderProps = {
  currentStep: CheckoutStep;
};

const steps: { id: CheckoutStep; label: string; href: string }[] = [
  { id: "cart", label: "Cart", href: "/cart" },
  { id: "shipping", label: "Shipping", href: "/shipping" },
  { id: "payment", label: "Payment", href: "/payment" },
];

export function CheckoutHeader({ currentStep }: CheckoutHeaderProps) {
  return (
    <header className="border-b border-emerald-100 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 md:px-0">
        <Link href="/cart" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
            Eco
          </div>
          <span className="text-sm font-semibold tracking-tight text-emerald-900">
            Ecoyaan Checkout
          </span>
        </Link>

        <nav className="hidden items-center gap-3 text-xs font-medium text-emerald-900 md:flex">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted =
              steps.findIndex((s) => s.id === currentStep) > index;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : isCompleted
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-emerald-200 bg-white text-emerald-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={
                    isActive
                      ? "text-emerald-900"
                      : isCompleted
                        ? "text-emerald-700"
                        : "text-emerald-400"
                  }
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <span className="text-emerald-200">—</span>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

