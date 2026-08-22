import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { PostCard } from "../components/PostCard";
import { listPostsRequest } from "../api/posts";
import { listTagsRequest } from "../api/tags";
import type { Post } from "../types/post";
import type { Tag } from "../types/tag";

export function PostList() {
  const [tags, setTags] = useState<Tag[]>([]);
  // undefined = 絞り込みなし(すべて表示)
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // タグ一覧は最初に1回だけ取得すればよい
  useEffect(() => {
    listTagsRequest().then(({ tags }) => setTags(tags));
  }, []);

  // 投稿一覧は、選んでいるタグ(selectedTagId)が変わるたびに取り直す
  useEffect(() => {
    setLoading(true);
    setError(null);
    listPostsRequest(selectedTagId)
      .then(({ posts }) => setPosts(posts))
      .catch(() => setError("投稿の取得に失敗しました"))
      .finally(() => setLoading(false));
  }, [selectedTagId]);

  return (
    <>
      <Header />
      <main className="page">
        <h1 style={{ fontSize: 24, marginBottom: 20 }}>みんなのタネ</h1>
        <div className="filter-row">
          <button
            onClick={() => setSelectedTagId(undefined)}
            className={`filter-btn${selectedTagId === undefined ? " active" : ""}`}
          >
            すべて
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTagId(tag.id)}
              className={`filter-btn${selectedTagId === tag.id ? " active" : ""}`}
            >
              {tag.icon} {tag.name}
            </button>
          ))}
        </div>

        {loading && <p className="muted-text">読み込み中...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && posts.length === 0 && <p className="empty-text">投稿がまだありません。</p>}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>
    </>
  );
}
