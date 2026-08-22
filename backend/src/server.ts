// server.ts: 組み立てた app を実際に起動するエントリーポイント

import "dotenv/config"; // .env ファイルの中身を process.env に読み込む
import app from "./app";

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});
