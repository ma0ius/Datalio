/* Dezentes Rasterlinienmuster als Hintergrund (React-Bits-Muster,
   reduziert auf das Datalio-Raster: flache Steel-Linien, kein Verlauf). */
export function GridPattern({
  size = 56,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <pattern
          id="dl-grid"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="var(--color-steel-300)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dl-grid)" opacity="0.55" />
    </svg>
  );
}
