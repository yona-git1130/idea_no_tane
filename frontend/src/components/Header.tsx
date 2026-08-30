import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserMenu } from "./UserMenu";
import { Star } from "./Star";

// ログイン/新規登録画面と同じ星の配置(位置・大きさ・色)を流用する。
// position: fixed で画面基準にするので、Headerがどのページで使われても同じ見え方になる。
const HEADER_STARS: { size: number; color: string; top: string; left?: string; right?: string }[] = [
  { size: 20, color: "var(--accent)", left: "4%", top: "10%" },
  { size: 22, color: "var(--accent)", left: "28%", top: "18%" },
  { size: 16, color: "var(--accent-ink)", left: "14%", top: "28%" },
  { size: 15, color: "var(--accent-hover)", right: "5%", top: "20%" },
  { size: 18, color: "var(--accent)", right: "17%", top: "9%" },
  { size: 22, color: "var(--accent-hover)", right: "27%", top: "23%" },
  { size: 11, color: "var(--accent)", right: "13%", top: "30%" },
];

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <>
      {/* ヘッダー・背景と合わせて、ログイン画面と同じ星の飾りを全ページに表示する。
          クリック操作の邪魔にならないよう pointerEvents: none、カード等の要素より
          背面に来るよう z-index を負の値にしている。角度は星ごとに10度ずつずらす */}
      {HEADER_STARS.map((star, i) => (
        <Star
          key={i}
          size={star.size}
          color={star.color}
          style={{
            position: "fixed",
            top: star.top,
            left: star.left,
            right: star.right,
            pointerEvents: "none",
            zIndex: -1,
            transform: `rotate(${i * 10}deg)`,
          }}
        />
      ))}
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-text">未来リスト</span>
        </Link>
        <nav>
          {user ? (
            <>
              <Link to="/posts/new">リストに追加</Link>
              <Link to="/">私のリスト</Link>
              <Link to="/ranking">みんなのリスト</Link>
              <UserMenu user={user} onLogout={logout} />
            </>
          ) : (
            <>
              {!isLoginPage && !isRegisterPage && <Link to="/ranking">みんなのリスト</Link>}
              {!isLoginPage && (
                // 新規登録画面では、登録ボタンと同じ紫(btn-primary)で目立たせる
                <Link to="/login" className={isRegisterPage ? "btn btn-primary" : "btn"}>
                  ログイン
                </Link>
              )}
              {/* 新規登録画面では、自分自身へのリンクになるので表示しない */}
              {!isRegisterPage && (
                <Link to="/register" className="btn btn-primary">
                  新規登録
                </Link>
              )}
            </>
          )}
        </nav>
      </header>
    </>
  );
}
