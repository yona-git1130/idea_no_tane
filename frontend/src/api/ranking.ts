import { apiFetch } from "./client";
import type { RankingEntry } from "../types/ranking";

// tagId未指定(undefined)は「すべて」タブ用。タグで絞り込まず全投稿を対象にする
export function getRankingRequest(tagId?: number) {
  const query = tagId !== undefined ? `?tagId=${tagId}` : "";
  return apiFetch<{ ranking: RankingEntry[] }>(`/posts/ranking${query}`);
}
