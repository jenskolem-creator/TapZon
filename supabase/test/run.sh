#!/usr/bin/env bash
# Kjører migreringen og sikkerhetstestene mot en lokal, tom Postgres-database.
set -euo pipefail
cd "$(dirname "$0")/.."
DB=tapzon_test
sudo -u postgres dropdb --if-exists "$DB"
sudo -u postgres createdb "$DB"
psql_db() { sudo -u postgres psql -q -t -v ON_ERROR_STOP=1 -d "$DB" "$@"; }
psql_db -f test/supabase_stub.sql
psql_db -f migrations/0001_init.sql
psql_db -f test/security_test.sql
