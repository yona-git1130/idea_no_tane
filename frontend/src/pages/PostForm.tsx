import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { createPostRequest, updatePostRequest, getPostRequest } from "../api/posts";
import { listTagsRequest } from "../api/tags";
import type { Tag } from "../types/tag";
import { ApiError } from "../api/client";
import { resyncAfterPaste } from "../utils/pasteSync";

// 作成画面(/posts/new)と編集画面(/posts/:id/edit)を1つのコンポーネントで兼用する。
// URLに :id があるかどうかで「編集モードかどうか」を判定する。
export function PostForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [tags, setTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [loading, setLoading] = useState(isEdit); // 編集時は既存データを読み込むまで待つ
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTagsRequest().then(({ tags }) => setTags(tags));
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    getPostRequest(Number(id))
      .then(({ post }) => {
        setTitle(post.title);
        setBody(post.body);
        setSelectedTagId(post.tags[0]?.id ?? null);
      })
      .catch(() => setError("投稿の取得に失敗しました"))
      .finally(() => setLoading(false));
  }, [isEdit, id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const params = { title, body, tagIds: selectedTagId !== null ? [selectedTagId] : [] };
      const { post } = isEdit
        ? await updatePostRequest(Number(id), params)
        : await createPostRequest(params);
      navigate(`/posts/${post.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "投稿の保存に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="page">
          <p className="muted-text">読み込み中...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="page">
        <h1 style={{ fontSize: 24, marginBottom: 20 }}>{isEdit ? "投稿を編集" : "アイデアのタネをまく"}</h1>
        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            タイトル
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onPaste={resyncAfterPaste(setTitle)}
              required
            />
          </label>
          <label className="field">
            本文
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onPaste={resyncAfterPaste(setBody)}
              required
              rows={6}
            />
          </label>
          <fieldset className="tag-fieldset">
            <legend>タグ</legend>
            <div className="filter-row" style={{ marginBottom: 0 }}>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedTagId(tag.id)}
                  className={`filter-btn${selectedTagId === tag.id ? " active" : ""}`}
                >
                  {tag.icon} {tag.name}
                </button>
              ))}
            </div>
          </fieldset>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary btn-fit" disabled={submitting}>
            {submitting ? "保存中..." : isEdit ? "更新" : "タネをまく"}
          </button>
        </form>
      </main>
    </>
  );
}
