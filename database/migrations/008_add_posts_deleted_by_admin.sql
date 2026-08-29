-- 管理者が「みんなのリスト」から投稿を削除したときのためのフラグ。
-- 本人が自分で削除する場合は今まで通り完全に削除するが、
-- 管理者が削除した場合はレコードを残し、投稿者本人の「リスト一覧」で
-- 「管理者により削除されました」と分かるようにするため、完全には消さない。
ALTER TABLE posts ADD COLUMN deleted_by_admin BOOLEAN NOT NULL DEFAULT false;
