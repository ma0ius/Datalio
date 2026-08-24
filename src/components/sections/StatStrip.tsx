import { NumberTicker } from "../fx/NumberTicker";
import { Reveal } from "../fx/Reveal";

const stats = [
  { value: 70, prefix: "−", suffix: " %", label: "Pflegeaufwand pro Artikel" },
  { value: 12, suffix: "", label: "Angebundene Kanäle" },
  { value: 40, suffix: "+", label: "Sprachen für Produkttexte" },
  { value: 45, suffix: " s", label: "Statt 20 min pro Artikel" },
];

export function StatStrip() {
  return (
    <section className="border-b-2 border-ink bg-paper">
      <Reveal>
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-5 py-8 md:px-10 ${i > 0 ? "border-l-2 border-ink max-lg:[&:nth-child(3)]:border-l-0" : ""} ${i >= 2 ? "max-lg:border-t-2 max-lg:border-ink" : ""}`}
            >
              <p className="dl-display text-[36px] text-signal-strong md:text-[44px]">
                <NumberTicker value={s.value} prefix={s.prefix ?? ""} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[13px] text-steel-600">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
