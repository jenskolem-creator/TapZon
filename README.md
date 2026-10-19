# TapZon

Én plattform for NFC-kort til butikker. Kunden tapper et kort og havner på `/k/[kort-id]`, som bare viser innholdet til det kortet. Butikkeieren logger inn på `/admin` og endrer innholdet selv. Du (plattformeier) oppretter butikker og brikker på `/superadmin`.

**Ferdig nå:** Style-modulen for klesbutikker (bilde, stiltekst og farger per plagg).
**Kommer senere:** Start og Loyalty (stempelkort).

## Slik er det bygd

| Del | Hva |
|---|---|
| `src/app/k/[id]` | Offentlig kortside. Ingen innlogging. Henter innhold via databasefunksjonen `get_public_card`. |
| `src/app/admin` | Innlogging, oversikt over brikker, redigering av plagg, logo og farge. |
| `src/app/superadmin` | Kun for deg: opprett butikker, lag brikker, gi folk tilgang, deaktiver brikker. |
| `supabase/migrations/0001_init.sql` | Hele databasen: tabeller, sikkerhetsregler og bildelagring. |
| `supabase/test/` | Tester at butikker ikke kan se eller endre hverandres data. |

En ny butikk er bare nye rader i databasen. Ingen ny kode.

## Oppsett, steg for steg

### 1. Supabase (database og innlogging)

1. Lag en gratis konto på [supabase.com](https://supabase.com) og et nytt prosjekt. Velg region **Stockholm** eller **Frankfurt**.
2. Gå til **SQL Editor**, lim inn hele innholdet i `supabase/migrations/0001_init.sql` og trykk **Run**.
3. Gå til **Authentication → URL Configuration**:
   - **Site URL**: adressen siden skal ligge på, for eksempel `https://tapzon.no`. Mens du tester: Vercel-adressen, for eksempel `https://tapzon.vercel.app`.
   - **Redirect URLs**: legg til `https://DIN-ADRESSE/**`.
4. Gå til **Authentication → Emails → Templates** og endre to maler, slik at lenkene virker:
   - **Invite user**: bytt ut lenken med
     `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/admin/nytt-passord`
   - **Reset password**: bytt ut lenken med
     `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/admin/nytt-passord`

   Du kan gjerne skrive teksten i malene på norsk også.
5. Gå til **Authentication → Sign In / Providers** og slå **av** «Allow new users to sign up». Bare du skal kunne lage kontoer.
6. Lag din egen bruker: **Authentication → Users → Add user** med e-posten og passordet ditt.
7. Gjør deg selv til plattform-admin. I **SQL Editor**, kjør (med din e-post):
   ```sql
   insert into public.platform_admins (user_id)
   select id from auth.users where email = 'din@epost.no';
   ```
8. Hent nøklene under **Project Settings → API Keys**: prosjekt-URL, publishable key og secret key.

### 2. Vercel (legger siden ut på nett)

1. Logg inn på [vercel.com](https://vercel.com) med GitHub og velg **Add New → Project** → velg `tapzon`-repoet.
2. Under **Environment Variables**, legg inn de fire verdiene fra `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY` (hemmelig, kun her)
   - `NEXT_PUBLIC_SITE_URL` (samme adresse som Site URL i Supabase)
3. Trykk **Deploy**. Hver gang koden endres på GitHub, oppdateres siden automatisk.
4. Domene: **Settings → Domains** → legg til `tapzon.no` og følg instruksjonene.

### 3. Første butikk

1. Gå til `https://DIN-ADRESSE/superadmin` og logg inn.
2. Fyll inn butikkens navn, eierens e-post og antall brikker → **Opprett butikk**.
3. Eieren får en e-post, lager passord og kan begynne å fylle inn plaggene.
4. Kopier adressene fra butikksiden og skriv dem på NFC-kortene med appen **NFC Tools** (Write → Add a record → URL).

## Kjøre lokalt (for utvikling)

```bash
cp .env.example .env.local   # fyll inn verdiene
npm install
npm run dev                  # http://localhost:3000
```

Teste sikkerhetsreglene mot en lokal Postgres:

```bash
bash supabase/test/run.sh
```
