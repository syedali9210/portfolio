"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";

const SWIPE_OFFSET = 60;
const SWIPE_VELOCITY = 400;

// Below md (768px, matching every other mobile/desktop split in this
// codebase) navigation is swipe-driven; on desktop the deck is not
// draggable at all — the arrows under the deck are the only way through it
// (scratching the card needs the mouse free).
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function ArrowButton({ dir, onClick }: { dir: -1 | 1; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === 1 ? "Next card" : "Previous card"}
      onClick={onClick}
      className="hidden size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-[0.5px] border-white/26 bg-gradient-to-b from-white/10 to-[#999999]/10 text-[#a6a6a6] backdrop-blur-[48px] transition-colors hover:text-white md:flex"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d={dir === 1 ? "M5 3l4 4-4 4" : "M9 3L5 7l4 4"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// A one-at-a-time card deck. On mobile, drag left/right past a threshold to
// move to the next/previous card (wrapping around); on desktop the arrows
// below the deck page through it instead. The next card peeks out from
// behind for a hint that there's more to see.
export default function SwipeableCards({ cards }: { cards: ReactNode[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const isMobile = useIsMobile();

  const go = (delta: number) => {
    setDirection(delta);
    setIndex((i) => (i + delta + cards.length) % cards.length);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) go(1);
    else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) go(-1);
  };

  if (cards.length <= 1) return <>{cards[0]}</>;

  const nextCard = cards[(index + 1) % cards.length];

  return (
    <div className="relative flex w-full max-w-[480px] flex-col items-center gap-6">
      <div className="relative aspect-[8/5] w-full">
        <div className="pointer-events-none absolute inset-0 translate-y-3 scale-[0.94] opacity-60">
          {nextCard}
        </div>

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            initial={{ x: direction >= 0 ? 60 : -60, opacity: 0, rotate: direction >= 0 ? 4 : -4 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: direction >= 0 ? -60 : 60, opacity: 0, rotate: direction >= 0 ? -4 : 4 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className={`absolute inset-0 ${isMobile ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            {cards[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <ArrowButton dir={-1} onClick={() => go(-1)} />
        <div className="flex items-center gap-1.5">
          {cards.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
        <ArrowButton dir={1} onClick={() => go(1)} />
      </div>
    </div>
  );
}
