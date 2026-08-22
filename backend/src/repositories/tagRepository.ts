import { pool } from "../db/pool";
import { TagRow } from "../types/post";

export async function listTags(): Promise<TagRow[]> {
  const result = await pool.query<TagRow>("SELECT * FROM tags ORDER BY id");
  return result.rows;
}
