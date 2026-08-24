# Datalio Website

Marketingseite für Datalio (PIM für den Mittelstand), aufgebaut nach dem Vorbild von productbay.ai im Datalio Design Theme (siehe `../Datalio Design Theme`).

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 4 (Tokens aus dem Datalio Design Theme in `src/index.css`)
- Framer Motion für alle Animationen
- Lucide für Icons (Vorgabe des Designsystems)

Die Animationsmuster von Magic UI, React Bits und Aceternity (Marquee, Number Ticker, Grid Pattern, animierter Datenfluss) sind als eigene Komponenten unter `src/components/fx` nachgebaut, damit sie die Theme Regeln einhalten: Radius 0, flache Flächen, keine Verläufe, ein Rotakzent pro Fläche.

## Befehle

```
npm install          Abhängigkeiten installieren
npm run dev          Dev Server (Standardport 5173)
npm run build        Produktivbuild nach dist/
npx vite build --mode singlefile   Build als einzelne HTML Datei
node scripts/make-artifact.mjs     dist/index.html in ein Claude Artifact Fragment umwandeln
```

## Struktur

- `src/App.tsx` — Reihenfolge der Sektionen
- `src/components/sections/` — Nav, Hero, StatStrip, Integrations, Problem, LlmSeo, Solutions, Platform, Workflow, DemoCta, Faq, Closing, Footer
- `src/components/ui/` — Logo (Wortmarke mit Ring), Button, Tag
- `src/components/fx/` — Reveal, NumberTicker, Marquee, GridPattern

## Offene Platzhalter

- E-Mail Adresse `kontakt@datalio.de` (Domain noch nicht gesichert)
- Login Link und Footer Links ohne Ziel
- Kennzahlen im Hero und StatStrip sind Beispielwerte
