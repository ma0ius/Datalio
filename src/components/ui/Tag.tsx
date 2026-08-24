import type { ReactNode } from "react";

type Tone = "neutral" | "signal" | "success" | "warning";

const tones: Record<Tone, string> = {
  neutral: "bg-steel-200 text-steel-700",
  signal: "bg-signal-tint text-signal-strong",
  success: "bg-[#e3ede5] text-success",
  warning: "bg-[#f4ead3] text-warning",
};

export function Tag({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`dl-label inline-flex items-center gap-1.5 px-2 py-1 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
