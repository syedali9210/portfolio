"use client";

import { useState, type MouseEvent } from "react";
import DynamicInfoCard from "@/components/DynamicInfoCard";
import { NAV_ITEMS } from "@/components/Nav";
import { lenisRef } from "@/components/SmoothScroll";

// Reuses the site's actual notch nav bar as a self-contained showcase
// piece inside the archive card, instead of a screenshot or a fake
// reproduction — same component, same real navigation, just contained in
// its own box (`variant="embedded"`) rather than pinned to the viewport.
// Scaled down a notch since the notch's `sm:` breakpoints key off the real
// (desktop-width) page viewport, not this card's own footprint.
export default function NavBarReveal() {
  const [active, setActive] = useState<string | null>(null);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = href.includes("#") ? href.split("#")[1] : null;
    setActive(hash);
    if (window.location.pathname !== "/") return;
    e.preventDefault();
    if (!hash) {
      history.pushState(null, "", "/");
      lenisRef.current?.scrollTo(0, { offset: 0 });
      return;
    }
    const el = document.getElementById(hash);
    if (!el) return;
    history.pushState(null, "", `#${hash}`);
    lenisRef.current?.scrollTo(el, { offset: -16 });
  };

  return (
    <div className="relative h-full w-full">
      {/* `transform` (not just `position: relative`) makes this the
          containing block for DynamicInfoCard's own `position: absolute`
          root, so its `left-1/2 -translate-x-1/2` centers against this
          box's real width instead of collapsing against an unsized parent. */}
      <div className="relative w-full origin-top scale-[0.85] pt-4">
        <DynamicInfoCard
          variant="embedded"
          navItems={NAV_ITEMS}
          activeSection={active}
          onNavClick={handleNavClick}
        />
      </div>
    </div>
  );
}
