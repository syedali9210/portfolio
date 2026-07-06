"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const CLAY = "#da7756";
const CLAY_LIGHT = "#e8916f";
const CLAY_DARK = "#a85a3f";
const CLAY_SHADE = "#8f4830";
const OUTLINE = "#2a1810";

// How the press choreography lines up, in ms from the click:
// buddy pops up (0-300), arm reaches down and pushes the icon (~350-800,
// icon squashes at the touch), playback toggles right at the push (~650),
// then the buddy ducks back down and disappears.
const TOGGLE_AT_MS = 650;
const DONE_AT_MS = 1300;

// Boop's head + pressing arm, peeking over the dock right above the icon.
function PressingBuddy() {
  return (
    <svg viewBox="0 0 20 21" width={40} height={42} shapeRendering="crispEdges" style={{ overflow: "visible" }}>
      {/* arm reaching down past the chin to push the icon */}
      <motion.rect
        x={14.5}
        y={11}
        width={3.5}
        height={7}
        fill={CLAY}
        animate={{ y: [0, 4.5, 4.5, 0] }}
        transition={{ duration: 0.75, times: [0, 0.4, 0.65, 1], delay: 0.35, ease: "easeInOut" }}
      />

      {/* outline for contrast, then the head with texture + happy eyes */}
      <rect x={2} y={1} width={16} height={13} fill={OUTLINE} />
      <rect x={3} y={2} width={14} height={11} fill={CLAY} />
      <rect x={3} y={2} width={14} height={2} fill={CLAY_LIGHT} />
      <rect x={3} y={11} width={14} height={2} fill={CLAY_DARK} />
      <rect x={5} y={4} width={1} height={1} fill={CLAY_LIGHT} />
      <rect x={12} y={9} width={1} height={1} fill={CLAY_SHADE} />
      <rect x={9} y={4.5} width={1} height={1} fill={CLAY_SHADE} />

      <rect x={5.5} y={7.5} width={2} height={2} fill={OUTLINE} />
      <rect x={7.5} y={5.5} width={2} height={2} fill={OUTLINE} />
      <rect x={11} y={5.5} width={2} height={2} fill={OUTLINE} />
      <rect x={13} y={7.5} width={2} height={2} fill={OUTLINE} />
    </svg>
  );
}

export default function MusicDock() {
  const [playing, setPlaying] = useState(false);
  const [pressing, setPressing] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const handleToggle = () => {
    if (pressing) return;
    // play()/pause() must fire synchronously inside the click handler —
    // mobile browsers (iOS Safari in particular) only allow starting
    // playback directly within a user gesture's call stack. Deferring it
    // behind a setTimeout, even a few hundred ms, gets silently blocked,
    // which was why the track never actually played on phones.
    const audio = audioRef.current;
    const next = !playing;
    if (audio) {
      if (next) audio.play().catch(() => {});
      else audio.pause();
    }
    setPressing(true);
    timersRef.current = [
      setTimeout(() => setPlaying(next), TOGGLE_AT_MS),
      setTimeout(() => setPressing(false), DONE_AT_MS),
    ];
  };

  return (
    <div className="absolute bottom-22 left-6 z-10 flex items-center gap-2 rounded-[27px] border-[0.5px] border-white/26 bg-white/10 p-2.5 shadow-[0px_5px_5px_rgba(0,0,0,0.16)] md:bottom-8 md:left-1/2 md:w-[calc(100%-3rem)] md:max-w-[280px] md:-translate-x-1/2 md:rounded-[10px]">
      <audio ref={audioRef} src="/audio/music-portfolio.mp3" loop preload="none" />
      <div className="relative shrink-0">
        {/* Boop pops up from behind the dock to press play */}
        <AnimatePresence>
          {pressing && (
            <motion.div
              initial={{ y: 26, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 26, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2"
            >
              <PressingBuddy />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={handleToggle}
          aria-label={playing ? "Pause music" : "Play music"}
          animate={
            pressing
              ? { scale: [1, 1, 0.82, 1] }
              : playing
                ? { scale: [1, 1.06, 1] }
                : { scale: 1 }
          }
          transition={
            pressing
              ? { duration: 0.75, times: [0, 0.45, 0.6, 1], delay: 0.35 }
              : playing
                ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.2 }
          }
          className="relative block size-5 cursor-pointer md:size-10"
        >
          <Image src="/images/app-icons-music.svg" alt="" fill />
        </motion.button>
      </div>

      <p className="hidden min-w-0 flex-1 truncate text-[13px] tracking-[-0.08px] text-white md:block">
        Moth to a Flame
      </p>
      <span className="hidden shrink-0 text-[13px] text-white/55 md:inline">
        {playing ? "❚❚" : "▶"}
      </span>
      <span className="hidden shrink-0 text-[11px] text-white/26 md:inline">▶▶</span>
    </div>
  );
}
