import type { ReactionCounts } from "./reaction";

// タグ別ランキング1件分。種類ごとのリアクション件数(counts)を持つ
export type RankingEntry = {
  post_id: number;
  title: string;
  body: string;
  counts: ReactionCounts;
};
