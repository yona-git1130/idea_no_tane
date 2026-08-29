import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { PasswordField } from "../components/PasswordField";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";
import { resyncAfterPaste } from "../utils/pasteSync";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "登録に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="page" style={{ maxWidth: 360 }}>
        <h1 style={{ fontSize: 24, marginBottom: 20 }}>新規登録</h1>
        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            ユーザー名
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onPaste={resyncAfterPaste(setUsername)}
              required
            />
          </label>
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
            label="パスワード(8文字以上)"
            value={password}
            onChange={setPassword}
            minLength={8}
            required
            autoComplete="new-password"
          />
          {error && <p className="error-text">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ alignSelf: "center" }}
          >
            {submitting ? "登録中..." : "登録"}
          </button>
        </form>
        <p className="muted-text" style={{ marginTop: 16 }}>
          アカウントがある場合は <Link to="/login">こちら</Link>
        </p>
      </main>
    </>
  );
}
