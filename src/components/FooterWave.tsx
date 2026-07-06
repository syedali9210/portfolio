"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BAR_COUNT = 40;
const FLAT_HEIGHT = 14;
const WAVE_HEIGHT_PX = 220;

// Deterministic (no Math.random(), so no server/client hydration mismatch):
// an overall mountain-shaped hump plus a higher-frequency wiggle so the
// peaks look organic rather than a single smooth curve.
const PEAKS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = i / (BAR_COUNT - 1);
  const mountain = Math.sin(t * Math.PI);
  const jitter = Math.sin(t * Math.PI * 7 + 1.3) * 0.5 + 0.5;
  return Math.min(100, FLAT_HEIGHT + mountain * 70 + jitter * 16);
});

// "CONTACT" is spread evenly across the same width as the bars, and each
// letter rides on top of whichever bar sits beneath it.
const LETTERS = "CONTACT".split("");
const LETTER_SLOTS = LETTERS.map((char, i) => {
  const t = (i + 0.5) / LETTERS.length;
  const barIndex = Math.round(t * (BAR_COUNT - 1));
  return { char, left: t * 100, peak: PEAKS[barIndex] };
});

export default function FooterWave() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const bars = container.querySelectorAll<HTMLDivElement>("[data-wave-bar]");
    const letters = container.querySelectorAll<HTMLDivElement>("[data-wave-letter]");

    // A scroll-down pull trigger, not a scrub: crossing the trigger point
    // fires a self-running timeline (rise -> hold -> fall) that plays out
    // on its own over real time, independent of further scrolling, rather
    // than freezing wherever the scroll position happens to stop.
    const RISE = 0.9;
    const HOLD = 0.4;
    const FALL = 0.8;
    const fallStart = RISE + HOLD;
    const RUBBER_IN = "elastic.out(1, 0.5)";
    const RUBBER_OUT = "elastic.out(1, 0.65)";

    const tl = gsap.timeline({ paused: true });

    bars.forEach((bar, i) => {
      tl.fromTo(
        bar,
        { height: `${FLAT_HEIGHT}%` },
        { height: `${PEAKS[i]}%`, duration: RISE, ease: RUBBER_IN },
        0
      ).to(bar, { height: `${FLAT_HEIGHT}%`, duration: FALL, ease: RUBBER_OUT }, fallStart);
    });

    // xPercent (rather than the raw `translate(-50%, ...)` set in the JSX
    // below) so GSAP owns the whole transform — animating `y` directly
    // would otherwise overwrite that inline transform and drop the
    // horizontal centering.
    gsap.set(letters, { xPercent: -50 });

    letters.forEach((letter, i) => {
      const heightPx = (LETTER_SLOTS[i].peak / 100) * WAVE_HEIGHT_PX;
      tl.fromTo(
        letter,
        { y: 0 },
        { y: -heightPx, duration: RISE, ease: RUBBER_IN },
        0
      ).to(letter, { y: 0, duration: FALL, ease: RUBBER_OUT }, fallStart);
    });

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 85%",
      onEnter: () => tl.restart(),
      onLeaveBack: () => tl.pause(0),
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none relative h-[340px] w-full">
      {/* the bars: clipped, masked at the edges, and blurred for the glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-[220px] overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="flex h-full items-end gap-[3px] blur-[6px]">
          {PEAKS.map((_, i) => (
            <div
              key={i}
              data-wave-bar
              className="min-w-0 flex-1 rounded-t-sm"
              style={{
                height: `${FLAT_HEIGHT}%`,
                backgroundImage:
                  "linear-gradient(to top, #004ce3 0%, #00b8e3 20%, #ffd400 42%, #ff7a00 58%, #c83900 70%, #cb00e2 85%, #a600ff 100%)",
                backgroundSize: "100% 220px",
                backgroundPosition: "bottom",
                backgroundRepeat: "no-repeat",
              }}
            />
          ))}
        </div>
      </div>

      {/* "CONTACT", each letter riding the height of the hill beneath it */}
      {LETTER_SLOTS.map((slot, i) => (
        <span
          key={i}
          data-wave-letter
          className="absolute bottom-0 font-pixel text-2xl text-white sm:text-5xl md:text-[64px]"
          style={{ left: `${slot.left}%` }}
        >
          {slot.char}
        </span>
      ))}
    </div>
  );
}
