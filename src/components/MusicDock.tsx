"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import RippleGrid, { type RippleGridHandle } from "@/components/RippleGrid";

// How the press choreography lines up, in ms from the click: icon squashes
// at the touch (~0-450), playback toggles right at the bottom of the
// squash (~350), then it springs back.
const TOGGLE_AT_MS = 350;
const DONE_AT_MS = 450;

// A simple eighth-note glyph as a 5x6 bitmap — the icon's idle shape when
// nothing is rippling.
const NOTE_PATTERN = [
  [false, false, false, true, false],
  [false, false, false, true, false],
  [false, false, false, true, false],
  [false, true, true, true, false],
  [true, true, true, false, false],
  [false, true, false, false, false],
];

const RIPPLE_COLORS = ["#8c3200", "#a85a3f", "#da7756", "#e8916f", "#000000"];

// Same icon on both breakpoints, just rendered twice with a different ref
// each — mobile's copy sits inside a glass-panel container (matching the
// site's standard pill style, e.g. the My Space Blogs/Archive toggle),
// desktop's is a bare icon with no wrapper.
function PlayIcon({
  rippleRef,
  pressing,
  onClick,
  ariaLabel,
  className,
}: {
  rippleRef: React.RefObject<RippleGridHandle | null>;
  pressing: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  className: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      animate={pressing ? { scale: [1, 1, 0.82, 1] } : { scale: 1 }}
      transition={pressing ? { duration: 0.45, times: [0, 0.45, 0.6, 1] } : { duration: 0.2 }}
      className={`relative block cursor-pointer overflow-hidden rounded-md ${className}`}
    >
      <RippleGrid
        ref={rippleRef}
        radius={1}
        elementSize={2.5}
        gap={1}
        fill="rgba(255,255,255,0.15)"
        patternFill="#ffffff"
        colors={RIPPLE_COLORS}
        shape="circle"
        scale={2.4}
        pattern={NOTE_PATTERN}
      />
    </motion.button>
  );
}

export default function MusicDock() {
  const [playing, setPlaying] = useState(false);
  const [pressing, setPressing] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mobileRippleRef = useRef<RippleGridHandle>(null);
  const desktopRippleRef = useRef<RippleGridHandle>(null);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
    if (pressing) return;
    mobileRippleRef.current?.triggerAt(e.clientX, e.clientY);
    desktopRippleRef.current?.triggerAt(e.clientX, e.clientY);
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

  const ariaLabel = playing ? "Pause music" : "Play music";

  return (
    <>
      <audio ref={audioRef} src="/audio/music-portfolio.mp3" loop preload="none" />

      {/* Mobile: icon inside the standard glass-panel container. */}
      <div className="fixed bottom-22 left-6 z-40 rounded-2xl border-[0.5px] border-white/26 bg-gradient-to-b from-white/10 to-[#999999]/10 p-2.5 shadow-[0px_10px_5px_rgba(0,0,0,0.15)] backdrop-blur-[48px] md:hidden">
        <PlayIcon
          rippleRef={mobileRippleRef}
          pressing={pressing}
          onClick={handleToggle}
          ariaLabel={ariaLabel}
          className="size-5"
        />
      </div>

      {/* Desktop: same glass-panel container, centered under the dock. */}
      <div className="absolute bottom-8 left-1/2 z-40 hidden -translate-x-1/2 rounded-2xl border-[0.5px] border-white/26 bg-gradient-to-b from-white/10 to-[#999999]/10 p-2.5 shadow-[0px_10px_5px_rgba(0,0,0,0.15)] backdrop-blur-[48px] md:block">
        <PlayIcon
          rippleRef={desktopRippleRef}
          pressing={pressing}
          onClick={handleToggle}
          ariaLabel={ariaLabel}
          className="size-10"
        />
      </div>
    </>
  );
}
