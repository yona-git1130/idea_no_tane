-- users テーブル: 会員(投稿者・コメント者)の情報を持つ
-- role で一般/管理者を区別し、status で凍結(停止)状態を管理する

-- ENUM型: 決まった値しか入らない列を作れる(role, status で乱れた値が入るのを防ぐ)
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended');

CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- 主キー: 自動採番される一意なID
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,                   -- UNIQUE: 同じメールで2重登録できないようにする
  password_hash TEXT NOT NULL,                  -- 生パスワードではなく bcrypt でハッシュ化した文字列を保存
  role user_role NOT NULL DEFAULT 'user',
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now() -- TIMESTAMPTZ: タイムゾーン付き日時
);
