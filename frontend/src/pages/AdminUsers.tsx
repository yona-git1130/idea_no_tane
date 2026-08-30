import { Fragment, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Header } from "../components/Header";
import { PasswordField } from "../components/PasswordField";
import { useAuth } from "../context/AuthContext";
import {
  listUsersRequest,
  adminDeleteUserRequest,
  adminSetUserStatusRequest,
  adminSetUserPasswordRequest,
} from "../api/admin";
import type { User } from "../types/user";
import { ApiError } from "../api/client";

export function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // パスワード変更フォームを開いている対象ユーザーのid(1人分だけ開く想定)
  const [passwordEditId, setPasswordEditId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function load() {
    listUsersRequest()
      .then(({ users }) => setUsers(users))
      .catch(() => setError("ユーザー一覧の取得に失敗しました"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openPasswordEdit(id: number) {
    setPasswordEditId(id);
    setNewPassword("");
    setPasswordError(null);
  }

  function closePasswordEdit() {
    setPasswordEditId(null);
    setNewPassword("");
    setPasswordError(null);
  }

  async function handleSetPassword(e: FormEvent, id: number) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError("パスワードは8文字以上にしてください");
      return;
    }
    setPasswordSubmitting(true);
    setPasswordError(null);
    try {
      await adminSetUserPasswordRequest(id, newPassword);
      closePasswordEdit();
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "パスワードの変更に失敗しました");
    } finally {
      setPasswordSubmitting(false);
    }
  }

  async function handleToggleStatus(target: User) {
    const nextStatus = target.status === "active" ? "suspended" : "active";
    const label = nextStatus === "suspended" ? "停止" : "停止解除";
    if (!window.confirm(`${target.username} さんを${label}しますか？`)) return;
    try {
      await adminSetUserStatusRequest(target.id, nextStatus);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "操作に失敗しました");
    }
  }

  async function handleDelete(target: User) {
    if (!window.confirm(`${target.username} さんを削除しますか？この操作は取り消せません。`)) return;
    try {
      await adminDeleteUserRequest(target.id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "削除に失敗しました");
    }
  }

  return (
    <>
      <Header />
      <main className="page wide">
        <h1 style={{ fontSize: 24, marginBottom: 20, color: "var(--accent-ink)" }}>ユーザー管理</h1>

        {loading && <p className="muted-text">読み込み中...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ユーザー名</th>
                  <th>メール</th>
                  <th>権限</th>
                  <th>状態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  // パスワード変更は「一般ユーザーのみ」対象(管理者同士のパスワードは変更できない)
                  const canChangePassword = !isSelf && u.role !== "admin";
                  return (
                    <Fragment key={u.id}>
                      <tr>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.role === "admin" ? "管理者" : "一般"}</td>
                        <td>
                          <span className={`status-pill${u.status === "suspended" ? " suspended" : ""}`}>
                            {u.status === "suspended" ? "停止中" : "有効"}
                          </span>
                        </td>
                        <td>
                          {isSelf ? (
                            <span className="muted-text" style={{ fontSize: 12 }}>
                              (自分)
                            </span>
                          ) : (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <button onClick={() => handleToggleStatus(u)} className="btn-text">
                                {u.status === "suspended" ? "停止解除" : "停止"}
                              </button>
                              {canChangePassword && (
                                <button
                                  onClick={() =>
                                    passwordEditId === u.id ? closePasswordEdit() : openPasswordEdit(u.id)
                                  }
                                  className="btn-text"
                                >
                                  パスワード変更
                                </button>
                              )}
                              <button onClick={() => handleDelete(u)} className="btn-text danger">
                                削除
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                      {passwordEditId === u.id && (
                        <tr>
                          <td colSpan={5} style={{ background: "var(--panel-hover)" }}>
                            <form
                              onSubmit={(e) => handleSetPassword(e, u.id)}
                              style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}
                            >
                              <div style={{ minWidth: 260 }}>
                                <PasswordField
                                  label={`${u.username} さんの新しいパスワード(8文字以上)`}
                                  value={newPassword}
                                  onChange={setNewPassword}
                                  minLength={8}
                                  autoComplete="new-password"
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={passwordSubmitting}
                              >
                                {passwordSubmitting ? "変更中..." : "変更する"}
                              </button>
                              <button type="button" className="btn-text" onClick={closePasswordEdit}>
                                キャンセル
                              </button>
                              {passwordError && <p className="error-text">{passwordError}</p>}
                            </form>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
