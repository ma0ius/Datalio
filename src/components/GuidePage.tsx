import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Nav } from "./sections/Nav";
import { Footer } from "./sections/Footer";
import { ButtonLink } from "./ui/Button";

/* Gemeinsame Hülle für Ratgeberseiten: Nav, Artikelspalte, Demo Hinweis, Footer. */
export function GuidePage({
  label,
  title,
  intro,
  children,
}: {
  label: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="border-b-2 border-ink bg-paper">
          <div className="mx-auto max-w-[860px] px-5 py-16 md:px-10 md:py-20">
            <p className="dl-label text-signal-strong">{label}</p>
            <h1 className="dl-display mt-4 text-[34px] md:text-[50px]">{title}</h1>
            <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.6] text-steel-700">
              {intro}
            </p>
          </div>
        </div>
        <article className="guide mx-auto max-w-[860px] px-5 py-12 md:px-10 md:py-16">
          {children}
        </article>
        <div className="border-t-2 border-ink bg-ink text-ground">
          <div className="mx-auto flex max-w-[860px] flex-col items-start gap-5 px-5 py-12 md:px-10">
            <p className="dl-display text-[24px] md:text-[30px]">
              Sehen Sie Datalio an Ihren eigenen Artikeln.
            </p>
            <ButtonLink href="/#demo">
              Demo vereinbaren <ArrowRight size={14} strokeWidth={2.5} />
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
