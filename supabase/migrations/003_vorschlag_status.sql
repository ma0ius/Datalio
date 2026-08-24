-- Datalio: KI Vorschläge und Freigabestatus je Artikel.
-- Ausführen in Supabase: SQL Editor -> New query -> einfügen -> Run.

alter table public.artikel
  add column if not exists vorschlag jsonb,
  add column if not exists status text not null default 'neu';
