"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { ButtonLink } from "../ui/Button";

const items = [
  { label: "Produkt", href: "/#produkt" },
  { label: "Lösungen", href: "/#loesungen" },
  { label: "KI Sichtbarkeit", href: "/#ki" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "Ratgeber", href: "/ratgeber/was-ist-ein-pim" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-ink bg-ground">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:px-10">
        <a href="/" aria-label="datalio – Startseite">
          <Logo size={24} />
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {items.map((i) => (
            <a
              key={i.href}
              href={i.href}
              className="dl-label text-steel-700 transition-colors duration-150 hover:text-ink"
            >
              {i.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/#demo">Demo vereinbaren</ButtonLink>
        </div>
        <button
          className="lg:hidden"
          aria-label="Menü öffnen"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="border-t-2 border-ink bg-ground px-5 py-4 lg:hidden">
          {items.map((i) => (
            <a
              key={i.href}
              href={i.href}
              onClick={() => setOpen(false)}
              className="dl-label block py-3 text-steel-700"
            >
              {i.label}
            </a>
          ))}
          <ButtonLink href="/#demo" className="mt-3" onClick={() => setOpen(false)}>
            Demo vereinbaren
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
