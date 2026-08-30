import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PasswordField } from "../components/PasswordField";
import { Star } from "../components/Star";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";
import { resyncAfterPaste } from "../utils/pasteSync";

// フォームの背後に置く円のサイズ。点線(ダッシュ)の長さはそれぞれ変えて、
// 均一に並んだ感じにならないようにしている。反時計回りの回転はCSS側(auth-ring-spin)で行う
const RING_SIZE = 260;
const RING_CENTER = RING_SIZE / 2;
const RING_DASH_ARRAY = "6 8 24 6 12 10 3 9 18 7 14 5 8 15";

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
    <div className="auth-hero">
      {/* 星は画面全体(.auth-hero)を基準に、左右に散らばるよう配置する。
          すべて「新規登録」の見出しより上(top 32%以内)に収まる高さにしている。
          角度は星ごとに10度ずつずらしている */}
      <Star
        size={20}
        color="var(--accent)"
        style={{ position: "absolute", left: "4%", top: "10%", transform: "rotate(0deg)", zIndex: -1, pointerEvents: "none" }}
      />
      <Star
        size={13}
        color="var(--accent-hover)"
        style={{ position: "absolute", left: "18%", top: "6%", transform: "rotate(10deg)", zIndex: -1, pointerEvents: "none" }}
      />
      <Star
        size={22}
        color="var(--accent)"
        style={{ position: "absolute", left: "28%", top: "18%", transform: "rotate(20deg)", zIndex: -1, pointerEvents: "none" }}
      />
      <Star
        size={16}
        color="var(--accent-ink)"
        style={{ position: "absolute", left: "14%", top: "28%", transform: "rotate(30deg)", zIndex: -1, pointerEvents: "none" }}
      />
      <Star
        size={15}
        color="var(--accent-hover)"
        style={{ position: "absolute", right: "5%", top: "20%", transform: "rotate(40deg)", zIndex: -1, pointerEvents: "none" }}
      />
      <Star
        size={18}
        color="var(--accent)"
        style={{ position: "absolute", right: "17%", top: "9%", transform: "rotate(50deg)", zIndex: -1, pointerEvents: "none" }}
      />
      <Star
        size={22}
        color="var(--accent-hover)"
        style={{ position: "absolute", right: "27%", top: "23%", transform: "rotate(60deg)", zIndex: -1, pointerEvents: "none" }}
      />
      <Star
        size={11}
        color="var(--accent)"
        style={{ position: "absolute", right: "13%", top: "30%", transform: "rotate(70deg)", zIndex: -1, pointerEvents: "none" }}
      />
      <main className="page" style={{ maxWidth: 420 }}>
        {/* ヘッダーは表示せず、ロゴと紹介文を中央に配置した専用のレイアウトにする */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="brand-text" style={{ fontSize: 40 }}>未来リスト</span>
          </Link>
          <p className="muted-text" style={{ marginTop: 16, lineHeight: 1.8 }}>
            未来リストは未来にある『やってみたい』
            <br />
            を集めるリストです。
            <br />
            挑戦したいこと、楽しみにしていること、
            <br />
            いつか叶えたいことを自由に書き出してみてください。
            <br />
            また、みんなの未来リストから
            <br />
            あなたの『やってみたい』が広がるかもしれません。
          </p>
        </div>
        <h1 style={{ fontSize: 24, marginBottom: 20, textAlign: "center", color: "var(--accent-ink)" }}>
          新規登録
        </h1>
        <form onSubmit={handleSubmit} className="form" style={{ alignItems: "center", textAlign: "center" }}>
          {/* 円の飾りはユーザー名・メールアドレス・パスワードの「背後」に置きたいので、
              position: relative なラッパーでこの3項目だけをまとめて重ねる */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <svg
              className="auth-ring"
              width={RING_SIZE}
              height={RING_SIZE}
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
              fill="none"
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 0,
              }}
            >
              {/* 星のリングではなく、ダッシュの長さがそれぞれ違う点線の円にする。
                  この円だけCSS(auth-ring-spin)で反時計回りに回転させている */}
              <circle
                cx={RING_CENTER}
                cy={RING_CENTER}
                r="112"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray={RING_DASH_ARRAY}
                opacity="0.6"
              />
              {/* 三日月(RING_CENTERが110基準で設計した位置なので、差分だけ平行移動して中央に合わせる) */}
              <path
                d="M92 44a24 24 0 1 0 0 48 a17.5 17.5 0 0 1 0 -48"
                fill="var(--accent-ink)"
                transform={`translate(${RING_CENTER - 110} ${RING_CENTER - 110})`}
              />
            </svg>
            <label className="field" style={{ position: "relative", zIndex: 1 }}>
              ユーザー名
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onPaste={resyncAfterPaste(setUsername)}
                required
              />
            </label>
            <label className="field" style={{ position: "relative", zIndex: 1 }}>
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
            <div style={{ position: "relative", zIndex: 1 }}>
              <PasswordField
                label="パスワード(8文字以上)"
                value={password}
                onChange={setPassword}
                minLength={8}
                required
                autoComplete="new-password"
              />
            </div>
          </div>
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
        <p className="muted-text" style={{ marginTop: 16, textAlign: "center" }}>
          アカウントをお持ちの方は <Link to="/login">こちら</Link>
        </p>
      </main>
    </div>
  );
}
