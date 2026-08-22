-- posts テーブル: 「こうだったらいいのに」の投稿本体

CREATE TABLE posts (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- REFERENCES = 外部キー。users.id を指す = この投稿の投稿者
  -- ON DELETE CASCADE = 投稿者(ユーザー)が削除されたら、その人の投稿も一緒に削除される
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 投稿一覧を新しい順に表示することが多いので、created_at にインデックス(検索を高速化する索引)を張っておく
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);
