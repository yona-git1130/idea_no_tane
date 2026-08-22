import { apiFetch } from "./client";
import type { ReactionType } from "../types/reaction";

export function upsertReactionRequest(postId: number, type: ReactionType) {
  return apiFetch<{ message: string }>(`/posts/${postId}/reactions`, {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

export function deleteReactionRequest(postId: number) {
  return apiFetch<void>(`/posts/${postId}/reactions`, { method: "DELETE" });
}

export function getMyReactionRequest(postId: number) {
  return apiFetch<{ reactionType: ReactionType | null }>(`/posts/${postId}/reactions/me`);
}
