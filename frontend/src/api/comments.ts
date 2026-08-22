import { apiFetch } from "./client";
import type { Comment } from "../types/comment";

export function listCommentsRequest(postId: number) {
  return apiFetch<{ comments: Comment[] }>(`/posts/${postId}/comments`);
}

export function createCommentRequest(postId: number, body: string) {
  return apiFetch<{ comment: Comment }>(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export function deleteCommentRequest(commentId: number) {
  return apiFetch<void>(`/comments/${commentId}`, { method: "DELETE" });
}
