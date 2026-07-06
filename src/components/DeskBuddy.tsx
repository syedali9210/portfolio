"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const CLAY = "#da7756";
const CLAY_LIGHT = "#e8916f";
const CLAY_DARK = "#a85a3f";
const CLAY_SHADE = "#8f4830";
const OUTLINE = "#2a1810";
const LAPTOP_BODY = "#b8b8b8";
const LAPTOP_LIGHT = "#d8d8d8";
const LAPTOP_DARK = "#8a8a8a";
const LAPTOP_KEY = "#6a6a6a";
const SCREEN_BEZEL = "#2a2a2a";
const SCREEN_GLOW = "#0a1a2a";
const SCREEN_LINE = "#7ec8ff";

type Step = {
  name: string;
  duration: number;
  laptopOpacity: number;
  screenOpen: number;
  buddyOpacity: number;
  typing: boolean;
  lines: number;
};

const REST: Omit<Step, "name" | "duration"> = {
  laptopOpacity: 1,
  screenOpen: 1,
  buddyOpacity: 1,
  typing: false,
  lines: 0,
};

// Enter: the laptop is set down first, then the buddy fades in behind it
// (legs stay put, no climbing slide), then the screen opens and typing begins.
const ENTER: Step[] = [
  { name: "laptop-drop", duration: 320, ...REST, screenOpen: 0, buddyOpacity: 0, typing: false },
  { name: "buddy-appear", duration: 400, ...REST, screenOpen: 0, typing: false },
  { name: "laptop-open", duration: 420, ...REST, typing: false },
];

const TYPE_LOOP: Step[] = [
  { name: "type-1", duration: 750, ...REST, typing: true, lines: 1 },
  { name: "type-2", duration: 750, ...REST, typing: true, lines: 2 },
  { name: "type-3", duration: 850, ...REST, typing: true, lines: 3 },
];

// Exit mirrors the enter sequence in reverse.
const EXIT: Step[] = [
  { name: "laptop-close", duration: 300, ...REST, screenOpen: 0, typing: false, lines: 0 },
  { name: "buddy-leave", duration: 350, ...REST, screenOpen: 0, buddyOpacity: 0, typing: false, lines: 0 },
  { name: "laptop-lift", duration: 260, ...REST, screenOpen: 0, laptopOpacity: 0, buddyOpacity: 0, typing: false, lines: 0 },
];

const IDLE: Step = { name: "idle", duration: 0, laptopOpacity: 0, screenOpen: 0, buddyOpacity: 0, typing: false, lines: 0 };

