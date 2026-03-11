import type { ReactNode } from "react";

type StickyActionBarProps = {
  left: ReactNode;
  right: ReactNode;
};

export function StickyActionBar({ left, right }: StickyActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-0">
        <div className="flex-1">{left}</div>
        <div className="flex flex-1 justify-end">{right}</div>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}

