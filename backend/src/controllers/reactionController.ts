import { Request, Response } from "express";
import * as reactionRepository from "../repositories/reactionRepository";
import { findPostById } from "../repositories/postRepository";
import { REACTION_TYPES, ReactionType } from "../types/reaction";

export async function upsertReaction(req: Request, res: Response) {
  const postId = Number(req.params.id);
  const post = await findPostById(postId);
  if (!post) {
    return res.status(404).json({ error: "投稿が見つかりません" });
  }

  // 自分の投稿には自分でリアクションを付けられないようにする
  if (post.author.id === req.user!.id) {
    return res.status(403).json({ error: "自分の投稿にはリアクションできません" });
  }

  const { type } = req.body ?? {};
  if (!REACTION_TYPES.includes(type)) {
    return res
      .status(400)
      .json({ error: `type は次のいずれかである必要があります: ${REACTION_TYPES.join(", ")}` });
  }

  await reactionRepository.upsertReaction({
    postId,
    userId: req.user!.id,
    reactionType: type as ReactionType,
  });
  res.status(200).json({ message: "リアクションを保存しました" });
}

export async function deleteReaction(req: Request, res: Response) {
  const postId = Number(req.params.id);
  await reactionRepository.deleteReaction({ postId, userId: req.user!.id });
  res.status(204).send();
}

export async function getRanking(req: Request, res: Response) {
  // tagId省略時は「すべて」タブとして、タグを問わず全投稿を対象にする
  let tagId: number | undefined;
  if (req.query.tagId !== undefined) {
    tagId = Number(req.query.tagId);
    if (!Number.isInteger(tagId) || tagId <= 0) {
      return res.status(400).json({ error: "tagId は正の整数で指定してください" });
    }
  }

  const achievedOnly = req.query.achieved === "true";

  // 存在しないtagIdを渡された場合は、JOINの時点で該当なし(空配列)になるだけなので
  // ここで個別にタグの存在チェックはしていない
  const ranking = await reactionRepository.getRanking(tagId, undefined, achievedOnly);
  res.json({ ranking });
}

export async function getMyReaction(req: Request, res: Response) {
  const postId = Number(req.params.id);
  const reactionType = await reactionRepository.getUserReaction(postId, req.user!.id);
  res.json({ reactionType });
}
