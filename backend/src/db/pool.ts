// PostgreSQLへの接続を管理する「プール」。
// リクエストのたびに新しく接続するのではなく、接続をあらかじめ複数用意して使い回すことで高速化する。

import { Pool } from "pg";

// Supabaseなど本番のPostgreSQLはSSL接続を必須にしていることが多い。
// ローカル開発(素のPostgreSQL)ではSSL不要なので、本番判定の時だけ有効にする。
// rejectUnauthorized: false にしているのは、Supabase側の証明書チェーンを
// Node標準のCA一覧だけでは検証できないことがあるため(通信自体はSSLで暗号化される)。
const useSSL = process.env.DATABASE_SSL === "true" || process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
});
