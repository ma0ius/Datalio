"use client";

import { motion } from "framer-motion";
import { Reveal } from "../fx/Reveal";
import { Tag } from "../ui/Tag";

const bubble = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const platforms = ["ChatGPT", "Gemini", "Perplexity", "Claude"];

export function LlmSeo() {
  return (
    <section id="ki" className="border-b-2 border-ink bg-ink text-ground">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="dl-label text-signal">KI Sichtbarkeit</p>
            <h2 className="dl-display mt-4 text-[34px] md:text-[50px]">
              Wenn KI Produkte empfiehlt, sollte Ihres dabei sein.
            </h2>
            <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.6] text-steel-400">
              Kaufentscheidungen beginnen zunehmend in ChatGPT, Gemini und
              Perplexity. Ob Ihr Produkt dort empfohlen wird, entscheidet die
              Struktur Ihrer Daten: vollständige Attribute, maschinenlesbare
              Spezifikationen, konsistente Bezeichnungen. Datalio erzeugt genau
              diese Struktur. Für jeden Artikel, in jedem Kanal.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {platforms.map((p) => (
                <span key={p} className="font-mono text-[14px] text-steel-500">
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Chatverlauf */}
        <div className="space-y-3">
          <motion.div
            {...bubble(0.1)}
            className="ml-auto max-w-[85%] border-2 border-steel-700 px-4 py-3"
          >
            <p className="dl-label mb-1 text-steel-500">Nutzerfrage</p>
            <p className="text-[14px] leading-[1.5]">
              Welches E-Bike unter 2.500 € ist für den täglichen Arbeitsweg
              geeignet?
            </p>
          </motion.div>
          <motion.div
            {...bubble(0.35)}
            className="max-w-[92%] bg-paper px-4 py-4 text-ink"
          >
            <p className="dl-label mb-2 text-steel-500">Antwort der KI</p>
            <p className="text-[14px] font-bold">
              Empfehlung: Atlas City E 500
            </p>
            <ul className="mt-2 space-y-1 font-mono text-[12px] text-steel-700">
              <li>Mittelmotor: 65 Nm · Akku: 500 Wh, entnehmbar</li>
              <li>Reichweite: bis 100 km · Gewicht: 24 kg</li>
              <li>Beleuchtung nach StVZO · 2 Jahre Garantie</li>
            </ul>
            <div className="mt-3 border-t border-steel-300 pt-2">
              <Tag tone="signal">Quelle: strukturierte Produktdaten</Tag>
            </div>
          </motion.div>
          <motion.p
            {...bubble(0.6)}
            className="font-mono text-[12px] text-steel-500"
          >
            Vollständige, strukturierte Daten werden zitiert. Unstrukturierte
            werden übergangen.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
