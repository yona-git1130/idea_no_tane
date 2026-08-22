import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../repositories/userRepository";

// requireAuth: このミドルウェアを通したルートは「ログイン必須」になる
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization; // "Bearer <token>" の形式で送られてくる想定
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    return res.status(401).json({ error: "認証が必要です" });
  }

  try {
    // jwt.verify の戻り値の型はライブラリ側の汎用的な型なので、一度 unknown を経由して
    // 自分たちが実際にトークンへ詰めた形にキャストする
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as {
      sub: number;
      role: "user" | "admin";
    };
    req.user = { id: payload.sub, role: payload.role }; // 以降のハンドラで req.user が使えるようになる
    next(); // 次の処理(実際のルートハンドラ)へ進む
  } catch {
    return res.status(401).json({ error: "トークンが無効です" });
  }
}

// requireAdmin: requireAuth の後に使う想定。role が admin でなければ弾く
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "管理者権限が必要です" });
  }
  next();
}

// requireActive: requireAuth の後に使う想定。停止(suspended)中のユーザーの書き込みを拒否する。
// status は JWT発行後に変わりうる(ログイン中に管理者が停止する場合がある)ため、
// トークンの中身を信用せず、毎回DBから最新の状態を取り直す。
export async function requireActive(req: Request, res: Response, next: NextFunction) {
  const user = await findUserById(req.user!.id);
  if (!user) {
    return res.status(401).json({ error: "ユーザーが見つかりません" });
  }
  if (user.status === "suspended") {
    return res.status(403).json({ error: "アカウントが停止されているため、この操作はできません" });
  }
  next();
}
