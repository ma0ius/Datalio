"use client";

import { Reveal, RevealGroup, RevealItem } from "../fx/Reveal";

/* Datenfluss: Quellen → Ring → Kanäle, mit laufenden Signal-Punkten */
function FlowDiagram() {
  const sources = ["Warenwirtschaft", "ERP", "Lieferantenliste", "Herstellerportal"];
  const targets = ["Shop", "Marktplatz", "Preisportal", "Datenfeed"];
  const ys = [36, 96, 156, 216];
  return (
    <svg viewBox="0 0 900 252" className="w-full" role="img" aria-label="Datenfluss durch Datalio">
      {ys.map((y, i) => (
        <g key={`s${i}`}>
          <path
            id={`p-in-${i}`}
            d={`M 196 ${y} C 300 ${y}, 340 126, 404 126`}
            fill="none"
            stroke="var(--color-steel-300)"
            strokeWidth="2"
          />
          <circle r="4" fill="var(--color-signal)">
            <animateMotion dur={`${2.6 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}>
              <mpath href={`#p-in-${i}`} />
            </animateMotion>
          </circle>
          <rect x="16" y={y - 20} width="180" height="40" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
          <text x="32" y={y + 5} fontFamily="Archivo, sans-serif" fontSize="14" fontWeight="600" fill="var(--color-ink)">
            {sources[i]}
          </text>
        </g>
      ))}
      {ys.map((y, i) => (
        <g key={`t${i}`}>
          <path
            id={`p-out-${i}`}
            d={`M 496 126 C 560 126, 600 ${y}, 704 ${y}`}
            fill="none"
            stroke="var(--color-steel-300)"
            strokeWidth="2"
          />
          <circle r="4" fill="var(--color-signal)">
            <animateMotion dur={`${2.4 + i * 0.45}s`} repeatCount="indefinite" begin={`${0.8 + i * 0.3}s`}>
              <mpath href={`#p-out-${i}`} />
            </animateMotion>
          </circle>
          <rect x="704" y={y - 20} width="180" height="40" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
          <text x="720" y={y + 5} fontFamily="Archivo, sans-serif" fontSize="14" fontWeight="600" fill="var(--color-ink)">
            {targets[i]}
          </text>
        </g>
      ))}
      <circle cx="450" cy="126" r="34" fill="var(--color-ground)" stroke="var(--color-signal)" strokeWidth="15" />
    </svg>
  );
}

const steps = [
  {
    nr: "01",
    title: "Importieren",
    text: "CSV, Excel, BMEcat oder direkte Anbindung an Wawi und ERP. Datalio liest, was Ihre Lieferanten und Hersteller liefern.",
  },
  {
    nr: "02",
    title: "Zusammenführen",
    text: "Ein Datensatz je Artikel. Dubletten werden aufgelöst, Formate vereinheitlicht, Lücken sichtbar gemacht.",
  },
  {
    nr: "03",
    title: "Anreichern",
    text: "KI erstellt Texte, Attribute und Übersetzungen. Ihr Team prüft und gibt frei.",
  },
  {
    nr: "04",
    title: "Publizieren",
    text: "Shop, Marktplatz, Katalog und Datenfeeds. Jede Änderung erreicht jeden Kanal.",
  },
];

export function Workflow() {
  return (
    <section id="ablauf" className="border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <p className="dl-label text-signal-strong">Ablauf</p>
          <h2 className="dl-display mt-4 max-w-[24ch] text-[34px] md:text-[50px]">
            Von der Lieferantenliste zum Kanal. In vier Schritten.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-12 hidden md:block">
          <FlowDiagram />
        </Reveal>
        <RevealGroup className="dl-grid mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <RevealItem key={s.nr} className="px-6 py-7">
              <p className="dl-display text-[28px] text-signal">{s.nr}</p>
              <h3 className="mt-3 text-[18px] font-bold">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-steel-600">{s.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
