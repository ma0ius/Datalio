"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal } from "../fx/Reveal";
import { Tag } from "../ui/Tag";

const tabs = [
  { id: "stammdaten", label: "Stammdaten" },
  { id: "ki", label: "KI Anreicherung" },
  { id: "kanaele", label: "Kanäle" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function Stammdaten() {
  const rows = [
    { sku: "JB-1041-T", name: "Trekkingrad 28 Zoll, 24 Gang", quality: 100, status: "Freigegeben" },
    { sku: "JB-1042-E", name: "E-Bike City, 500 Wh Mittelmotor", quality: 96, status: "Freigegeben" },
    { sku: "JB-2050-Z", name: "Fahrradhelm mit MIPS, Größe M", quality: 74, status: "In Prüfung" },
    { sku: "JB-2051-Z", name: "Kettenschloss, 110 Glieder", quality: 41, status: "Unvollständig" },
  ];
  return (
    <div className="dl-grid grid-cols-1">
      <div className="hidden grid-cols-[110px_1fr_140px_120px] gap-4 px-4 py-2.5 md:grid">
        {["SKU", "Artikel", "Vollständigkeit", "Status"].map((h) => (
          <span key={h} className="dl-label text-steel-500">{h}</span>
        ))}
      </div>
      {rows.map((r) => (
        <div key={r.sku} className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-[110px_1fr_140px_120px] md:items-center md:gap-4">
          <span className="font-mono text-[12px] text-steel-600">{r.sku}</span>
          <span className="text-[14px] font-semibold">{r.name}</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 bg-steel-200">
              <div
                className="h-full"
                style={{
                  width: `${r.quality}%`,
                  background: r.quality >= 90 ? "var(--color-ink)" : r.quality >= 60 ? "var(--color-steel-400)" : "var(--color-signal)",
                }}
              />
            </div>
            <span className="font-mono text-[11px]">{r.quality} %</span>
          </div>
          <Tag tone={r.status === "Freigegeben" ? "success" : r.status === "In Prüfung" ? "warning" : "signal"}>
            {r.status}
          </Tag>
        </div>
      ))}
      <p className="px-4 py-3 font-mono text-[12px] text-steel-500">
        Ein Datensatz je Artikel. Dubletten werden beim Import aufgelöst.
      </p>
    </div>
  );
}

function KiAnreicherung() {
  return (
    <div className="dl-grid grid-cols-1 lg:grid-cols-2">
      <div className="px-5 py-5">
        <p className="dl-label text-steel-500">Eingang · Herstellerliste</p>
        <p className="mt-3 font-mono text-[12px] leading-[1.7] text-steel-600">
          ART1042;E-Bike City 28;500Wh;Mittelm.;schwarz;<br />
          VE1;EAN 4012345678901;;;;
        </p>
        <Tag tone="warning" className="mt-4">4 von 14 Attributen belegt</Tag>
      </div>
      <div className="px-5 py-5">
        <p className="dl-label text-steel-500">Ausgang · Datalio Datensatz</p>
        <p className="mt-3 text-[14px] font-bold">E-Bike City 28 Zoll, 500 Wh Mittelmotor</p>
        <ul className="mt-2 space-y-1 font-mono text-[12px] text-steel-700">
          <li>Motor: 65 Nm · Akku: 500 Wh, entnehmbar</li>
          <li>Rahmenhöhen: 45, 50, 55 cm · Gewicht: 24 kg</li>
          <li>SEO Text: 152 Wörter · Übersetzt: DE, EN, NL</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Tag tone="success">14 von 14 Attributen belegt</Tag>
          <Tag tone="neutral">Freigabe ausstehend</Tag>
        </div>
      </div>
      <p className="border-t border-steel-300 px-5 py-3 font-mono text-[12px] text-steel-500 lg:col-span-2">
        Die KI schlägt vor, Ihr Team gibt frei. Kein Text verlässt das System ohne Prüfung.
      </p>
    </div>
  );
}

function Kanaele() {
  const channels = [
    { name: "JTL Wawi", state: "Synchron", time: "vor 4 min" },
    { name: "JTL Shop", state: "Synchron", time: "vor 6 min" },
    { name: "Amazon Feed", state: "Aktiv", time: "vor 12 min" },
    { name: "idealo Feed", state: "Aktiv", time: "vor 18 min" },
    { name: "eBay", state: "Aktiv", time: "vor 31 min" },
    { name: "Google Shopping", state: "Täglich 06:00", time: "planmäßig" },
  ];
  return (
    <div className="dl-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {channels.map((c) => (
        <div key={c.name} className="flex items-center gap-3 px-4 py-4">
          <Check size={16} strokeWidth={2.5} className="shrink-0 text-success" />
          <div>
            <p className="text-[14px] font-bold">{c.name}</p>
            <p className="font-mono text-[11px] text-steel-500">
              {c.state} · {c.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Platform() {
  const [active, setActive] = useState<TabId>("stammdaten");
  return (
    <section id="plattform" className="border-b-2 border-ink bg-ground">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <p className="dl-label text-signal-strong">Plattform</p>
          <h2 className="dl-display mt-4 max-w-[26ch] text-[34px] md:text-[50px]">
            Produktdaten, zentral gepflegt.
          </h2>
          <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.6] text-steel-600">
            Import, Anreicherung und Distribution in einer Oberfläche. Was Sie
            hier sehen, ist der Arbeitsstand eines Beispielkatalogs.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex overflow-x-auto border-b-2 border-ink">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`dl-label relative px-4 py-3 transition-colors duration-150 md:px-6 ${
                  active === t.id ? "text-ink" : "text-steel-500 hover:text-ink"
                }`}
              >
                {t.label}
                {active === t.id && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-signal"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {active === "stammdaten" && <Stammdaten />}
                {active === "ki" && <KiAnreicherung />}
                {active === "kanaele" && <Kanaele />}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
