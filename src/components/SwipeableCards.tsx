"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";

const SWIPE_OFFSET = 60;
const SWIPE_VELOCITY = 400;

// A one-at-a-time swipeable deck. Drag left/right past a threshold to move
// to the next/previous card (wrapping around); the next card peeks out
// from behind for a hint that there's more to swipe through.
export default function SwipeableCards({ cards }: { cards: ReactNode[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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
    <div className="relative flex w-full max-w-[340px] flex-col items-center gap-4">
      <div className="relative h-[260px] w-full">
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
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {cards[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1.5">
        {cards.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
