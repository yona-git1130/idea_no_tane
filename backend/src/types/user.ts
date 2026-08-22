// DBの users テーブルの1行をそのまま表す型。password_hash も含む(社内処理でのみ使う)
export type UserRow = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  created_at: Date;
};

// APIのレスポンスとして外部に返してよい形。password_hash を含めないことで
// 「うっかりハッシュ値までレスポンスに含めてしまう」事故を型の時点で防ぐ
export type PublicUser = Omit<UserRow, "password_hash">;

export function toPublicUser(row: UserRow): PublicUser {
  const { password_hash, ...publicUser } = row;
  return publicUser;
}
