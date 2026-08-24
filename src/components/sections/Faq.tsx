"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "../fx/Reveal";

const faqs = [
  {
    q: "Was ist ein PIM?",
    a: "PIM steht für Product Information Management: ein System, das alle Produktdaten an einem Ort pflegt und von dort in Shop, Marktplatz und Katalog verteilt. Statt Excel Listen und Copy and Paste gibt es einen Datensatz je Artikel, der überall gleich ankommt.",
  },
  {
    q: "Wie kommen meine Daten in Datalio?",
    a: "Per CSV oder Excel Import, über Standardformate wie BMEcat und DATANORM oder über eine direkte Anbindung an Ihr ERP. Beim ersten Import ordnet Datalio Ihre Spalten automatisch den richtigen Feldern zu; Sie prüfen die Zuordnung einmal und behalten sie für alle weiteren Importe.",
  },
  {
    q: "Was macht die KI, und was bleibt bei meinem Team?",
    a: "Die KI schlägt vor: Produkttexte, fehlende Attribute, Übersetzungen, Kategoriezuordnungen. Ihr Team prüft und gibt frei. Kein Inhalt geht ohne Freigabe in einen Kanal. Sie bestimmen je Kanal, wie streng die Prüfung sein soll.",
  },
  {
    q: "Welche Systeme sind angebunden?",
    a: "Shopsysteme wie Shopware, Shopify, JTL, Magento und WooCommerce, Marktplätze wie Amazon, OTTO, Kaufland und eBay sowie Warenwirtschaften wie weclapp, xentral und Odoo. Daneben Datenfeeds per API, CSV und BMEcat für Handelspartner.",
  },
  {
    q: "Was kostet Datalio?",
    a: "Der Preis richtet sich nach Artikelzahl und Kanälen und wird im Demotermin offen besprochen. Der Einstieg ist kostenlos: Sie sehen die Anreicherung an Ihren eigenen Daten, bevor Sie sich entscheiden.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-steel-300">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-[17px] font-bold">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={20} strokeWidth={2.5} className={open ? "text-signal" : "text-ink"} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-[70ch] pb-5 text-[15px] leading-[1.6] text-steel-600">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="border-b-2 border-ink bg-ground">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <p className="dl-label text-signal-strong">FAQ</p>
          <h2 className="dl-display mt-4 text-[34px] md:text-[50px]">
            Häufige Fragen.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 border-t-2 border-ink">
            {faqs.map((f) => (
              <Item key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
