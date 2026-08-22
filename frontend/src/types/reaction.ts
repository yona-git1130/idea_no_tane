// backend/src/types/reaction.ts と対応する
export const REACTION_TYPES = ["empathy", "like", "great", "funny", "thoughtful"] as const;
export type ReactionType = (typeof REACTION_TYPES)[number];
export type ReactionCounts = Record<ReactionType, number>;

export const REACTION_LABELS: Record<ReactionType, { emoji: string; label: string }> = {
  empathy: { emoji: "🤝", label: "共感" },
  like: { emoji: "👍", label: "いいね" },
  great: { emoji: "👏", label: "素晴らしい" },
  funny: { emoji: "😂", label: "面白い" },
  thoughtful: { emoji: "🤔", label: "考えさせられる" },
};

export const EMPTY_REACTION_COUNTS: ReactionCounts = {
  empathy: 0,
  like: 0,
  great: 0,
  funny: 0,
  thoughtful: 0,
};
