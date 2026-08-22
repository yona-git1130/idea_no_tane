import { apiFetch } from "./client";
import type { Post } from "../types/post";

export function listPostsRequest(tagId?: number) {
  const query = tagId !== undefined ? `?tagId=${tagId}` : "";
  return apiFetch<{ posts: Post[] }>(`/posts${query}`);
}

export function getPostRequest(id: number) {
  return apiFetch<{ post: Post }>(`/posts/${id}`);
}

export function createPostRequest(params: { title: string; body: string; tagIds: number[] }) {
  return apiFetch<{ post: Post }>("/posts", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function updatePostRequest(
  id: number,
  params: { title: string; body: string; tagIds: number[] }
) {
  return apiFetch<{ post: Post }>(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(params),
  });
}

export function deletePostRequest(id: number) {
  return apiFetch<void>(`/posts/${id}`, { method: "DELETE" });
}
