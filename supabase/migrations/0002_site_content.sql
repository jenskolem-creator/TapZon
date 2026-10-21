-- TapZon: innholdet på den offentlige nettsiden (forside og tjenester).
-- Kjøres i Supabase: SQL Editor -> lim inn hele filen -> Run.
-- Én rad med alt innholdet som JSON. Alle kan lese den, bare /superadmin skriver (via secret-nøkkelen).

create table if not exists public.site_content (
  id text primary key default 'main' check (id = 'main'),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "alle kan lese nettsideinnhold" on public.site_content;
create policy "alle kan lese nettsideinnhold" on public.site_content
  for select to anon, authenticated using (true);

revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
