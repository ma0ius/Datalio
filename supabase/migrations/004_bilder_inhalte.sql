-- Datalio: Bulletpoints und Q&As je Artikel, Bildverwaltung mit Speicher.
-- Ausführen in Supabase: SQL Editor -> New query -> einfügen -> Run.

alter table public.artikel
  add column if not exists inhalte jsonb,
  add column if not exists bilder jsonb;

-- Öffentlich lesbarer Speicher für Artikelbilder; schreiben darf jede
-- Nutzerin nur im eigenen Ordner (erster Pfadteil = eigene Nutzer ID).
insert into storage.buckets (id, name, public)
values ('artikelbilder', 'artikelbilder', true)
on conflict (id) do nothing;

create policy "Artikelbilder lesen"
  on storage.objects for select
  using (bucket_id = 'artikelbilder');

create policy "Eigene Artikelbilder hochladen"
  on storage.objects for insert
  with check (
    bucket_id = 'artikelbilder'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Eigene Artikelbilder löschen"
  on storage.objects for delete
  using (
    bucket_id = 'artikelbilder'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
