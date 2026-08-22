import type { Tag } from "./tag";
import type { ReactionCounts } from "./reaction";

// バックエンドの PostDetail 型(backend/src/types/post.ts)に対応する。
// 一覧表示にも詳細表示にも同じ形が返ってくるので、型は1つで共通に使う。
// reaction_counts は一覧・詳細どちらのレスポンスにも常に含まれる。
export type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  author: { id: number; username: string };
  tags: Tag[];
  reaction_counts: ReactionCounts;
};
