-- TapZon: grunnskjema (plattform + Style-modulen)
-- Kjøres i Supabase: SQL Editor -> lim inn hele filen -> Run.

create extension if not exists pgcrypto;

-- ─── Tabeller ────────────────────────────────────────────────

-- Deg som eier plattformen (tilgang til /superadmin)
create table public.platform_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  logo_path text,
  accent_color text check (accent_color ~ '^#[0-9a-fA-F]{6}$'),
  created_at timestamptz not null default now()
);

create table public.business_members (
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);
create index business_members_user_idx on public.business_members (user_id);

-- Tilfeldig, kort kort-ID uten tegn som er lette å forveksle (0/O, 1/l/I)
create function public.random_card_id() returns text
language plpgsql volatile as $$
declare
  alphabet constant text := 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  bytes bytea := gen_random_bytes(8);
  result text := '';
begin
  for i in 0..7 loop
    result := result || substr(alphabet, (get_byte(bytes, i) % length(alphabet)) + 1, 1);
  end loop;
  return result;
end $$;

create table public.cards (
  id text primary key default public.random_card_id() check (id ~ '^[A-Za-z0-9]{6,16}$'),
  business_id uuid references public.businesses (id) on delete set null,
  module_type text not null default 'style' check (module_type in ('start', 'loyalty', 'style')),
  label text not null default '',          -- internt: "Brikken ved blazer-stativet"
  title text not null default '',          -- vises til kunden: "Ullblazer i kamel"
  is_active boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index cards_business_idx on public.cards (business_id);

create table public.style_looks (
  id uuid primary key default gen_random_uuid(),
  card_id text not null references public.cards (id) on delete cascade,
  image_path text,
  caption text not null default '',
  sort_order int not null default 0
);
create index style_looks_card_idx on public.style_looks (card_id, sort_order);

create table public.style_colors (
  id uuid primary key default gen_random_uuid(),
  look_id uuid not null references public.style_looks (id) on delete cascade,
  hex text not null check (hex ~ '^#[0-9a-fA-F]{6}$'),
  label text not null default '',
  sort_order int not null default 0
);
create index style_colors_look_idx on public.style_colors (look_id, sort_order);

-- ─── Hjelpefunksjoner for tilgang ────────────────────────────

create function public.is_platform_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.platform_admins where user_id = auth.uid());
$$;

create function public.is_member(bid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.business_members
    where business_id = bid and user_id = auth.uid()
  );
$$;

-- Samme som is_member, men tåler tekst som ikke er en gyldig uuid (brukes for filstier)
create function public.is_member_text(bid text) returns boolean
language sql stable security definer set search_path = public as $$
  select case
    when bid ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      then public.is_member(bid::uuid)
    else false
  end;
$$;

create function public.can_edit_card(cid text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.cards c
    join public.business_members m on m.business_id = c.business_id
    where c.id = cid and m.user_id = auth.uid()
  );
$$;

-- ─── Row Level Security ──────────────────────────────────────
-- Alt som skrives av /superadmin går via serveren med secret-nøkkelen,
-- som omgår RLS. Reglene under gjelder innloggede butikkeiere.

alter table public.platform_admins  enable row level security;
alter table public.businesses       enable row level security;
alter table public.business_members enable row level security;
alter table public.cards            enable row level security;
alter table public.style_looks      enable row level security;
alter table public.style_colors     enable row level security;

create policy "egen admin-rad" on public.platform_admins
  for select to authenticated using (user_id = auth.uid());

create policy "medlemmer ser butikken" on public.businesses
  for select to authenticated using (public.is_member(id));
create policy "eier endrer butikken" on public.businesses
  for update to authenticated
  using (exists (select 1 from public.business_members m
                 where m.business_id = businesses.id and m.user_id = auth.uid() and m.role = 'owner'))
  with check (true);

create policy "egne medlemskap" on public.business_members
  for select to authenticated using (user_id = auth.uid());

create policy "medlemmer ser brikker" on public.cards
  for select to authenticated using (public.is_member(business_id));
create policy "medlemmer endrer brikker" on public.cards
  for update to authenticated
  using (public.is_member(business_id)) with check (public.is_member(business_id));

create policy "medlemmer ser forslag" on public.style_looks
  for select to authenticated using (public.can_edit_card(card_id));
create policy "medlemmer ser farger" on public.style_colors
  for select to authenticated using (
    exists (select 1 from public.style_looks l where l.id = look_id and public.can_edit_card(l.card_id))
  );

-- Kolonnetilgang: butikkeiere kan bare endre innholdsfelt, aldri eierskap eller status.
revoke all on public.platform_admins, public.businesses, public.business_members,
              public.cards, public.style_looks, public.style_colors from anon, authenticated;
grant select on public.platform_admins, public.businesses, public.business_members,
               public.cards, public.style_looks, public.style_colors to authenticated;
grant update (name, logo_path, accent_color) on public.businesses to authenticated;
grant update (label, title, settings, updated_at) on public.cards to authenticated;

