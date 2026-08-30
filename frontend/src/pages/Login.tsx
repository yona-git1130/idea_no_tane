import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PasswordField } from "../components/PasswordField";
import { Star } from "../components/Star";
import { useAuth } from "../context/AuthContext";
import { resyncAfterPaste } from "../utils/pasteSync";

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
    } catch {
      // バックエンドは「メールかパスワードのどちらが違うか」を教えない(セキュリティ上の理由)ので、
      // 画面側でも「未登録かもしれない」ことが伝わる案内文をまとめて表示する
      setError(
        "メールアドレスまたはパスワードが正しくありません。\nアカウントをお持ちでない方は、新規登録をお願いします。"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-hero">
      {/* 新規登録画面と同じ背景・星の飾り。ただし円(月)は表示しない。
          角度は星ごとに10度ずつずらしている */}
      <Star
        size={20}
        color="var(--accent)"
        style={{ position: "absolute", left: "4%", top: "10%", transform: "rotate(0deg)" }}
      />
      <Star
        size={13}
        color="var(--accent-hover)"
        style={{ position: "absolute", left: "18%", top: "6%", transform: "rotate(10deg)" }}
      />
      <Star
        size={22}
        color="var(--accent)"
        style={{ position: "absolute", left: "28%", top: "18%", transform: "rotate(20deg)" }}
      />
      <Star
        size={16}
        color="var(--accent-ink)"
        style={{ position: "absolute", left: "14%", top: "28%", transform: "rotate(30deg)" }}
      />
      <Star
        size={15}
        color="var(--accent-hover)"
        style={{ position: "absolute", right: "5%", top: "20%", transform: "rotate(40deg)" }}
      />
      <Star
        size={18}
        color="var(--accent)"
        style={{ position: "absolute", right: "17%", top: "9%", transform: "rotate(50deg)" }}
      />
      <Star
        size={22}
        color="var(--accent-hover)"
        style={{ position: "absolute", right: "27%", top: "23%", transform: "rotate(60deg)" }}
      />
      <Star
        size={11}
        color="var(--accent)"
        style={{ position: "absolute", right: "13%", top: "30%", transform: "rotate(70deg)" }}
      />
      <main className="page" style={{ maxWidth: 420 }}>
        {/* ヘッダーは表示せず、新規登録画面と同様にロゴを中央に配置した専用のレイアウトにする */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="brand-text" style={{ fontSize: 40 }}>未来リスト</span>
          </Link>
        </div>
        <h1 style={{ fontSize: 24, marginBottom: 20, textAlign: "center", color: "var(--accent-ink)" }}>
          ログイン
        </h1>
        <form onSubmit={handleSubmit} className="form" style={{ alignItems: "center", textAlign: "center" }}>
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
          {error && <p className="error-text" style={{ whiteSpace: "pre-line" }}>{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ alignSelf: "center" }}
          >
            {submitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <p className="muted-text" style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/register">新規登録はこちら</Link>
        </p>
      </main>
    </div>
  );
}
