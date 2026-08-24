import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "inverse";

const styles: Record<Variant, string> = {
  primary:
    "bg-signal text-white hover:bg-signal-strong active:bg-signal-deep",
  outline:
    "border-2 border-ink text-ink hover:bg-steel-200 active:bg-steel-300",
  ghost: "text-ink hover:bg-steel-200 active:bg-steel-300",
  inverse:
    "border-2 border-ground text-ground hover:bg-steel-800 active:bg-steel-700",
};

const base =
  "inline-flex items-center gap-2 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-150 cursor-pointer select-none";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <a className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
