import type { CSSProperties } from "react";

// 中心(0,0)基準・半径10の、5角の星の形。
export const STAR_PATH =
  "M0,-10 L2.35,-3.24 L9.51,-3.09 L3.8,1.24 L5.88,8.09 L0,4 L-5.88,8.09 L-3.8,1.24 L-9.51,-3.09 L-2.35,-3.24 Z";

// ログイン・新規登録画面の背景に散らす、きらめきの飾り。
export function Star({ size, color, style }: { size: number; color: string; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-10 -10 20 20"
      fill="none"
      aria-hidden="true"
      style={style}
    >
      <path d={STAR_PATH} fill={color} />
    </svg>
  );
}
