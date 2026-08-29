import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactionBar } from "./ReactionBar";
import { ConfirmModal } from "./ConfirmModal";
import { setPostAchievedRequest } from "../api/posts";
import type { Post } from "../types/post";

function excerpt(text: string, max = 80): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const isOwnPost = !!user && post.author.id === user.id;
  const [isAchieved, setIsAchieved] = useState(post.is_achieved);
  const [pending, setPending] = useState(false);
  // 達成ボタン押下時、確定前に「はい/いいえ」を選ばせるモーダルの表示状態
  const [showConfirm, setShowConfirm] = useState(false);

  // 一度達成にすると取り消せない仕様のため、まだ達成していないときだけ確認モーダルを開く
  function handleAchieveClick() {
    if (pending || isAchieved) return;
    setShowConfirm(true);
  }

  async function handleConfirmAchieve() {
    setShowConfirm(false);
    if (pending) return;
    setPending(true);
    try {
      await setPostAchievedRequest(post.id, true);
      setIsAchieved(true); // 成功したときだけ画面の表示も切り替える
    } finally {
      setPending(false);
    }
  }

  // 管理者に削除された投稿は、内容やボタンを出さず「削除されました」の通知だけにする
  if (post.deleted_by_admin) {
    return (
      <div className="card">
        <div className="card-body">
          <h2 className="card-title" style={{ textDecoration: "line-through", color: "var(--muted)" }}>
            {post.title}
          </h2>
          <p style={{ color: "var(--danger)", fontWeight: 700, margin: 0 }}>
            管理者により削除されました
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card${isAchieved ? " achieved" : ""}`}>
      {/* 達成マークは投稿者本人(または管理者)だけが操作できる。それ以外には無効化して見せる。
          また一度達成にしたら取り消せない仕様のため、達成済みになったボタンは押せなくする */}
      <button
        type="button"
        onClick={handleAchieveClick}
        disabled={pending || isAchieved || (!isOwnPost && user?.role !== "admin")}
        className={`achieve-btn${isAchieved ? " achieved" : ""}`}
        title={isAchieved ? "達成済み(取り消しはできません)" : "達成としてマークする"}
      >
        {isAchieved ? "🎉達成" : "達成済みにする"}
      </button>
      {showConfirm && (
        <ConfirmModal
          message="達成ボタンの取り消しはできません。達成済みにしますか？"
          onConfirm={handleConfirmAchieve}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="card-body">
        {/* リアクションボタン(button)をリンクの中に入れると、押した時にカード自体の
            リンク遷移も一緒に発火してしまうため、クリックできる領域はここで分離している。
            リスト一覧は自分の投稿だけなので、詳細画面を経由せず直接編集画面へ遷移させる */}
        <Link to={`/posts/${post.id}/edit`} className="card-link">
          <h2 className="card-title">{post.title}</h2>
          <p className="card-excerpt">{excerpt(post.body)}</p>
          <div className="tag-row">
            {post.tags.map((tag) => (
              <span key={tag.id} className="tag-pill">
                {tag.icon} {tag.name}
              </span>
            ))}
          </div>
          <p className="card-meta">
            {post.author.username} ・ {formatDate(post.created_at)}
          </p>
        </Link>
        <ReactionBar
          postId={post.id}
          initialCounts={post.reaction_counts}
          isOwnPost={isOwnPost}
          showCounts={false}
        />
      </div>
    </div>
  );
}
