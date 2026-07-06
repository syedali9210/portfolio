"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import DeskBuddy from "@/components/DeskBuddy";
import GlassPanel from "@/components/GlassPanel";
import GlassTile from "@/components/GlassTile";
import PeekingBuddy from "@/components/PeekingBuddy";
import PetBuddy from "@/components/PetBuddy";

type Side = "left" | "center" | "right";

const SPRING = { type: "spring" as const, stiffness: 200, damping: 22 };

// Pose of each card group depending on which one is tapped to the front.
// The fronted card un-skews and centers; the other two skew harder and
// slide off to the opposite side, stacked behind it.
function poseFor(side: Side, front: Side) {
  if (side === front) {
    return { x: 0, rotate: 0, skewX: 0, scale: 1, zIndex: 30 };
  }
  if (front === "center") {
    return side === "left"
      ? { x: -86, rotate: -3, skewX: -3, scale: 0.94, zIndex: 10 }
      : { x: 86, rotate: 3, skewX: 3, scale: 0.94, zIndex: 20 };
  }
  if (front === "right") {
    return side === "center"
      ? { x: -72, rotate: -6, skewX: -6, scale: 0.92, zIndex: 20 }
      : { x: -138, rotate: -10, skewX: -10, scale: 0.86, zIndex: 10 };
  }
  // front === "left"
  return side === "center"
    ? { x: 72, rotate: 6, skewX: 6, scale: 0.92, zIndex: 20 }
    : { x: 138, rotate: 10, skewX: 10, scale: 0.86, zIndex: 10 };
}

const LEFT_ROW_ICONS = [
  { src: "/images/image-16.png", imgClassName: "scale-150 object-contain" },
  { src: "/images/image-22.png", imgClassName: "object-cover" },
  { src: "/images/image-23.png", imgClassName: "object-cover" },
  { src: "/images/image-21.png", imgClassName: "scale-125 object-cover" },
];

const RIGHT_ROW_ICONS = [
  { src: "/images/image-17.png", imgClassName: "object-cover" },
  { src: "/images/image-24.png", imgClassName: "object-cover" },
  { src: "/images/ri-github-fill.svg", imgClassName: "object-contain p-1" },
  { src: "/images/image-28.png", imgClassName: "object-cover" },
];

// Natural rendered height of each side's card stack, so the buddy anchor
// (below) can be centered at the same height as the fronted card and its
// top edge lines up with the card's actual top — not a guessed constant.
const CARD_HEIGHT: Record<Side, number> = { left: 175, center: 0, right: 159 };

export default function HeroMobileStack() {
  const [front, setFront] = useState<Side>("center");

  const groups: { side: Side; node: React.ReactNode }[] = [
    {
      side: "left",
      node: (
        <div className="flex flex-col items-center gap-2">
          <GlassPanel className="flex flex-row gap-1.5 p-2">
            {LEFT_ROW_ICONS.map((icon) => (
              <GlassTile key={icon.src} src={icon.src} alt="" className="size-7" imgClassName={icon.imgClassName} />
            ))}
          </GlassPanel>
          <GlassPanel className="p-2">
            <GlassTile src="/images/rectangle-76.png" alt="" className="h-24 w-44" />
          </GlassPanel>
        </div>
      ),
    },
    {
      side: "center",
      node: (
        <GlassPanel className="flex flex-col gap-2 px-3 py-2.5">
          <div className="relative h-2.5 w-11.5 shrink-0">
            <Image src="/images/application-controls-active.svg" alt="" fill />
          </div>
          <div className="flex flex-row gap-2">
            <GlassTile src="/images/rectangle-80.png" alt="" className="h-32 w-[124px]" />
            <div className="flex flex-col gap-3">
              <GlassTile
                src="/images/image-16.png"
                alt=""
                className="h-[58px] w-[66px]"
                imgClassName="scale-150 object-contain"
              />
              <GlassTile empty className="h-[58px] w-[66px]">
                <PetBuddy />
              </GlassTile>
            </div>
          </div>
        </GlassPanel>
      ),
    },
    {
      side: "right",
      node: (
        <div className="flex flex-col items-center gap-2">
          <GlassPanel className="flex flex-col gap-1 p-2">
            <div className="flex flex-row gap-1">
              {RIGHT_ROW_ICONS.map((icon) => (
                <GlassTile key={icon.src} src={icon.src} alt="" className="size-6" imgClassName={icon.imgClassName} />
              ))}
            </div>
            <div className="flex flex-row gap-1">
              <GlassTile src="/images/image-27.png" alt="" className="size-6" />
              <GlassTile src="/images/ri-supabase-fill.svg" alt="" className="size-6" imgClassName="object-contain p-1" />
            </div>
          </GlassPanel>
          <GlassPanel className="flex flex-row items-center gap-1.5 p-2">
            <GlassTile src="/images/rectangle-78.png" alt="" className="h-13 w-20" />
            <div className="flex flex-col gap-1.5">
              <GlassTile src="/images/rectangle-79.png" alt="" className="h-6 w-9" />
              <GlassTile src="/images/rectangle-80.png" alt="" className="h-6 w-9" />
            </div>
          </GlassPanel>
        </div>
      ),
    },
  ];

  return (
    <div className="relative h-[240px] w-full">
      {/* Buddy reactions, mirroring the desktop pairing: the left card gets
          the peeking-and-waving buddy, the right card gets the laptop
          typing buddy — each active only while its side is fronted. The
          anchor box is centered the same way the cards are, but sized to
          match the fronted card's own height, so its top edge lines up
          with the card's top edge (each buddy's own built-in offset then
          places it just above, exactly like on desktop). */}
      <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
        <div className="relative w-[150px]" style={{ height: CARD_HEIGHT[front] }}>
          <PeekingBuddy corner="top-left" active={front === "left"} />
          <DeskBuddy active={front === "right"} />
        </div>
      </div>

      {groups.map(({ side, node }) => {
        const pose = poseFor(side, front);
        return (
          <div key={side} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.button
              type="button"
              onClick={() => setFront(side)}
              animate={pose}
              transition={SPRING}
              style={{ zIndex: pose.zIndex }}
              className="pointer-events-auto cursor-pointer"
              aria-label={`Bring ${side} card to front`}
            >
              {node}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}
