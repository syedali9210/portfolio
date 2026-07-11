"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { lenisRef } from "@/components/SmoothScroll";
import { PROJECTS } from "@/data/projects";
import DynamicInfoCard from "@/components/DynamicInfoCard";
import ProgressiveBlur from "@/components/ProgressiveBlur";

// Root-relative hashes so the links work from any page (case studies
// included), not just the home page. "Projects" points straight at the
// first project card rather than the section top, so it drops the
// visitor right into the list instead of the pinned title scrub.
export const NAV_ITEMS = [
  { label: "Projects", href: `/#${PROJECTS[0].id}` },
  { label: "About me", href: "/#about" },
  { label: "My Space", href: "/#my-space" },
  { label: "Contact", href: "/#contact" },
];

// On mobile the nav docks to the bottom as two glass pills (per the Figma
// mobile frame): "Projects" alone, then the remaining links grouped.
const MOBILE_PILL_GROUPS = [[NAV_ITEMS[0]], NAV_ITEMS.slice(1)];

const NAV_SPRING = { type: "spring" as const, stiffness: 140, damping: 26 };

// Adaptive (Apple-style) tinting: glass pill + text colors for each mode,
// crossfaded via transition-colors as the page scrolls underneath.
const PILL_DARK_BG =
  "border-white/26 from-white/10 to-[#999999]/10 shadow-[0px_10px_5px_rgba(0,0,0,0.15)]";
const PILL_LIGHT_BG =
  "border-black/15 from-black/5 to-black/10 shadow-[0px_10px_15px_rgba(0,0,0,0.08)]";
const TEXT_DARK_BG = "text-muted-300 hover:text-white";
const TEXT_LIGHT_BG = "text-[#4a4a4a] hover:text-black";

// Samples the page behind a probe point (skipping the nav itself) and
// reports whether the effective background there is light, so the nav can
// flip to dark-on-light — the way iOS chrome adapts to content behind it.
// Considers both CSS background colors and the actual pixels of images
// (most of this site's "white" areas are screenshots, not CSS).
function useBackdropIsLight(getProbeY: () => number) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const luminanceOf = ([r, g, b]: number[]) =>
      (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const parseColor = (value: string): [number, number, number] | null => {
      const m = value.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(",").map(parseFloat);
      // Glassy overlays (low alpha) don't decide the tint — skip them.
      if (a < 0.5) return null;
      return [r, g, b];
    };

    // Average an 8x8 patch of the image around the probe point. Returns
    // null for images that can't be read (cross-origin) or transparent
    // regions, letting the probe fall through to whatever is behind.
    const sampleImage = (img: HTMLImageElement, x: number, y: number) => {
      if (!ctx || !img.complete || !img.naturalWidth) return null;
      try {
        const rect = img.getBoundingClientRect();
        const nx = ((x - rect.left) / rect.width) * img.naturalWidth;
        const ny = ((y - rect.top) / rect.height) * img.naturalHeight;
        ctx.clearRect(0, 0, 8, 8);
        ctx.drawImage(img, nx - 8, ny - 8, 16, 16, 0, 0, 8, 8);
        const d = ctx.getImageData(0, 0, 8, 8).data;
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] > 128) {
            r += d[i];
            g += d[i + 1];
            b += d[i + 2];
            n++;
          }
        }
        return n > 16 ? ([r / n, g / n, b / n] as [number, number, number]) : null;
      } catch {
        return null;
      }
    };

    const probe = () => {
      const x = window.innerWidth / 2;
      const y = getProbeY();
      // elementsFromPoint returns the full paint stack topmost-first, so
      // the first opaque background under the nav is what the eye sees.
      const stack = document.elementsFromPoint(x, y);
      for (const el of stack) {
        if (el.closest("[data-adaptive-nav]")) continue;
        const color =
          el instanceof HTMLImageElement
            ? sampleImage(el, x, y)
            : parseColor(getComputedStyle(el).backgroundColor);
        if (!color) continue;
        setLight(luminanceOf(color) > 0.6);
        return;
      }
      setLight(false);
    };

    // Sampling walks the paint stack and reads image pixels, so it's too
    // heavy to run every scroll frame. Trailing-edge throttle: at most one
    // probe per PROBE_INTERVAL, and always one final probe ≤ an interval
    // after scrolling stops — imperceptible next to the 500ms crossfade.
    const PROBE_INTERVAL = 120;
    let lastRun = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      if (timer) return;
      const wait = Math.max(0, PROBE_INTERVAL - (performance.now() - lastRun));
      timer = setTimeout(() => {
        timer = null;
        lastRun = performance.now();
        probe();
      }, wait);
    };

    probe();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (timer) clearTimeout(timer);
    };
  }, [getProbeY]);

  return light;
}

const probeTop = () => 44;
const probeBottom = () => window.innerHeight - 60;

