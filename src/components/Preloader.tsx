"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const CLAY = "#da7756";
const CLAY_LIGHT = "#e8916f";
const CLAY_DARK = "#a85a3f";
const CLAY_SHADE = "#8f4830";
const OUTLINE = "#2a1810";

// walk: Boop strolls in from the left in side profile. turn: he reaches
// center and the "camera" cuts to a front-facing view. wave: he waves and
// the welcome lines appear. exit: the whole overlay fades out.
type Phase = "walk" | "turn" | "wave" | "exit" | "done";

const WALK_MS = 1900;
const TURN_MS = 350;
const WAVE_MS = 2800;
const EXIT_MS = 700;

// Shared clay texture: top highlight, bottom shade, and a few woven flecks —
// the same treatment the other buddies use.
function BodyTexture() {
  return (
    <>
      <rect x={11} y={18} width={10} height={1.5} fill={CLAY_LIGHT} />
      <rect x={11} y={25.5} width={10} height={1.5} fill={CLAY_DARK} />
      <rect x={13} y={21} width={1} height={1} fill={CLAY_SHADE} />
      <rect x={17} y={22.5} width={1} height={1} fill={CLAY_LIGHT} />
      <rect x={15} y={20} width={1} height={1} fill={CLAY_LIGHT} />
    </>
  );
}

function HeadTexture() {
  return (
    <>
      <rect x={10} y={8} width={12} height={1.5} fill={CLAY_LIGHT} />
      <rect x={10} y={16.5} width={12} height={1.5} fill={CLAY_DARK} />
      <rect x={12} y={10} width={1} height={1} fill={CLAY_LIGHT} />
      <rect x={19} y={15} width={1} height={1} fill={CLAY_SHADE} />
      <rect x={15} y={9.5} width={1} height={1} fill={CLAY_SHADE} />
    </>
  );
}

// Side profile, walking to the right — legs and arm swing like PetBuddy's.
function BuddySide() {
  return (
    <g>
      <motion.rect
        x={11}
        y={27}
        width={4}
        height={7}
        fill={CLAY_DARK}
        style={{ transformOrigin: "13px 27px" }}
        animate={{ rotate: [20, -20, 20], x: [-1, 1, -1] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.rect
        x={17}
        y={27}
        width={4}
        height={7}
        fill={CLAY_DARK}
        style={{ transformOrigin: "19px 27px" }}
        animate={{ rotate: [-20, 20, -20], x: [1, -1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <rect x={11} y={18} width={10} height={9} fill={CLAY} />
      <BodyTexture />

      <motion.rect
        x={13}
        y={17}
        width={4}
        height={10}
        fill={CLAY}
        style={{ transformOrigin: "15px 18px" }}
        animate={{ rotate: [-30, 30, -30] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <rect x={10} y={8} width={12} height={10} fill={CLAY} />
      <HeadTexture />
      {/* nose pointing the way he's walking */}
      <rect x={21} y={11} width={2} height={3} fill={CLAY_DARK} />
      <rect x={12} y={12} width={3} height={2} fill={OUTLINE} />
      <rect x={17} y={12} width={3} height={2} fill={OUTLINE} />
    </g>
  );
}

// Front-facing, one arm up waving, happy squinted eyes like PeekingBuddy's.
function BuddyFront({ waving }: { waving: boolean }) {
  return (
    <g>
      <rect x={12} y={27} width={4} height={7} fill={CLAY_DARK} />
      <rect x={17} y={27} width={4} height={7} fill={CLAY_DARK} />

      <rect x={11} y={18} width={10} height={9} fill={CLAY} />
      <BodyTexture />

      {/* resting arm */}
      <rect x={6} y={16} width={4} height={11} fill={CLAY} />
      <rect x={6} y={16} width={1.4} height={11} fill={CLAY_LIGHT} />

      {/* waving arm, hinged at the shoulder */}
      <motion.g
        style={{ transformOrigin: "24px 16px" }}
        animate={waving ? { rotate: [0, -32, 10, -28, 0] } : { rotate: 0 }}
        transition={
          waving
            ? { duration: 1.4, repeat: Infinity, repeatDelay: 0.25, ease: "easeInOut" }
            : { duration: 0.2 }
        }
      >
        <rect x={22} y={5} width={4} height={12} fill={CLAY} />
        <rect x={22} y={5} width={1.4} height={12} fill={CLAY_LIGHT} />
      </motion.g>

      <rect x={10} y={8} width={12} height={10} fill={CLAY} />
      <HeadTexture />

      {/* happy, smiling eyes */}
      <rect x={11.5} y={13} width={1.8} height={1.8} fill={OUTLINE} />
      <rect x={13.3} y={11.2} width={1.8} height={1.8} fill={OUTLINE} />
      <rect x={17} y={11.2} width={1.8} height={1.8} fill={OUTLINE} />
      <rect x={18.8} y={13} width={1.8} height={1.8} fill={OUTLINE} />
    </g>
  );
}

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("walk");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("turn"), WALK_MS),
      setTimeout(() => setPhase("wave"), WALK_MS + TURN_MS),
      setTimeout(() => setPhase("exit"), WALK_MS + TURN_MS + WAVE_MS),
      setTimeout(() => setPhase("done"), WALK_MS + TURN_MS + WAVE_MS + EXIT_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  const front = phase !== "walk";

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden bg-black"
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ x: "-46vw" }}
          animate={{ x: 0, y: phase === "walk" ? [0, -1.5, 0] : 0 }}
          transition={{
            x: { duration: WALK_MS / 1000, ease: "easeInOut" },
            y: { duration: 0.25, repeat: phase === "walk" ? Infinity : 0 },
          }}
        >
          <svg viewBox="0 0 32 36" width={150} height={169} shapeRendering="crispEdges">
            {/* the "camera cut": side view crossfades into the front view */}
            <motion.g animate={{ opacity: front ? 0 : 1 }} transition={{ duration: 0.18 }}>
              {!front && <BuddySide />}
            </motion.g>
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: front ? 1 : 0 }}
              transition={{ duration: 0.18, delay: front ? 0.12 : 0 }}
            >
              {front && <BuddyFront waving={phase === "wave" || phase === "exit"} />}
            </motion.g>
          </svg>
        </motion.div>

        <div className="flex min-h-[4.5rem] flex-col items-center gap-2 text-center">
          {(phase === "wave" || phase === "exit") && (
            <>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="font-pixel-square text-xl text-white sm:text-2xl"
              >
                Hii i am Boop, sites pet buddy
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.5, ease: "easeOut" }}
                className="font-pixel-square text-base text-muted-300 sm:text-lg"
              >
                happy to have you here.
              </motion.p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
