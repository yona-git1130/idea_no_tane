import { apiFetch } from "./client";
import type { Tag } from "../types/tag";

export function listTagsRequest() {
  return apiFetch<{ tags: Tag[] }>("/tags");
}
