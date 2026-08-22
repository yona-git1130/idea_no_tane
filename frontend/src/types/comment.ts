export type Comment = {
  id: number;
  post_id: number;
  body: string;
  created_at: string;
  author: { id: number; username: string };
};
