"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import PeekingBuddy, { type Corner } from "@/components/PeekingBuddy";

export default function TiltCard({
  children,
  className = "",
  max = 6,
  peekCorner = "top-right",
  showPeekingBuddy = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  peekCorner?: Corner;
  showPeekingBuddy?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    const r = wrap.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    card.classList.add("is-tilting");
    card.style.setProperty("--tilt-ry", ((px - 0.5) * max).toFixed(2) + "deg");
    card.style.setProperty("--tilt-rx", ((0.5 - py) * max).toFixed(2) + "deg");

    if (!isHoveringRef.current) {
      isHoveringRef.current = true;
      setIsHovering(true);
    }
  };

  const onLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.classList.remove("is-tilting");
      card.style.setProperty("--tilt-rx", "0deg");
      card.style.setProperty("--tilt-ry", "0deg");
    }
    isHoveringRef.current = false;
    setIsHovering(false);
  };

  return (
    <div ref={wrapRef} className={`t-tilt relative cursor-pointer ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {showPeekingBuddy && <PeekingBuddy corner={peekCorner} active={isHovering} />}
      <div ref={cardRef} className="t-tilt-card">
        {children}
      </div>
    </div>
  );
}
