import type { ReactionCounts } from "./reaction";

export type TagRow = {
  id: number;
  name: string;
  icon: string;
};

// 投稿一覧・詳細のレスポンスとして返す形。
// author や tags のように、複数テーブルをJOINした結果をまとめた「表示用の型」。
export type PostDetail = {
  id: number;
  title: string;
  body: string;
  created_at: Date;
  updated_at: Date;
  author: {
    id: number;
    username: string;
  };
  tags: TagRow[];
  // 一覧・詳細どちらでもリアクションボタンを表示できるよう、常に含める
  reaction_counts: ReactionCounts;
};
