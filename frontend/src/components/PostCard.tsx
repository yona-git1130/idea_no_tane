import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactionBar } from "./ReactionBar";
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

  return (
    <div className="card">
      {/* リアクションボタン(button)をリンクの中に入れると、押した時にカード自体の
          リンク遷移も一緒に発火してしまうため、クリックできる領域はここで分離している */}
      <Link to={`/posts/${post.id}`} className="card-link">
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
  );
}
