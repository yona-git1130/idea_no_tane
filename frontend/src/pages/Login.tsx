import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { PasswordField } from "../components/PasswordField";
import { useAuth } from "../context/AuthContext";
import { resyncAfterPaste } from "../utils/pasteSync";
import { ApiError } from "../api/client";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/"); // ログイン成功後はトップページへ
    } catch (err) {
      // ApiError ならバックエンドが返したメッセージをそのまま表示、それ以外は汎用メッセージ
      setError(err instanceof ApiError ? err.message : "ログインに失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="page" style={{ maxWidth: 360 }}>
        <h1 style={{ fontSize: 24, marginBottom: 20 }}>ログイン</h1>
        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onPaste={resyncAfterPaste(setEmail)}
              autoComplete="email"
              required
            />
          </label>
          <PasswordField
            label="パスワード"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
          />
          {error && <p className="error-text">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ alignSelf: "center" }}
          >
            {submitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <p className="muted-text" style={{ marginTop: 16 }}>
          <Link to="/register">新規登録はこちら</Link>
        </p>
      </main>
    </>
  );
}
