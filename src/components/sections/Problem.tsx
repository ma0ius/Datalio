import {
  FileWarning,
  Clock,
  SearchX,
  TrendingDown,
  MousePointerClick,
  PackageX,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "../fx/Reveal";

const pains = [
  {
    icon: FileWarning,
    title: "Unvollständige Lieferantendaten",
    text: "Excel Listen mit Lücken und Formatbrüchen. Die Nacharbeit dauert Wochen und bindet Ihre besten Leute.",
  },
  {
    icon: Clock,
    title: "Langsamer Marktstart",
    text: "Neue Modelle stehen erst nach Wochen im Shop. Die Saison wartet nicht, der Wettbewerb verkauft schon.",
  },
  {
    icon: SearchX,
    title: "Unsichtbar für KI Suchen",
    text: "Unstrukturierte Daten tauchen in ChatGPT, Gemini und Perplexity nicht auf. Empfohlen wird, was maschinenlesbar ist.",
  },
  {
    icon: TrendingDown,
    title: "Niedrige Conversion",
    text: "Fehlende Attribute, Bilder und Texte kosten Kaufabschlüsse. Unvollständige Produktseiten verkaufen nicht.",
  },
  {
    icon: MousePointerClick,
    title: "Hoher manueller Aufwand",
    text: "20 Minuten Pflege pro Artikel. Bei tausenden SKUs ist das ein Vollzeitteam nur für Datenpflege.",
  },
  {
    icon: PackageX,
    title: "Fehlbestellungen und Retouren",
    text: "Falsche Maße und Spezifikationen führen zu Retouren, Reklamationen und Logistikkosten.",
  },
];

export function Problem() {
  return (
    <section className="border-b-2 border-ink bg-ground">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <p className="dl-label text-signal-strong">Status quo</p>
          <h2 className="dl-display mt-4 max-w-[24ch] text-[34px] md:text-[50px]">
            Katalogpflege bremst Ihr Wachstum.
          </h2>
        </Reveal>
        <RevealGroup className="dl-grid mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pains.map((p) => (
            <RevealItem key={p.title} className="px-6 py-7">
              <p.icon size={20} strokeWidth={2} className="text-ink" />
              <h3 className="mt-4 text-[17px] font-bold leading-tight">
                {p.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-steel-600">
                {p.text}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal delay={0.1}>
          <p className="mt-8 font-mono text-[13px] text-steel-600">
            Jeder dieser Punkte kostet täglich Geld. Zusammen entscheiden sie
            darüber, ob Ihr Katalog wächst oder Ihr Team.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
