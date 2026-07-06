"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/data/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Clears the fixed site nav bar at the top of the viewport.
const STICKY_TOP = 110;

export default function StackedProjectCards({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll<HTMLDivElement>("[data-stack-card]");
    if (!cards || cards.length < 2) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        // The last card has nothing scrolling over it, so it never shrinks.
        if (i === cards.length - 1) return;
        const inner = card.querySelector<HTMLElement>("[data-stack-inner]");
        if (!inner) return;

        // Scale only — no opacity fade, so the covered card stays solid
        // instead of looking glassy/see-through.
        gsap.to(inner, {
          scale: 0.94,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: `top top+=${STICKY_TOP}`,
            end: "+=" + card.offsetHeight,
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-10">
      {projects.map((project, i) => (
        <div key={project.id} data-stack-card className="sticky" style={{ top: STICKY_TOP, zIndex: i + 1 }}>
          <div data-stack-inner className="origin-top">
            <ProjectCard project={project} />
          </div>
        </div>
      ))}
    </div>
  );
}
