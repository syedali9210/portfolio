"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const CLAY = "#da7756";
const CLAY_DARK = "#c05f40";
const IRON = "#8a8a8a";
const IRON_DARK = "#555555";
const SWEAT = "#7ec8ff";
const BAG = "#3f6b8a";
const BAG_DARK = "#2f5570";
const CUP = "#e8e4d8";
const COFFEE = "#5a3a2a";
const STEAM = "#cfe3ee";

type Facing = "left" | "right" | "front";
type Scene = "gym" | "coffee";

type Phase = {
  name: string;
  scene: Scene;
  duration: number;
  buddyX: number;
  bodyY: number;
  armRotate: number;
  dumbbellY: number;
  walking: boolean;
  jolt: boolean;
  sweat: boolean;
  sitting: boolean;
  cupRaised: boolean;
  steam: boolean;
  facing: Facing;
};

const STAND: Omit<Phase, "name" | "duration" | "facing" | "scene"> = {
  buddyX: 0,
  bodyY: 0,
  armRotate: 0,
  dumbbellY: 0,
  walking: false,
  jolt: false,
  sweat: false,
  sitting: false,
  cupRaised: false,
  steam: false,
};

const PHASES: Phase[] = [
  // scene 1: the gym
  { name: "walk-in", scene: "gym", duration: 1500, ...STAND, buddyX: 0, walking: true, facing: "right" },
  { name: "reach-1", scene: "gym", duration: 500, ...STAND, bodyY: 6, armRotate: 10, facing: "front" },
  { name: "strain-1", scene: "gym", duration: 800, ...STAND, bodyY: 6, armRotate: 10, jolt: true, sweat: true, facing: "front" },
  { name: "reset-1", scene: "gym", duration: 400, ...STAND, bodyY: 0, facing: "front" },
  { name: "reach-2", scene: "gym", duration: 500, ...STAND, bodyY: 6, armRotate: 10, facing: "front" },
  { name: "strain-2", scene: "gym", duration: 800, ...STAND, bodyY: 6, armRotate: 10, jolt: true, sweat: true, facing: "front" },
  { name: "reset-2", scene: "gym", duration: 400, ...STAND, bodyY: 0, facing: "front" },
  { name: "reach-3", scene: "gym", duration: 500, ...STAND, bodyY: 6, armRotate: 10, facing: "front" },
  { name: "lift-success", scene: "gym", duration: 900, ...STAND, bodyY: 0, armRotate: -6, dumbbellY: -18, facing: "front" },
  { name: "hold", scene: "gym", duration: 1400, ...STAND, bodyY: 0, armRotate: -6, dumbbellY: -18, facing: "front" },
  { name: "walk-out", scene: "gym", duration: 1500, ...STAND, buddyX: -16, walking: true, facing: "left" },

  // scene 2: coffee break
  { name: "walk-in-2", scene: "coffee", duration: 1500, ...STAND, buddyX: 0, walking: true, facing: "right" },
  { name: "sit-down", scene: "coffee", duration: 450, ...STAND, sitting: true, facing: "front" },
  { name: "sip-1", scene: "coffee", duration: 700, ...STAND, sitting: true, cupRaised: true, steam: true, facing: "front" },
  { name: "pause-1", scene: "coffee", duration: 1200, ...STAND, sitting: true, steam: true, facing: "front" },
  { name: "sip-2", scene: "coffee", duration: 700, ...STAND, sitting: true, cupRaised: true, steam: true, facing: "front" },
  { name: "pause-2", scene: "coffee", duration: 1200, ...STAND, sitting: true, steam: true, facing: "front" },
  { name: "stand-up", scene: "coffee", duration: 450, ...STAND, facing: "front" },
  { name: "walk-out-2", scene: "coffee", duration: 1500, ...STAND, buddyX: -16, walking: true, facing: "left" },
];

