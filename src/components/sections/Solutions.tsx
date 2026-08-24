import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "../fx/Reveal";

const segments = [
  {
    nr: "01",
    title: "Händler und E-Commerce",
    text: "Herstellerdaten werden zu verkaufsfertigen Produktseiten. SEO Texte, Attribute und Übersetzungen entstehen automatisch, die Freigabe bleibt bei Ihrem Team. Vom Markenrad bis zum Zubehör.",
    points: ["SEO Texte in 40+ Sprachen", "JTL, Shopify, Amazon, idealo", "Conversion optimierte Inhalte"],
  },
  {
    nr: "02",
    title: "Hersteller und Marken",
    text: "Ein konsistenter Markenauftritt über alle Kanäle. Spezifikationen, Zertifikate und Marketingtexte zentral gepflegt, Compliance Unterlagen wie CE und StVZO Angaben immer aktuell beim Handelspartner.",
    points: ["Markenportal für Handelspartner", "Compliance Verwaltung", "Asset Distribution"],
  },
  {
    nr: "03",
    title: "Großhandel und Distribution",
    text: "Tausende SKUs von hunderten Lieferanten in einem Datenbestand. Preislisten, technische Daten und Datenfeeds erreichen Ihre Handelspartner täglich und automatisch.",
    points: ["Datenfeeds per API, CSV, BMEcat", "Preislisten Synchronisation", "Händlerportale im eigenen Auftritt"],
  },
];

export function Solutions() {
  return (
    <section id="loesungen" className="border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <p className="dl-label text-signal-strong">Lösungen</p>
          <h2 className="dl-display mt-4 max-w-[26ch] text-[34px] md:text-[50px]">
            Ein System. Drei Blickwinkel auf Produktdaten.
          </h2>
        </Reveal>
        <RevealGroup className="dl-grid mt-12 grid-cols-1 lg:grid-cols-3">
          {segments.map((s) => (
            <RevealItem
              key={s.nr}
              className="group flex flex-col px-6 py-8 transition-colors duration-150 hover:bg-steel-100"
            >
              <p className="dl-display text-[34px] text-steel-300 transition-colors duration-150 group-hover:text-signal">
                {s.nr}
              </p>
              <h3 className="mt-4 text-[20px] font-bold leading-tight">{s.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.55] text-steel-600">{s.text}</p>
              <ul className="mt-5 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[13px] font-semibold">
                    <ArrowRight size={13} strokeWidth={2.5} className="text-signal" />
                    {p}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
