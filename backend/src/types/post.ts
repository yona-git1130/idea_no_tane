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
  // 「🎉達成」ボタンで自分の投稿を達成済みにできる
  is_achieved: boolean;
  // 管理者が「みんなのリスト」から削除した投稿かどうか(本人のリスト一覧にだけ、その旨を表示する)
  deleted_by_admin: boolean;
};
