-- Datalio Stufe 1: Artikeltabelle mit Zeilenschutz je Nutzer.
-- Ausführen in Supabase: SQL Editor -> New query -> einfügen -> Run.

create table if not exists public.artikel (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  sku text not null,
  name text,
  attribute jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, sku)
);

alter table public.artikel enable row level security;

create policy "Eigene Artikel lesen"
  on public.artikel for select
  using (auth.uid() = user_id);

create policy "Eigene Artikel anlegen"
  on public.artikel for insert
  with check (auth.uid() = user_id);

create policy "Eigene Artikel ändern"
  on public.artikel for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Eigene Artikel löschen"
  on public.artikel for delete
  using (auth.uid() = user_id);

create index if not exists artikel_user_idx on public.artikel (user_id, created_at desc);
