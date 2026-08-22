// Expressの Request 型はデフォルトで user プロパティを持たない。
// declare global で型を「拡張」し、req.user を型エラーなく使えるようにする。

export type AuthUser = {
  id: number;
  role: "user" | "admin";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
