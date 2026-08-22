// JWTをブラウザのlocalStorageに保存/取得/削除する。
// localStorageに入れておくと、ページを再読み込みしてもログイン状態が消えない。
const TOKEN_KEY = "ideaboard_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
