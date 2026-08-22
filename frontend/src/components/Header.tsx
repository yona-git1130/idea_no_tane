import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SproutIcon } from "./SproutIcon";
import { UserMenu } from "./UserMenu";

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <SproutIcon />
        <span>アイデアのタネ</span>
      </Link>
      <nav>
        {user ? (
          <>
            <Link to="/posts/new">タネをまく</Link>
            <Link to="/">みんなのタネ</Link>
            <Link to="/ranking">注目のタネ</Link>
            <UserMenu user={user} onLogout={logout} />
          </>
        ) : (
          <>
            {!isLoginPage && !isRegisterPage && (
              <>
                <Link to="/">みんなのタネ</Link>
                <Link to="/ranking">注目のタネ</Link>
              </>
            )}
            {!isLoginPage && (
              <Link to="/login" className="btn">
                ログイン
              </Link>
            )}
            <Link to="/register" className="btn btn-primary">
              新規登録
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
