-- 投稿(目標)を「達成」としてマークできるようにするフラグ。
-- デフォルトは false(未達成)。既存の投稿にも自動でこの値が入る。
ALTER TABLE posts ADD COLUMN is_achieved BOOLEAN NOT NULL DEFAULT false;
