-- comments テーブル: 投稿に対するコメント

CREATE TABLE comments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE, -- 投稿が消えたらコメントも消える
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- コメント投稿者
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post_id ON comments (post_id);