-- ─── Lagring av et Style-kort (atomisk: alt eller ingenting) ─

create function public.save_style_card(p_card_id text, p_title text, p_looks jsonb)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_business uuid;
  v_look jsonb;
  v_color jsonb;
  v_look_id uuid;
  v_path text;
  i int := 0;
  j int;
begin
  select business_id into v_business from public.cards where id = p_card_id;
  if v_business is null or not public.can_edit_card(p_card_id) then
    raise exception 'Ingen tilgang til denne brikken' using errcode = '42501';
  end if;
  if jsonb_typeof(p_looks) <> 'array' or jsonb_array_length(p_looks) < 1 or jsonb_array_length(p_looks) > 2 then
    raise exception 'Et plagg må ha ett eller to stylingforslag';
  end if;

  update public.cards set title = left(coalesce(p_title, ''), 120), updated_at = now()
  where id = p_card_id;

  delete from public.style_looks where card_id = p_card_id;

  for v_look in select * from jsonb_array_elements(p_looks) loop
    v_path := nullif(v_look->>'image_path', '');
    -- Bildet må ligge i butikkens egen mappe
    if v_path is not null and v_path not like v_business::text || '/%' then
      raise exception 'Ugyldig bildesti';
    end if;

    insert into public.style_looks (card_id, image_path, caption, sort_order)
    values (p_card_id, v_path, left(coalesce(v_look->>'caption', ''), 600), i)
    returning id into v_look_id;

    if jsonb_array_length(coalesce(v_look->'colors', '[]'::jsonb)) > 8 then
      raise exception 'Maks 8 farger per forslag';
    end if;
    j := 0;
    for v_color in select * from jsonb_array_elements(coalesce(v_look->'colors', '[]'::jsonb)) loop
      insert into public.style_colors (look_id, hex, label, sort_order)
      values (v_look_id, v_color->>'hex', left(coalesce(v_color->>'label', ''), 40), j);
      j := j + 1;
    end loop;
    i := i + 1;
  end loop;
end $$;

revoke all on function public.save_style_card(text, text, jsonb) from public, anon;
grant execute on function public.save_style_card(text, text, jsonb) to authenticated;

-- ─── Offentlig kortside: ett kort-ID inn, kun det kortets innhold ut ─
-- Anon-nøkkelen har ingen tilgang til tabellene. Dette er den eneste døren.

create function public.get_public_card(p_id text) returns jsonb
language sql stable security definer set search_path = public as $$
  select case
    when c.id is null then null
    when not c.is_active or c.business_id is null then jsonb_build_object('status', 'inactive')
    else jsonb_build_object(
      'status', 'active',
      'id', c.id,
      'module_type', c.module_type,
      'title', c.title,
      'business', jsonb_build_object('name', b.name, 'logo_path', b.logo_path, 'accent_color', b.accent_color),
      'looks', coalesce((
        select jsonb_agg(jsonb_build_object(
          'image_path', l.image_path,
          'caption', l.caption,
          'colors', coalesce((
            select jsonb_agg(jsonb_build_object('hex', sc.hex, 'label', sc.label) order by sc.sort_order)
            from public.style_colors sc where sc.look_id = l.id
          ), '[]'::jsonb)
        ) order by l.sort_order)
        from public.style_looks l where l.card_id = c.id
      ), '[]'::jsonb)
    )
  end
  from (select 1) dummy
  left join public.cards c on c.id = p_id
  left join public.businesses b on b.id = c.business_id;
$$;

revoke all on function public.get_public_card(text) from public;
grant execute on function public.get_public_card(text) to anon, authenticated;

-- Hjelpefunksjonene skal ikke kunne kalles av anonyme
revoke all on function public.is_platform_admin(), public.is_member(uuid),
                       public.is_member_text(text), public.can_edit_card(text) from public, anon;
grant execute on function public.is_platform_admin(), public.is_member(uuid),
                          public.is_member_text(text), public.can_edit_card(text) to authenticated;

-- ─── Bildelagring (Supabase Storage) ─────────────────────────
-- Offentlig lesing via direkte URL (kundesiden), men ingen kan liste filene.
-- Filer ligger som <business_id>/<kort-id>/<tilfeldig>.jpg

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('card-images', 'card-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "medlemmer leser egne bilder" on storage.objects
  for select to authenticated
  using (bucket_id = 'card-images' and public.is_member_text((storage.foldername(name))[1]));
create policy "medlemmer laster opp bilder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'card-images' and public.is_member_text((storage.foldername(name))[1]));
create policy "medlemmer endrer egne bilder" on storage.objects
  for update to authenticated
  using (bucket_id = 'card-images' and public.is_member_text((storage.foldername(name))[1]));
create policy "medlemmer sletter egne bilder" on storage.objects
  for delete to authenticated
  using (bucket_id = 'card-images' and public.is_member_text((storage.foldername(name))[1]));
