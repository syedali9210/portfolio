"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StackedProjectCards from "@/components/StackedProjectCards";
import { PROJECTS } from "@/data/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = headingRef.current;
      if (!heading) return;

      // Measure the heading at its natural (untransformed) size so the
      // peak scale can be computed to just fill the viewport width on
      // whatever device this is running on, instead of a fixed multiplier
      // that only happens to fit one screen size.
      const naturalWidth = heading.getBoundingClientRect().width;
      const peakScale = Math.max(1.2, (window.innerWidth * 0.92) / naturalWidth);

      // The title gets its own dedicated, pinned scroll distance: once the
      // hero has scrolled fully out of view, the screen holds black for a
      // beat, then "projects" rises up from off-screen at the bottom,
      // grows large enough to fill the screen width, then shrinks back
      // down to its normal size as it settles near the top.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: titleWrapRef.current,
          start: "top top",
          end: "+=1100",
          scrub: true,
          pin: true,
        },
      });

      tl.set(heading, { y: "70vh", scale: 0.4, opacity: 0 })
        .to(heading, { opacity: 0, duration: 0.15 })
        .to(heading, {
          y: "0vh",
          scale: peakScale,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        })
        .to(heading, {
          y: "-32vh",
          scale: 1,
          duration: 0.9,
          ease: "power2.inOut",
        });

      // The cards scroll in once the pinned title sequence releases.
      gsap.fromTo(
        cardsRef.current,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative">
      <div ref={titleWrapRef} className="relative flex h-screen items-center justify-center overflow-hidden px-6">
        <h2
          ref={headingRef}
          className="whitespace-nowrap text-center font-pixel text-6xl text-muted-500 sm:text-8xl md:text-[128px]"
          style={{ transformOrigin: "50% 50%" }}
        >
          projects
        </h2>
      </div>

      {/* Pulled up to trim the dead scroll space left over after the pinned
          title sequence releases. The pinned title wrapper's own height
          gets added to the document flow after it (on top of the pin's own
          scroll distance), so without this the cards would sit almost a
          full extra viewport below where the title actually settles.
          Viewport-relative so tall screens don't reopen the gap. */}
      <div ref={cardsRef} className="mx-auto -mt-[60vh] max-w-5xl px-6 pb-16 sm:px-10">
        <StackedProjectCards projects={PROJECTS} />
      </div>
    </section>
  );
}
