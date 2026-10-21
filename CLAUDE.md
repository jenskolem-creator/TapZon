@AGENTS.md

# TapZon – status og beslutninger

Eier: Jens (ikke-teknisk, skriver norsk). Alt grensesnitt og all kommunikasjon er på norsk.
Les også README.md (oppsett av Supabase og Vercel).

## Hva TapZon er
Plattform for NFC-kort til lokale bedrifter. ÉN kodebase for alle kunder: ny kunde = nye rader i databasen, aldri ny kode.
- `/k/[id]` – offentlig kortside. Viser kun innholdet til det ene kortet, ingen navigasjon videre.
- `/admin` – bedriftseier logger inn og redigerer egne kort.
- `/superadmin` – Jens: opprett bedrifter, lag kort, gi tilgang, nytt midlertidig passord, rediger nettsiden.
- `/` og `/tjenester` – markedsføringsside. All tekst redigeres på `/superadmin/nettside` (tabellen `site_content`).

## Teknisk
- Next.js 16 (App Router, `proxy.ts` i stedet for middleware), Supabase (Postgres, Auth, Storage), Vercel.
- Live: https://tap-zon-o8h9.vercel.app (eget domene tapzon.no ikke koblet ennå). Push til `main` = deploy.
- Supabase-prosjekt: weydnyrxlwiwfissoooj. Migreringer i `supabase/migrations/` kjøres manuelt i SQL Editor.
- Sikkerhet: RLS + kolonnetilgang; offentlig side bruker kun `get_public_card()`. Tester: `bash supabase/test/run.sh`.

## Beslutninger
- Ingen e-post: Supabase sin innebygde e-post når bare teamet. Superadmin lager konto med midlertidig passord;
  bruker må lage eget passord ved første innlogging (`user_metadata.must_change_password`).
- Dag-sperre i Loyalty skal gjelde per bedrift (ikke per kort).
- Nettsiden: ren svart/hvit stil, ingen bilder, ingen Google-farger, ingen statistikk.
  TapZon presenteres som partner for teknologi og markedsføring. Knappen øverst: «Logg inn som bedrift».

## Ferdig
- Style-modulen (klesbutikk): stylingforslag med bilde, tekst og farger per plagg. Testet i produksjon.

## Neste (ikke startet)
- Loyalty / digitale klippekort (stempel godkjennes av ansatt, ett per dag per bedrift).
- Start-modulen / egen side bak kortet (meny, åpningstider, tilbud) – kan også bli bedriftsnettsider.
- Superadmin kan redigere en bedrifts kort. Bilder på markedssiden. «Glemt passord» via egen SMTP.
- Koble domenet tapzon.no i Vercel.
