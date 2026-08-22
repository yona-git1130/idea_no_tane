import { Router } from "express";
import { listTags } from "../repositories/tagRepository";

export const tagRouter = Router();

tagRouter.get("/", async (_req, res) => {
  const tags = await listTags();
  res.json({ tags });
});
