"use client";

import { motion, type Variants } from "motion/react";

const CLAY = "#da7756";
const CLAY_LIGHT = "#e8916f";
const CLAY_DARK = "#a85a3f";
const CLAY_SHADE = "#8f4830";
const OUTLINE = "#2a1810";

export type Corner = "top-left" | "top-right";

const POSITION_CLASSES: Record<Corner, string> = {
  "top-left": "-top-2 left-4",
  "top-right": "-top-2 right-4",
};

const bodyVariants: Variants = {
  rest: { y: 24, opacity: 0, transition: { duration: 0.2 } },
  hover: {
    y: [24, 8, 8, -12],
    opacity: [0, 1, 1, 1],
    transition: { duration: 1.1, times: [0, 0.25, 0.55, 1], ease: "easeOut" },
  },
};

const armVariants: Variants = {
  rest: { rotate: 0, transition: { duration: 0.2 } },
  hover: {
    rotate: [0, 0, -30, 8, -25, 0],
    transition: {
      duration: 1.6,
      times: [0, 0.5, 0.65, 0.78, 0.9, 1],
      repeat: Infinity,
      repeatDelay: 0.3,
      ease: "easeInOut",
    },
  },
};

export default function PeekingBuddy({
  corner = "top-right",
  active = false,
}: {
  corner?: Corner;
  active?: boolean;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute z-0 ${POSITION_CLASSES[corner]}`}
      initial="rest"
      animate={active ? "hover" : "rest"}
      variants={bodyVariants}
    >
      <svg viewBox="0 0 20 20" width={38} height={38} shapeRendering="crispEdges">
        {/* waving arm, shaded for a rounder look */}
        <motion.rect
          x={13}
          y={0}
          width={4}
          height={8}
          fill={CLAY}
          style={{ transformOrigin: "15px 8px" }}
          animate={active ? "hover" : "rest"}
          variants={armVariants}
        />
        <motion.rect
          x={13}
          y={0}
          width={1.4}
          height={8}
          fill={CLAY_LIGHT}
          style={{ transformOrigin: "15px 8px" }}
          animate={active ? "hover" : "rest"}
          variants={armVariants}
        />

        {/* outline for contrast against light or dark card backgrounds */}
        <rect x={2} y={1} width={16} height={13} fill={OUTLINE} />

        {/* head peeking up from behind the card, with top highlight and chin shade for texture */}
        <rect x={3} y={2} width={14} height={11} fill={CLAY} />
        <rect x={3} y={2} width={14} height={2} fill={CLAY_LIGHT} />
        <rect x={3} y={11} width={14} height={2} fill={CLAY_DARK} />
        <rect x={5} y={4} width={1} height={1} fill={CLAY_LIGHT} />
        <rect x={12} y={9} width={1} height={1} fill={CLAY_SHADE} />
        <rect x={9} y={4.5} width={1} height={1} fill={CLAY_SHADE} />

        {/* happy, smiling eyes */}
        <rect x={5.5} y={7.5} width={2} height={2} fill={OUTLINE} />
        <rect x={7.5} y={5.5} width={2} height={2} fill={OUTLINE} />
        <rect x={11} y={5.5} width={2} height={2} fill={OUTLINE} />
        <rect x={13} y={7.5} width={2} height={2} fill={OUTLINE} />
      </svg>
    </motion.div>
  );
}
