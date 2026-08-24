"use client";

import type { CSSProperties, ReactNode } from "react";

/* Endloslauf für Integrationen (Magic-UI-Muster, linear und flach). */
export function Marquee({
  children,
  duration = 40,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={`dl-marquee group flex overflow-hidden ${className}`}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className="dl-marquee-track flex shrink-0 items-center"
        >
          {children}
        </div>
      ))}
    </div>
  );
}
