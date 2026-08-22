#!/usr/bin/env bash
# Supabaseなど、新しいPostgreSQLに対してこのプロジェクトのテーブルを作成するためのスクリプト。
#
# 使い方:
#   DATABASE_URL="postgres://postgres:xxxx@xxxx.supabase.co:5432/postgres" ./database/run-migrations.sh
#
# migrations/ を番号順に流し込んだあと、seeds/ (固定タグ4種など) も投入する。
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL を環境変数で指定してください" >&2
  echo '例: DATABASE_URL="postgres://..." ./database/run-migrations.sh' >&2
  exit 1
fi

cd "$(dirname "$0")"

for f in migrations/*.sql; do
  echo "==> 適用中: $f"
  psql "$DATABASE_URL" -f "$f"
done

for f in seeds/*.sql; do
  echo "==> 投入中: $f"
  psql "$DATABASE_URL" -f "$f"
done

echo "==> 完了しました"
