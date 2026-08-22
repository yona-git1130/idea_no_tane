-- tags テーブル: 投稿につけられるタグのマスタ(固定5種類)
-- マスタテーブル = 値の一覧をあらかじめ登録しておくテーブル。値は database/seeds/ で投入する

CREATE TABLE tags (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- 例: "暮らし"
  icon TEXT NOT NULL         -- 例: "🏠"
);
