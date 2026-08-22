// ヘッダー右端に置く、汎用的な花型アイコン。currentColorを使うので、
// 置かれた場所の文字色(テーマの --text)にそのまま合わせられる。
// 花びら6枚を中心の周りに60度ずつ回転させて並べ、中心に丸い花芯を重ねている。
export function UserIcon() {
  const petalAngles = [0, 60, 120, 180, 240, 300];

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {petalAngles.map((angle) => (
        <ellipse
          key={angle}
          cx="12"
          cy="7.4"
          rx="2.5"
          ry="4.4"
          fill="currentColor"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}
