import type { ClipboardEvent } from "react";

// IME(日本語入力)がオンの状態で貼り付けを行うと、ブラウザが実際に挿入した文字列と
// Reactのstate(onChangeで更新される値)がズレることがある。
// これは、貼り付けがIMEの変換処理に巻き込まれ、Reactのonchangeが正しいタイミングで
// 発火しない/古い値のまま止まってしまうために起きる。
//
// 対策として、paste イベントの直後(DOMへの反映が終わった次のフレーム)に、
// 実際の入力欄の値を読み直してstateを強制的に同期させる。
// IMEが関係ない通常の貼り付けでは無害な二重更新になるだけなので、常に付けてよい。
export function resyncAfterPaste(
  onChange: (value: string) => void
): (e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void {
  return (e) => {
    const target = e.currentTarget;
    requestAnimationFrame(() => onChange(target.value));
  };
}
