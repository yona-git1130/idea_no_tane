import { Request, Response } from "express";
import * as postRepository from "../repositories/postRepository";
import { listTags } from "../repositories/tagRepository";

// リクエストで送られてきたタグID配列のうち、実在するタグだけを残す。
// 存在しないIDが1つでも混ざっていたらエラーにする(不正なデータがDBに入るのを防ぐ)。
async function validateTagIds(tagIds: unknown): Promise<number[]> {
  if (tagIds === undefined) return [];
  if (!Array.isArray(tagIds) || !tagIds.every((t) => typeof t === "number")) {
    throw Object.assign(new Error("tagIds は数値の配列で指定してください"), { status: 400 });
  }
  const validIds = new Set((await listTags()).map((t) => t.id));
  const invalid = tagIds.filter((id) => !validIds.has(id));
  if (invalid.length > 0) {
    throw Object.assign(new Error(`存在しないタグIDです: ${invalid.join(", ")}`), { status: 400 });
  }
  return tagIds;
}

export async function listPosts(req: Request, res: Response) {
  const tagId = req.query.tagId !== undefined ? Number(req.query.tagId) : undefined;
  const posts = await postRepository.listPosts({ tagId });
  res.json({ posts });
}

export async function getPost(req: Request, res: Response) {
  const post = await postRepository.findPostById(Number(req.params.id));
  if (!post) {
    return res.status(404).json({ error: "投稿が見つかりません" });
  }
  // reaction_counts は findPostById の時点で既に含まれている
  res.json({ post });
}

export async function createPost(req: Request, res: Response) {
  const { title, body, tagIds } = req.body ?? {};

  if (!title || !body) {
    return res.status(400).json({ error: "title, body は必須です" });
  }

  let validTagIds: number[];
  try {
    validTagIds = await validateTagIds(tagIds);
  } catch (err) {
    const status = (err as { status?: number }).status ?? 400;
    return res.status(status).json({ error: (err as Error).message });
  }

  const postId = await postRepository.createPost({
    userId: req.user!.id,
    title,
    body,
    tagIds: validTagIds,
  });
  const post = await postRepository.findPostById(postId);
  res.status(201).json({ post });
}

export async function updatePost(req: Request, res: Response) {
  const id = Number(req.params.id);
  const post = await postRepository.findPostById(id);
  if (!post) {
    return res.status(404).json({ error: "投稿が見つかりません" });
  }
  // 権限チェック: 投稿者本人 か 管理者 でなければ拒否する
  if (post.author.id !== req.user!.id && req.user!.role !== "admin") {
    return res.status(403).json({ error: "この投稿を編集する権限がありません" });
  }

  const { title, body, tagIds } = req.body ?? {};
  if (!title || !body) {
    return res.status(400).json({ error: "title, body は必須です" });
  }

  let validTagIds: number[];
  try {
    validTagIds = await validateTagIds(tagIds);
  } catch (err) {
    const status = (err as { status?: number }).status ?? 400;
    return res.status(status).json({ error: (err as Error).message });
  }

  await postRepository.updatePost(id, { title, body, tagIds: validTagIds });
  const updated = await postRepository.findPostById(id);
  res.json({ post: updated });
}

export async function deletePost(req: Request, res: Response) {
  const id = Number(req.params.id);
  const post = await postRepository.findPostById(id);
  if (!post) {
    return res.status(404).json({ error: "投稿が見つかりません" });
  }
  if (post.author.id !== req.user!.id && req.user!.role !== "admin") {
    return res.status(403).json({ error: "この投稿を削除する権限がありません" });
  }

  await postRepository.deletePost(id);
  res.status(204).send(); // 204 No Content: 削除成功だが返す本文はない
}
