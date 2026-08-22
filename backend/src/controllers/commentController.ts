import { Request, Response } from "express";
import * as commentRepository from "../repositories/commentRepository";
import { findPostById } from "../repositories/postRepository";

export async function listComments(req: Request, res: Response) {
  const postId = Number(req.params.id);
  const comments = await commentRepository.listCommentsByPost(postId);
  res.json({ comments });
}

export async function createComment(req: Request, res: Response) {
  const postId = Number(req.params.id);
  const post = await findPostById(postId);
  if (!post) {
    return res.status(404).json({ error: "投稿が見つかりません" });
  }

  const { body } = req.body ?? {};
  if (!body) {
    return res.status(400).json({ error: "body は必須です" });
  }

  const commentId = await commentRepository.createComment({
    postId,
    userId: req.user!.id,
    body,
  });
  const comment = await commentRepository.findCommentById(commentId);
  res.status(201).json({ comment });
}

export async function deleteComment(req: Request, res: Response) {
  const id = Number(req.params.id);
  const comment = await commentRepository.findCommentById(id);
  if (!comment) {
    return res.status(404).json({ error: "コメントが見つかりません" });
  }
  // 権限チェック: コメント投稿者本人 か 管理者 でなければ拒否する
  if (comment.author.id !== req.user!.id && req.user!.role !== "admin") {
    return res.status(403).json({ error: "このコメントを削除する権限がありません" });
  }

  await commentRepository.deleteComment(id);
  res.status(204).send();
}
