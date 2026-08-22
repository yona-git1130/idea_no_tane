-- reactions テーブル: 投稿への反応(スタンプ)
-- 「1人のユーザーは1つの投稿につき1種類のリアクションのみ」という仕様を UNIQUE 制約で表現する

CREATE TYPE reaction_type AS ENUM ('empathy', 'like', 'great', 'funny', 'thoughtful');
-- empathy=共感 like=いいね great=素晴らしい funny=面白い thoughtful=考えさせられる

CREATE TABLE reactions (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reaction_type reaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
  -- 同じ投稿に同じユーザーの行は1つまで。別の種類を押したら
  -- この行を UPDATE することで「上書き」を表現する(バックエンド実装時に説明)
);

CREATE INDEX idx_reactions_post_id ON reactions (post_id);