// Which section currently fills the middle of the viewport, as a scroll
// spy — drives the sliding "active" indicator in the nav.
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.href.split("#")[1])
    ).filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActive(visible.target.id);
        } else if (entries.some((e) => !e.isIntersecting)) {
          // Nothing in the active band (e.g. back up at the hero).
          const anyVisible = sections.some((s) => {
            const r = s.getBoundingClientRect();
            return r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
          });
          if (!anyVisible) setActive(null);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.05, 0.25] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return [active, setActive] as const;
}

export default function Nav() {
  const topLight = useBackdropIsLight(probeTop);
  const bottomLight = useBackdropIsLight(probeBottom);
  const [active, setActive] = useActiveSection();
  // Tracks the notch's live rendered height so the link pill below it can
  // follow the expand/collapse animation instead of assuming a fixed gap.
  // Seeded with the notch's collapsed height so there's no jump on mount.
  const [notchHeight, setNotchHeight] = useState(58);
  const NOTCH_GAP = 20;

  const pathname = usePathname();
  const router = useRouter();
  const isProjectPage = pathname?.startsWith("/projects/") ?? false;

  const bottomText = bottomLight ? TEXT_LIGHT_BG : TEXT_DARK_BG;

  // Case-study pages are always reached by clicking into them from the
  // homepage, so there's real history to pop; direct links (new tab, no
  // referrer) fall back to home instead of leaving the visitor stuck.
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // When already on the home page, glide to the section (or, for "/",
  // back to the very top) through Lenis instead of letting the browser
  // jump; from other pages the plain href navigation takes over. Either
  // way the active indicator switches immediately for instant feedback.
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
    <>
      {/* Fades page content into a blur as it scrolls toward the very top
          or (on mobile) bottom edge, so it stays legible under the notch,
          back button, and docked nav without a hard glass panel. */}
      <ProgressiveBlur side="top" className="z-40" />
      <ProgressiveBlur side="bottom" height={110} className="z-40 md:hidden" />

      {/* Back button only; the desktop link pill is gone — its links now
          live inside the notch's expanded (hover) state instead. */}
      <motion.header
        data-adaptive-nav
        initial={{ y: -48, opacity: 0, top: notchHeight + NOTCH_GAP }}
        animate={{ y: 0, opacity: 1, top: notchHeight + NOTCH_GAP }}
        transition={{
          default: { ...NAV_SPRING, delay: 0.15 },
          top: { type: "spring", stiffness: 170, damping: 32 },
        }}
        className="fixed left-0 z-50 w-full px-5 sm:px-10"
      >
        {isProjectPage && (
          <motion.button
            type="button"
            onClick={handleBack}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...NAV_SPRING, delay: 0.35 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute top-1/2 left-5 flex -translate-y-1/2 shrink-0 items-center gap-1.5 rounded-2xl border-[0.5px] bg-gradient-to-b px-3 py-1.5 text-sm font-medium tracking-[-0.08px] backdrop-blur-[48px] transition-all duration-500 sm:left-10 ${
              topLight ? `${PILL_LIGHT_BG} text-[#4a4a4a] hover:text-black` : `${PILL_DARK_BG} text-muted-300 hover:text-white`
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <path
                d="M8.5 3L4.5 7L8.5 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </motion.button>
        )}
      </motion.header>

      {/* Mobile: bottom-docked nav pills, rising up from below the fold
          with a slight stagger between the two pills. */}
      <nav
        data-adaptive-nav
        className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 md:hidden"
      >
        {MOBILE_PILL_GROUPS.map((group, i) => (
          <motion.div
            key={group[0].label}
            initial={{ y: 64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...NAV_SPRING, delay: 0.25 + i * 0.12 }}
            className={`flex items-center gap-1 rounded-2xl border-[0.5px] bg-gradient-to-b p-1.5 backdrop-blur-[48px] transition-all duration-500 ${
              bottomLight ? PILL_LIGHT_BG : PILL_DARK_BG
            }`}
          >
            {group.map((item) => {
              const isActive = item.href.endsWith(`#${active}`);
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  whileTap={{ scale: 0.92 }}
                  className={`relative shrink-0 px-2.5 py-1.5 text-sm font-medium whitespace-nowrap tracking-[-0.08px] transition-colors duration-500 ${
                    isActive ? (bottomLight ? "text-black" : "text-white") : bottomText
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-mobile"
                      transition={NAV_SPRING}
                      className={`absolute inset-0 rounded-[10px] ${bottomLight ? "bg-black/10" : "bg-white/15"}`}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </motion.a>
              );
            })}
          </motion.div>
        ))}
      </nav>

      <DynamicInfoCard
        onHeightChange={setNotchHeight}
        navItems={NAV_ITEMS}
        activeSection={active}
        onNavClick={handleNavClick}
      />
    </>
  );
}
