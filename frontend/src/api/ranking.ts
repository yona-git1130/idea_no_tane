import { apiFetch } from "./client";
import type { RankingEntry } from "../types/ranking";

// tagId未指定(undefined)は「すべて」タブ用。タグで絞り込まず全投稿を対象にする
export function getRankingRequest(params: { tagId?: number; achievedOnly?: boolean } = {}) {
  const search = new URLSearchParams();
  if (params.tagId !== undefined) search.set("tagId", String(params.tagId));
  if (params.achievedOnly) search.set("achieved", "true");
  const query = search.toString();
  return apiFetch<{ ranking: RankingEntry[] }>(`/posts/ranking${query ? `?${query}` : ""}`);
}
