# Datalio Website und App

Marketingseite und App Grundgerüst für Datalio (PIM für den Mittelstand), Design nach dem Datalio Design Theme (siehe `../Datalio Design Theme`).

## Stack

- Next.js 15 (App Router, statisch generiert) + React 19 + TypeScript
- Tailwind CSS 4 (Tokens aus dem Designsystem in `src/index.css`)
- Framer Motion für Animationen, Lucide für Icons
- Supabase für Login und später Datenhaltung der App

## Befehle

```
npm install     Abhängigkeiten installieren
npm run dev     Dev Server (http://localhost:3000)
npm run build   Produktivbuild
```

## Supabase einrichten

1. `.env.local.example` nach `.env.local` kopieren
2. Beide Werte aus Supabase eintragen (Projekt → Connect → Next.js App Router)
3. Dieselben zwei Variablen im Vercel Projekt unter Settings → Environment Variables anlegen

Ohne diese Werte läuft die Website normal; nur `/login` und `/app` zeigen einen Hinweis.

## Struktur

- `src/app/` — Seiten: Startseite, `ratgeber/*` (SEO Ratgeber), `impressum`, `datenschutz`, `login`, `app` (geschützter Bereich, Vorabversion)
- `src/components/sections/` — Sektionen der Startseite
- `src/components/ui/`, `src/components/fx/` — Basisbausteine und Animationen
- `src/lib/supabase.ts` — Supabase Browser Client (mit Guard, falls Env fehlt)

## Offene Platzhalter

- Impressum und Datenschutz: Angaben in eckigen Klammern vor Livegang füllen
- `kontakt@datalio.de`: Postfach bei IONOS anlegen oder Weiterleitung einrichten
- Demo Button: auf Microsoft Bookings Link umstellen, sobald die Buchungsseite existiert
- Kennzahlen auf der Startseite sind Beispielwerte
