/* Wortmarke: "datali" in Archivo 700, das o ist der offene Signal-Ring.
   Drei Farbwege: Signal auf hell, Signal auf Ink, Weiß auf Signal. */
export function Logo({
  size = 24,
  inverse = false,
  onSignal = false,
  className = "",
}: {
  size?: number;
  inverse?: boolean;
  onSignal?: boolean;
  className?: string;
}) {
  const ring = onSignal ? "#ffffff" : "var(--color-signal)";
  const text = onSignal
    ? "#ffffff"
    : inverse
      ? "var(--color-ground)"
      : "var(--color-ink)";
  const ringSize = size * 0.72;
  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ lineHeight: 1 }}
      aria-label="datalio"
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: size,
          letterSpacing: "-0.04em",
          color: text,
        }}
      >
        datali
      </span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: ringSize,
          height: ringSize,
          marginLeft: size * 0.08,
          border: `${Math.max(2, size * 0.19)}px solid ${ring}`,
          borderRadius: 999,
        }}
      />
    </span>
  );
}
