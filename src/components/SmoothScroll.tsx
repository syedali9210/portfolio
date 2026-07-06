"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The live Lenis instance, shared so the nav (or anything else) can drive
// smooth programmatic scrolls through the same engine.
export const lenisRef: { current: Lenis | null } = { current: null };

// Site-wide buttery smooth scrolling. Driven through GSAP's ticker so the
// pinned Projects title sequence (ScrollTrigger) stays perfectly in sync,
// and `anchors` makes plain #hash links glide instead of jump.
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      anchors: { offset: -16 },
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
