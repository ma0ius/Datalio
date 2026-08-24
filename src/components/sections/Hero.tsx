"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { Tag } from "../ui/Tag";
import { GridPattern } from "../fx/GridPattern";
import { NumberTicker } from "../fx/NumberTicker";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function QualityBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-[12px] text-steel-600">{label}</span>
      <div className="h-3 flex-1 bg-steel-200">
        <motion.div
          className="h-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="w-12 shrink-0 text-right font-mono text-[12px]">
        {value} %
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section id="produkt" className="relative overflow-hidden border-b-2 border-ink pt-16">
      <GridPattern />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.p {...fade(0)} className="dl-label text-signal-strong">
            PIM für den Mittelstand
          </motion.p>
          <motion.h1
            {...fade(0.08)}
            className="dl-display mt-5 text-[44px] md:text-[68px]"
          >
            Ein Datensatz.
            <br />
            Alle Kanäle.
          </motion.h1>
          <motion.p
            {...fade(0.16)}
            className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-steel-700"
          >
            Datalio führt Artikeldaten aus ERP, PLM und Lieferantenlisten
            zusammen, reichert sie mit KI an und publiziert sie in Shop,
            Marktplatz und Katalog. Aus Lieferantendaten werden verkaufsfertige
            Produktseiten. In Minuten, nicht in Wochen.
          </motion.p>
          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#demo">
              Demo vereinbaren <ArrowRight size={14} strokeWidth={2.5} />
            </ButtonLink>
            <ButtonLink href="#plattform" variant="outline">
              Plattform ansehen
            </ButtonLink>
          </motion.div>
          <motion.p
            {...fade(0.32)}
            className="mt-5 font-mono text-[12px] text-steel-500"
          >
            Kostenlos · Unverbindlich · 30 Minuten
          </motion.p>
        </div>

        {/* Produktansicht: Katalogübersicht */}
        <motion.div {...fade(0.2)}>
          <div className="dl-grid grid-cols-3">
            <div className="col-span-3 flex items-center justify-between px-4 py-3">
              <span className="font-mono text-[12px] text-steel-600">
                datalio · Katalogübersicht
              </span>
              <Tag tone="success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Live
              </Tag>
            </div>
            {[
              { label: "Artikel", value: 25847 },
              { label: "Vollständigkeit", value: 94.2, decimals: 1, suffix: " %" },
              { label: "Kanäle", value: 12 },
            ].map((s) => (
              <div key={s.label} className="px-4 py-4">
                <p className="dl-label text-steel-500">{s.label}</p>
                <p className="dl-display mt-2 text-[26px] md:text-[32px]">
                  <NumberTicker
                    value={s.value}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix ?? ""}
                  />
                </p>
              </div>
            ))}
            <div className="col-span-3 space-y-2.5 px-4 py-4">
              <p className="dl-label mb-3 text-steel-500">Datenqualität</p>
              <QualityBar label="Vollständig" value={78} color="var(--color-ink)" delay={0.5} />
              <QualityBar label="Verbesserbar" value={17} color="var(--color-steel-400)" delay={0.65} />
              <QualityBar label="Unvollständig" value={5} color="var(--color-signal)" delay={0.8} />
            </div>
            <div className="col-span-3 flex items-center justify-between px-4 py-3">
              <span className="text-[13px]">
                KI Anreicherung läuft ·{" "}
                <span className="font-mono text-steel-600">1.204 Artikel in Warteschlange</span>
              </span>
              <div className="relative h-2 w-24 overflow-hidden bg-steel-200">
                <motion.div
                  className="absolute h-full w-1/3 bg-signal"
                  animate={{ x: ["-100%", "300%"] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
            {[
              { name: "Shopware", state: "Synchron" },
              { name: "Amazon", state: "Feed aktiv" },
              { name: "Katalog PDF", state: "Erstellt" },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-2 px-4 py-3">
                <Check size={16} strokeWidth={2.5} className="text-success" />
                <span className="text-[13px] font-semibold">{c.name}</span>
                <span className="ml-auto hidden font-mono text-[11px] text-steel-500 md:inline">
                  {c.state}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
