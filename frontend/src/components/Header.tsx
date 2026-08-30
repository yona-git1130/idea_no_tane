import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserMenu } from "./UserMenu";

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
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
  );
}
