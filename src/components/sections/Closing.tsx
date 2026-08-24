import { ArrowRight } from "lucide-react";
import { Reveal } from "../fx/Reveal";
import { Logo } from "../ui/Logo";

/* Rote Vollfläche: dem Abschlussbanner vorbehalten. */
export function Closing() {
  return (
    <section className="border-b-2 border-ink bg-signal text-white">
      <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-8 px-5 py-20 md:px-10 md:py-24">
        <Reveal>
          <Logo size={28} onSignal />
          <h2 className="dl-display mt-6 max-w-[18ch] text-[40px] md:text-[64px]">
            Bereit für einen Datensatz, der überall verkauft?
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 border-2 border-white px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-150 hover:bg-white hover:text-signal"
          >
            Jetzt starten <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