export default function PetBuddy() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = PHASES[phaseIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, phase.duration);
    return () => clearTimeout(timer);
  }, [phaseIndex, phase.duration]);

  const dur = phase.duration / 1000;
  const isWalking = phase.walking;
  const isSitting = phase.sitting && !isWalking;
  const noseX = phase.facing === "right" ? 21 : phase.facing === "left" ? 9 : null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        viewBox="0 0 32 36"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="crispEdges"
      >
        {/* bean bag — a fixture of the coffee-break scene, crossfades in/out */}
        <AnimatePresence>
          {phase.scene === "coffee" && (
            <motion.g
              key="beanbag"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              <rect x={4} y={22} width={24} height={12} rx={6} fill={BAG} />
              <rect x={4} y={28} width={24} height={6} rx={5} fill={BAG_DARK} />
            </motion.g>
          )}
        </AnimatePresence>

        <motion.g
          initial={{ x: -16 }}
          animate={{ x: phase.buddyX }}
          transition={{ duration: dur, ease: "easeInOut" }}
        >
          {/* legs */}
          {isWalking ? (
            <>
              <motion.rect
                x={11}
                y={27}
                width={4}
                height={7}
                fill={CLAY_DARK}
                style={{ transformOrigin: "13px 27px" }}
                animate={{ rotate: [20, -20, 20], x: [-1, 1, -1] }}
                transition={{ duration: dur, ease: "easeInOut" }}
              />
              <motion.rect
                x={17}
                y={27}
                width={4}
                height={7}
                fill={CLAY_DARK}
                style={{ transformOrigin: "19px 27px" }}
                animate={{ rotate: [-20, 20, -20], x: [1, -1, 1] }}
                transition={{ duration: dur, ease: "easeInOut" }}
              />
            </>
          ) : isSitting ? (
            <>
              <rect x={9} y={29} width={6} height={4} fill={CLAY_DARK} />
              <rect x={17} y={29} width={6} height={4} fill={CLAY_DARK} />
            </>
          ) : (
            <>
              <rect x={12} y={27} width={4} height={7} fill={CLAY_DARK} />
              <rect x={17} y={27} width={4} height={7} fill={CLAY_DARK} />
            </>
          )}

          {isSitting ? (
            <g>
              {/* sunk into the bean bag */}
              <rect x={11} y={21} width={10} height={8} fill={CLAY} />

              {/* resting arm */}
              <rect
                x={6}
                y={20}
                width={4}
                height={8}
                fill={CLAY}
                style={{ transformOrigin: "8px 21px", transform: "rotate(12deg)" }}
              />

              {/* arm holding the coffee, with a little sip lift */}
              <motion.g
                animate={{ y: phase.cupRaised ? -2 : 0 }}
                transition={{ duration: dur, ease: "easeInOut" }}
              >
                <rect x={22} y={12} width={4} height={9} fill={CLAY} />
                <rect x={21} y={8} width={6} height={5} fill={CUP} />
                <rect x={22} y={8.5} width={4} height={1.5} fill={COFFEE} />
                <rect x={27} y={9.5} width={1.5} height={2} fill={CUP} />

                <motion.g
                  animate={{ opacity: phase.steam ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.rect
                    x={22}
                    width={1}
                    height={3}
                    fill={STEAM}
                    animate={{ y: [6, 2, 6], opacity: [0.3, 0.9, 0.3] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.rect
                    x={25}
                    width={1}
                    height={3}
                    fill={STEAM}
                    animate={{ y: [7, 3, 7], opacity: [0.3, 0.9, 0.3] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                </motion.g>
              </motion.g>

              <rect x={10} y={14} width={12} height={10} fill={CLAY} />
              <rect x={12} y={18.5} width={3} height={1} fill="#1a1a1a" />
              <rect x={17} y={18.5} width={3} height={1} fill="#1a1a1a" />
            </g>
          ) : (
            <motion.g animate={{ y: phase.bodyY }} transition={{ duration: dur, ease: "easeInOut" }}>
              <rect x={11} y={18} width={10} height={9} fill={CLAY} />

              {isWalking ? (
                <motion.rect
                  x={13}
                  y={17}
                  width={4}
                  height={10}
                  fill={CLAY}
                  style={{ transformOrigin: "15px 18px" }}
                  animate={{ rotate: [-30, 30, -30] }}
                  transition={{ duration: dur, ease: "easeInOut" }}
                />
              ) : (
                <>
                  <motion.rect
                    x={6}
                    y={16}
                    width={4}
                    height={11}
                    fill={CLAY}
                    style={{ transformOrigin: "8px 18px" }}
                    animate={{ rotate: phase.armRotate }}
                    transition={{ duration: dur, ease: "easeInOut" }}
                  />
                  <motion.rect
                    x={22}
                    y={16}
                    width={4}
                    height={11}
                    fill={CLAY}
                    style={{ transformOrigin: "24px 18px" }}
                    animate={{ rotate: -phase.armRotate }}
                    transition={{ duration: dur, ease: "easeInOut" }}
                  />
                </>
              )}

              <rect x={10} y={8} width={12} height={10} fill={CLAY} />

              {noseX !== null && <rect x={noseX} y={11} width={2} height={3} fill={CLAY_DARK} />}

              {isWalking ? (
                <>
                  <rect x={12} y={12} width={3} height={2} fill="#1a1a1a" />
                  <rect x={17} y={12} width={3} height={2} fill="#1a1a1a" />
                </>
              ) : (
                <>
                  <rect x={12} y={12.5} width={3} height={1} fill="#1a1a1a" />
                  <rect x={17} y={12.5} width={3} height={1} fill="#1a1a1a" />
                </>
              )}

              <motion.rect
                x={9}
                y={9}
                width={2}
                height={2}
                fill={SWEAT}
                animate={{ opacity: phase.sweat ? [0, 1, 1, 0] : 0, y: phase.sweat ? [9, 9, 15, 18] : 9 }}
                transition={{ duration: dur, ease: "easeInOut" }}
              />
              <motion.rect
                x={21}
                y={9}
                width={2}
                height={2}
                fill={SWEAT}
                animate={{ opacity: phase.sweat ? [0, 1, 1, 0] : 0, y: phase.sweat ? [9, 9, 15, 18] : 9 }}
                transition={{ duration: dur, ease: "easeInOut" }}
              />
            </motion.g>
          )}
        </motion.g>

        {/* barbell — a fixture of the gym scene, crossfades in/out, drawn last so it's never occluded */}
        <AnimatePresence>
          {phase.scene === "gym" && (
            <motion.g
              key="barbell"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              <motion.g
                animate={{
                  y: phase.dumbbellY,
                  x: phase.jolt ? [0, -0.6, 0.6, -0.6, 0] : 0,
                }}
                transition={{ duration: dur, ease: "easeInOut" }}
              >
                <rect x={2} y={28} width={5} height={7} fill={IRON} />
                <rect x={3} y={29.5} width={3} height={4} fill={IRON_DARK} />
                <rect x={7} y={30.5} width={18} height={2} fill={IRON} />
                <rect x={25} y={28} width={5} height={7} fill={IRON} />
                <rect x={26} y={29.5} width={3} height={4} fill={IRON_DARK} />
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
