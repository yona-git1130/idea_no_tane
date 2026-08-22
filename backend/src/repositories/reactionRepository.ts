import { pool } from "../db/pool";
import { REACTION_TYPES, ReactionType, ReactionCounts, RankingEntry } from "../types/reaction";

export async function upsertReaction(params: {
  postId: number;
  userId: number;
  reactionType: ReactionType;
}): Promise<void> {
  // reactions テーブルには UNIQUE(post_id, user_id) 制約がある。
  // ON CONFLICT はその制約に違反した(=すでにこのユーザーがこの投稿にリアクション済み)場合の
  // 挙動を指定できる。ここでは「新しい種類で上書きする」を1回のSQLで実現している。
  // EXCLUDED は「今回INSERTしようとした値」を指す特別なキーワード。
  await pool.query(
    `INSERT INTO reactions (post_id, user_id, reaction_type)
     VALUES ($1, $2, $3)
     ON CONFLICT (post_id, user_id)
     DO UPDATE SET reaction_type = EXCLUDED.reaction_type, created_at = now()`,
    [params.postId, params.userId, params.reactionType]
  );
}

export async function deleteReaction(params: { postId: number; userId: number }): Promise<void> {
  await pool.query(`DELETE FROM reactions WHERE post_id = $1 AND user_id = $2`, [
    params.postId,
    params.userId,
  ]);
}

// tagId を指定すると、そのタグが付いている投稿だけに絞り込む。
// 省略(undefined)すると「すべて」タブ用に、タグを問わず全投稿を対象にする。
// リアクション総数(種類は問わない)の多い順トップN。
// LEFT JOINなので、リアクションが1件も付いていない投稿も(件数すべて0として)一覧には残る。
// みんなのタネ画面のカードと同じ「種類ごとの絵文字+件数」で表示できるよう、
// 種類別の内訳(counts)も1回のクエリでまとめて取得する。
export async function getRanking(tagId: number | undefined, limit = 10): Promise<RankingEntry[]> {
  const filterClauses = REACTION_TYPES.map(
    (type) => `'${type}', COUNT(*) FILTER (WHERE r.reaction_type = '${type}')`
  ).join(", ");

  // tagIdがある時だけpost_tagsで絞り込む。「すべて」の時は絞り込み条件なしで全投稿が対象になる
  const tagJoin = tagId !== undefined ? `JOIN post_tags pt ON pt.post_id = p.id AND pt.tag_id = $1` : "";
  const values = tagId !== undefined ? [tagId, limit] : [limit];
  const limitPlaceholder = tagId !== undefined ? "$2" : "$1";

  const result = await pool.query<{
    post_id: number;
    title: string;
    body: string;
    counts: ReactionCounts;
  }>(
    `SELECT
       p.id AS post_id, p.title, p.body,
       json_build_object(${filterClauses}) AS counts
     FROM posts p
     ${tagJoin}
     LEFT JOIN reactions r ON r.post_id = p.id
     GROUP BY p.id
     ORDER BY COUNT(r.id) DESC
     LIMIT ${limitPlaceholder}`,
    values
  );

  type ReactionRankingRow = {
    post_id: number;
    title: string;
    body: string;
    counts: ReactionCounts;
  };

  return result.rows.map((row: ReactionRankingRow) => ({
    post_id: row.post_id,
    title: row.title,
    body: row.body,
    counts: row.counts,
  }));
}

// ログイン中のユーザーが、この投稿に対してすでに押しているリアクションを取得する(なければnull)
export async function getUserReaction(postId: number, userId: number): Promise<ReactionType | null> {
  const result = await pool.query<{ reaction_type: ReactionType }>(
    `SELECT reaction_type FROM reactions WHERE post_id = $1 AND user_id = $2`,
    [postId, userId]
  );
  return result.rows[0]?.reaction_type ?? null;
}
