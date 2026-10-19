-- Tester tilgangsreglene. Kjør: bash supabase/test/run.sh
\set ON_ERROR_STOP on
\set QUIET on

insert into auth.users values
  ('11111111-1111-1111-1111-111111111111', 'a@butikk.no'),
  ('22222222-2222-2222-2222-222222222222', 'b@butikk.no');
insert into public.businesses (id, name) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Butikk A'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Butikk B');
insert into public.business_members (business_id, user_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222');
insert into public.cards (id, business_id, title) values
  ('cardAAAA', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Blazer'),
  ('cardBBBB', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Skjørt');
insert into public.cards (id, business_id, is_active) values ('cardOFFx', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', false);

create function pg_temp.check(ok boolean, msg text) returns void language plpgsql as $$
begin
  if ok then raise notice 'OK   %', msg; else raise exception 'FEIL %', msg; end if;
end $$;

select pg_temp.check(length(public.random_card_id()) = 8, 'random_card_id gir 8 tegn');

-- ── Anonym (kunden som tapper) ──
set role anon;
select pg_temp.check((public.get_public_card('cardAAAA')->>'title') = 'Blazer', 'anon ser innholdet på riktig kort');
select pg_temp.check(public.get_public_card('finnesIkke') is null, 'ukjent kort gir null');
select pg_temp.check((public.get_public_card('cardOFFx')->>'status') = 'inactive', 'deaktivert kort sier inactive');
do $$ begin
  perform * from public.cards;
  raise exception 'FEIL anon kunne lese cards';
exception when insufficient_privilege then raise notice 'OK   anon kan ikke liste brikker';
end $$;
reset role;

-- ── Butikkeier A ──
set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select pg_temp.check((select count(*) from public.cards) = 2, 'A ser bare sine egne 2 brikker');
select pg_temp.check((select count(*) from public.businesses) = 1, 'A ser bare sin egen butikk');

select public.save_style_card('cardAAAA', 'Ullblazer', '[
  {"image_path":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/cardAAAA/x.jpg","caption":"Til kontoret","colors":[{"hex":"#000000","label":"Sort"},{"hex":"#ffffff","label":"Hvit"}]},
  {"caption":"Til middag","colors":[]}
]'::jsonb);
select pg_temp.check(jsonb_array_length(public.get_public_card('cardAAAA')->'looks') = 2, 'A lagret to forslag');
select pg_temp.check((public.get_public_card('cardAAAA')#>>'{looks,0,colors,1,label}') = 'Hvit', 'farger lagres i riktig rekkefølge');

do $$ begin
  perform public.save_style_card('cardBBBB', 'Hack', '[{"caption":"x"}]'::jsonb);
  raise exception 'FEIL A kunne endre Bs kort';
exception when insufficient_privilege then raise notice 'OK   A kan ikke endre Butikk Bs brikke';
end $$;

do $$ begin
  perform public.save_style_card('cardAAAA', 'x', '[{"image_path":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/cardBBBB/y.jpg"}]'::jsonb);
  raise exception 'FEIL godtok bilde fra annen butikk';
exception when raise_exception then raise notice 'OK   bilde må ligge i butikkens egen mappe';
end $$;

do $$ begin
  perform public.save_style_card('cardAAAA', 'x', '[{},{},{}]'::jsonb);
  raise exception 'FEIL godtok tre forslag';
exception when raise_exception then raise notice 'OK   maks to forslag';
end $$;

do $$ begin
  update public.cards set is_active = false where id = 'cardAAAA';
  raise exception 'FEIL A kunne deaktivere kort';
exception when insufficient_privilege then raise notice 'OK   A kan ikke endre status eller eierskap';
end $$;

update public.cards set label = 'Ved kassen' where id = 'cardBBBB';

insert into storage.objects (bucket_id, name) values ('card-images', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/cardAAAA/ny.jpg');
select pg_temp.check(true, 'A kan laste opp i egen mappe');
do $$ begin
  insert into storage.objects (bucket_id, name) values ('card-images', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/x.jpg');
  raise exception 'FEIL A kunne laste opp i Bs mappe';
exception when insufficient_privilege then raise notice 'OK   A kan ikke laste opp i Bs mappe';
end $$;
do $$ begin
  insert into storage.objects (bucket_id, name) values ('card-images', 'tull/x.jpg');
  raise exception 'FEIL godtok ugyldig mappe';
exception when insufficient_privilege then raise notice 'OK   ugyldig mappenavn avvises';
end $$;
reset role;
select pg_temp.check((select label from public.cards where id = 'cardBBBB') = '', 'A sin update på Bs kort endret ingenting');

\echo 'Alle tester bestått'
