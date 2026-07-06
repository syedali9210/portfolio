"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // The default "load" auto-refresh fires once all hero images finish
  // downloading (several seconds in), and GSAP's refresh pass briefly
  // scrolls to 0 to remeasure trigger positions. If a user clicks a hash
  // nav link right around then, that remeasure stomps the browser's
  // native scroll-to-anchor and can leave the page stuck at the top.
  // "resize" stays in the list so pinned sections re-measure when the
  // viewport changes (orientation flips, window resizes).
  ScrollTrigger.config({ autoRefreshEvents: "DOMContentLoaded,visibilitychange,resize" });
}

export default function HeroGlow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {children}
    </div>
  );
}
