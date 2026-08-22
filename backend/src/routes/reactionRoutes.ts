import { Router } from "express";
import { upsertReaction, deleteReaction, getMyReaction } from "../controllers/reactionController";
import { requireAuth, requireActive } from "../middleware/authMiddleware";

// postRouter 側で "/api/posts/:id/reactions" にマウントする用
export const postReactionsRouter = Router({ mergeParams: true });
postReactionsRouter.get("/me", requireAuth, getMyReaction);
postReactionsRouter.post("/", requireAuth, requireActive, upsertReaction);
postReactionsRouter.delete("/", requireAuth, deleteReaction);
