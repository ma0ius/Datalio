import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "../fx/Reveal";
import { ButtonLink } from "../ui/Button";

const promises = [
  "Sie bringen einen Auszug aus Ihrem Katalog mit",
  "Anreicherung live an Ihren eigenen Artikeln",
  "Ehrliche Antworten zu Aufwand, Preis und Roadmap",
  "Keine Folien, kein Vertriebsskript",
];

export function DemoCta() {
  return (
    <section id="demo" className="border-b-2 border-ink bg-ink text-ground">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="dl-label text-signal">Demo</p>
          <h2 className="dl-display mt-4 max-w-[22ch] text-[34px] md:text-[50px]">
            Datalio in 30 Minuten live erleben.
          </h2>
          <p className="mt-5 font-mono text-[13px] text-steel-400">
            Kostenlos · Unverbindlich · Keine Kreditkarte
          </p>
          <ul className="mt-8 space-y-3">
            {promises.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px]">
                <Check size={18} strokeWidth={2.5} className="mt-0.5 shrink-0 text-signal" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="border-2 border-ground p-8">
            <p className="text-[16px] leading-[1.6]">
              Termin direkt vereinbaren oder eine Nachricht schreiben. Sie
              sprechen mit dem Gründer, nicht mit dem Vertrieb.
            </p>
            <ButtonLink href="mailto:kontakt@datalio.de" className="mt-6 w-full justify-center">
              Demo vereinbaren <ArrowRight size={14} strokeWidth={2.5} />
            </ButtonLink>
            <p className="mt-4 text-center font-mono text-[12px] text-steel-500">
              oder direkt an kontakt@datalio.de
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
