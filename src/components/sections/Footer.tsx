import { Logo } from "../ui/Logo";

const columns = [
  {
    title: "Produkt",
    links: [
      { label: "Plattform", href: "/#plattform" },
      { label: "Lösungen", href: "/#loesungen" },
      { label: "KI Sichtbarkeit", href: "/#ki" },
      { label: "Ablauf", href: "/#ablauf" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Ratgeber",
    links: [
      { label: "Was ist ein PIM?", href: "/ratgeber/was-ist-ein-pim" },
      { label: "PIM Vergleich 2026", href: "/ratgeber/pim-vergleich-2026" },
      { label: "PIM für JTL", href: "/ratgeber/jtl-pim" },
      { label: "PIM für Shopware", href: "/ratgeber/shopware-pim" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { label: "Demo vereinbaren", href: "/#demo" },
      { label: "Kontakt", href: "mailto:kontakt@datalio.de" },
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-ground">
      <div className="mx-auto max-w-[1240px] px-5 py-16 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <Logo size={24} inverse />
            <p className="mt-4 max-w-[32ch] text-[13px] leading-[1.6] text-steel-500">
              Product Information Management für den Mittelstand. Ein Datensatz
              je Artikel, publiziert in jeden Kanal.
            </p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <p className="dl-label text-steel-500">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[13px] text-steel-400 transition-colors duration-150 hover:text-ground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-steel-800 pt-6 md:flex-row">
          <p className="font-mono text-[12px] text-steel-500">
            © 2026 Datalio · Alle Rechte vorbehalten
          </p>
        </div>
      </div>
    </footer>
  );
}