export default function DeskBuddy({ active = false }: { active?: boolean }) {
  const [step, setStep] = useState<Step>(IDLE);
  const modeRef = useRef<"idle" | "entering" | "looping" | "exiting">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const runEnter = (i: number) => {
      modeRef.current = "entering";
      setStep(ENTER[i]);
      timerRef.current = setTimeout(() => {
        if (i + 1 < ENTER.length) runEnter(i + 1);
        else runLoop(0);
      }, ENTER[i].duration);
    };

    const runLoop = (i: number) => {
      modeRef.current = "looping";
      const s = TYPE_LOOP[i % TYPE_LOOP.length];
      setStep(s);
      timerRef.current = setTimeout(() => runLoop(i + 1), s.duration);
    };

    const runExit = (i: number) => {
      modeRef.current = "exiting";
      setStep(EXIT[i]);
      timerRef.current = setTimeout(() => {
        if (i + 1 < EXIT.length) runExit(i + 1);
        else {
          modeRef.current = "idle";
          setStep(IDLE);
        }
      }, EXIT[i].duration);
    };

    if (timerRef.current) clearTimeout(timerRef.current);

    if (active) {
      runEnter(0);
    } else if (modeRef.current !== "idle") {
      runExit(0);
    } else {
      setStep(IDLE);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active]);

  const dur = step.duration ? step.duration / 1000 : 0.3;
  // Hinge sits at the far edge of the deck, away from the buddy, so the
  // screen folds down over the keys when closed and opens up facing back
  // toward the buddy when open (a real laptop hinges at the back, not
  // next to the typist's hands).
  const screenRotate = step.screenOpen ? 8 : -90;
  const appearing = step.name === "buddy-appear";

  return (
    <div className="pointer-events-none absolute -top-10 left-1/2 z-30 -translate-x-1/2">
      <svg viewBox="0 0 40 34" width={68} height={58} shapeRendering="crispEdges" style={{ overflow: "visible" }}>
        {/* laptop, side profile: flat keyboard deck with a screen hinged at the back */}
        <motion.g animate={{ opacity: step.laptopOpacity }} transition={{ duration: 0.25 }}>
          <rect x={9} y={23} width={19} height={2} fill={LAPTOP_BODY} />
          <rect x={9} y={23} width={19} height={0.6} fill={LAPTOP_LIGHT} />
          <rect x={9} y={25} width={19} height={1} fill={LAPTOP_DARK} />
          {[11, 13, 15, 17, 19, 21, 23].map((kx) => (
            <rect key={kx} x={kx} y={23.4} width={1} height={1} fill={LAPTOP_KEY} />
          ))}
          <rect x={26.5} y={22.5} width={2} height={1.5} fill={LAPTOP_DARK} />

          <motion.g
            animate={{ rotate: screenRotate }}
            transition={{ duration: dur, ease: "easeInOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          >
            <rect x={26.5} y={9} width={2} height={14} fill={SCREEN_BEZEL} />
            <rect x={26.5} y={9} width={2} height={1} fill={LAPTOP_LIGHT} opacity={0.7} />
            <rect x={26.9} y={10} width={1.2} height={12} fill={SCREEN_GLOW} />
            {step.lines >= 1 && <rect x={26.9} y={18.5} width={1.2} height={1.6} fill={SCREEN_LINE} />}
            {step.lines >= 2 && <rect x={26.9} y={14.8} width={1.2} height={1.6} fill={SCREEN_LINE} />}
            {step.lines >= 3 && <rect x={26.9} y={11} width={1.2} height={1.6} fill={SCREEN_LINE} />}
          </motion.g>
        </motion.g>

        {/* buddy, side profile, seated to the left of the laptop. Only the
            hands move (typing) — the body and legs stay put, just fading
            in/out with the laptop rather than sliding into place. */}
        <motion.g
          animate={{ opacity: step.buddyOpacity }}
          transition={
            appearing
              ? { duration: dur, ease: "easeOut" }
              : { duration: dur, ease: "easeIn" }
          }
        >
          {/* torso, leaning toward the keyboard — upper body only, no legs */}
          <rect x={8} y={17} width={11} height={2} fill={CLAY_LIGHT} />
          <rect x={8} y={19} width={11} height={5} fill={CLAY} />
          <rect x={8} y={24} width={11} height={2} fill={CLAY_DARK} />
          {/* texture flecks for a subtle woven look */}
          <rect x={11} y={20} width={1} height={1} fill={CLAY_SHADE} />
          <rect x={15} y={21} width={1} height={1} fill={CLAY_LIGHT} />
          <rect x={13} y={22} width={1} height={1} fill={CLAY_SHADE} />
          <rect x={9} y={21} width={1} height={1} fill={CLAY_LIGHT} />

          {/* far hand, alternating with the near hand for a two-handed typing look.
              Motion animates "y" as a translateY transform, which stacks on top
              of the SVG y attribute rather than replacing it — so these start
              at y=0 and the animate keyframes carry the real position. */}
          <motion.rect
            x={22}
            width={3}
            height={5}
            fill={CLAY_DARK}
            animate={step.typing ? { y: [20, 21.5, 20, 21.5, 20] } : { y: 20 }}
            transition={step.typing ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
          />
          {/* near hand reaching to the keyboard */}
          <motion.rect
            x={15}
            width={4}
            height={6}
            fill={CLAY}
            animate={step.typing ? { y: [19, 17.5, 19, 17.5, 19] } : { y: 19 }}
            transition={step.typing ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
          />

          {/* head, side profile facing right toward the screen */}
          <rect x={7} y={7} width={10} height={2} fill={CLAY_LIGHT} />
          <rect x={7} y={9} width={10} height={7} fill={CLAY} />
          <rect x={7} y={16} width={10} height={1} fill={CLAY_DARK} />
          {/* brow / snout ridge toward the screen */}
          <rect x={16} y={11} width={2} height={3} fill={CLAY} />
          <rect x={16} y={13} width={2} height={1} fill={CLAY_DARK} />
          {/* single profile eye */}
          <rect x={13} y={11} width={2} height={1.5} fill={OUTLINE} />
          {/* ear */}
          <rect x={7} y={10} width={1.4} height={2} fill={CLAY_DARK} />
          {/* head texture fleck */}
          <rect x={10} y={13.5} width={1} height={1} fill={CLAY_SHADE} />
        </motion.g>
      </svg>
    </div>
  );
}
