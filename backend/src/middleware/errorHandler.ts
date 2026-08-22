import { Request, Response, NextFunction } from "express";

// Expressは「引数が4つ」の関数を特別扱いし、エラー処理用ミドルウェアとして認識する。
// ルートハンドラ内で throw されたエラーや、Express 5 が拾った Promise の reject はここに集まってくる。
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err); // 開発中はターミナルに詳細を出しておく

  // 想定外のエラーの詳細をそのままクライアントに返すと、内部構造の手がかりを与えてしまうため
  // クライアントには最低限のメッセージだけを返す
  res.status(500).json({ error: "サーバー内部でエラーが発生しました" });
}
