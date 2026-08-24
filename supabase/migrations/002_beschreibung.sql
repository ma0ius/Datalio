-- Datalio Stufe 2: Beschreibungsfeld für KI Produkttexte.
-- Ausführen in Supabase: SQL Editor -> New query -> einfügen -> Run.

alter table public.artikel
  add column if not exists beschreibung text;
