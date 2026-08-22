-- post_tags テーブル: posts と tags の「多対多」を表す中間テーブル
-- 1つの投稿が複数のタグを持て、1つのタグが複数の投稿に付けられる関係をこのテーブルで表現する

CREATE TABLE post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id) -- 複合主キー: 同じ投稿に同じタグを二重登録できないようにする
);
