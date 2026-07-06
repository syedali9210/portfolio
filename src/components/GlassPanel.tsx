import { CSSProperties, ReactNode } from "react";

export default function GlassPanel({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl border-[0.5px] border-white/26 bg-gradient-to-b from-white/10 to-[#999999]/10 p-2.5 shadow-[0px_10px_5px_rgba(0,0,0,0.15)] backdrop-blur-[48px] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
