import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { getRankingRequest } from "../api/ranking";
import { listTagsRequest } from "../api/tags";
import type { RankingEntry } from "../types/ranking";
import type { Tag } from "../types/tag";
import { REACTION_TYPES, REACTION_LABELS } from "../types/reaction";

function excerpt(text: string, max = 60): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function Ranking() {
  const [tags, setTags] = useState<Tag[]>([]);
  // undefined = 「すべて」(タグで絞り込まない)。みんなのタネ画面の絞り込みと同じ考え方
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(undefined);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // タグ一覧は最初に1回だけ取得すればよい
  useEffect(() => {
    listTagsRequest().then(({ tags }) => setTags(tags));
  }, []);

  // ランキングは、選んでいるタグ(selectedTagId)が変わるたびに取り直す
  useEffect(() => {
    setLoading(true);
    getRankingRequest(selectedTagId)
      .then(({ ranking }) => setRanking(ranking))
      .finally(() => setLoading(false));
  }, [selectedTagId]);

  const selectedTag = tags.find((tag) => tag.id === selectedTagId);

  return (
    <>
      <Header />
      <main className="page">
        <h1 style={{ fontSize: 24, marginBottom: 20 }}>注目のタネ</h1>

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
        {!loading && ranking.length === 0 && (
          <p className="empty-text">
            {selectedTag ? `${selectedTag.name}の投稿がまだありません。` : "投稿がまだありません。"}
          </p>
        )}

        <ol style={{ padding: 0, listStyle: "none", margin: 0 }}>
          {ranking.map((entry, index) => (
            <li key={entry.post_id} className="rank-item">
              <span className={`rank-number${index < 3 ? " top" : ""}`}>{index + 1}</span>
              <div style={{ flex: 1 }}>
                <Link to={`/posts/${entry.post_id}`} style={{ fontWeight: 700, textDecoration: "none", color: "inherit" }}>
                  {entry.title}
                </Link>
                <p className="rank-excerpt">{excerpt(entry.body)}</p>
                {/* みんなのタネ画面のカードと同じ見た目のバッジ。ここでは操作不要なのでbuttonではなくspan */}
                <div className="reaction-row" style={{ marginTop: 10 }}>
                  {REACTION_TYPES.map((type) => (
                    <span key={type} className="reaction-btn no-border">
                      <span>{REACTION_LABELS[type].emoji}</span>
                      <span>{entry.counts[type]}</span>
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
