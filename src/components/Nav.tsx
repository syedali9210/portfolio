"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { lenisRef } from "@/components/SmoothScroll";

// Root-relative hashes so the links work from any page (case studies
// included), not just the home page.
const NAV_ITEMS = [
  { label: "Projects", href: "/#projects" },
  { label: "My Space", href: "/#my-space" },
  { label: "About me", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

// On mobile the nav docks to the bottom as two glass pills (per the Figma
// mobile frame): "Projects" alone, then the remaining links grouped.
const MOBILE_PILL_GROUPS = [[NAV_ITEMS[0]], NAV_ITEMS.slice(1)];

const NAV_SPRING = { type: "spring" as const, stiffness: 180, damping: 22 };

// Adaptive (Apple-style) tinting: glass pill + text colors for each mode,
// crossfaded via transition-colors as the page scrolls underneath.
const PILL_DARK_BG =
  "border-white/26 from-white/10 to-[#999999]/10 shadow-[0px_10px_5px_rgba(0,0,0,0.15)]";
const PILL_LIGHT_BG =
  "border-black/15 from-black/5 to-black/10 shadow-[0px_10px_15px_rgba(0,0,0,0.08)]";
const TEXT_DARK_BG = "text-muted-300 hover:text-white";
const TEXT_LIGHT_BG = "text-[#4a4a4a] hover:text-black";

function useClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

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
  const time = useClock();
  const topLight = useBackdropIsLight(probeTop);
  const bottomLight = useBackdropIsLight(probeBottom);
  const [active, setActive] = useActiveSection();

  const topText = topLight ? TEXT_LIGHT_BG : TEXT_DARK_BG;
  const bottomText = bottomLight ? TEXT_LIGHT_BG : TEXT_DARK_BG;

  // When already on the home page, glide to the section through Lenis
  // instead of letting the browser jump; from other pages the plain
  // /#hash navigation takes over. Either way the active indicator
  // switches immediately for instant feedback.
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = href.split("#")[1];
    if (!hash) return;
    setActive(hash);
    if (window.location.pathname !== "/") return;
    const el = document.getElementById(hash);
    if (!el) return;
    e.preventDefault();
    history.pushState(null, "", `#${hash}`);
    lenisRef.current?.scrollTo(el, { offset: -16 });
  };

  return (
    <>
      {/* Top bar: name + time on mobile; the link pill only joins on md+.
          The whole bar drops in from above, then the links cascade in. */}
      <motion.header
        data-adaptive-nav
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...NAV_SPRING, delay: 0.15 }}
        className="fixed top-0 left-0 z-50 flex w-full items-center justify-between gap-4 px-5 py-5 sm:px-10 sm:py-6"
      >
        <p className={`shrink-0 text-base transition-colors duration-500 ${topLight ? "text-[#4a4a4a]" : "text-muted-300"}`}>
          Syed.Ali
        </p>

        <nav
          className={`hidden max-w-full items-center gap-10 rounded-2xl border-[0.5px] bg-gradient-to-b px-4 py-1.5 backdrop-blur-[48px] transition-all duration-500 md:flex lg:gap-24 ${
            topLight ? PILL_LIGHT_BG : PILL_DARK_BG
          }`}
        >
          {NAV_ITEMS.map((item, i) => {
            const isActive = item.href.endsWith(`#${active}`);
            return (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...NAV_SPRING, delay: 0.35 + i * 0.08 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`relative shrink-0 px-3 py-1.5 text-sm leading-4 font-medium tracking-[-0.08px] transition-colors duration-500 ${
                  isActive ? (topLight ? "text-black" : "text-white") : topText
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-desktop"
                    transition={NAV_SPRING}
                    className={`absolute inset-0 rounded-[10px] ${topLight ? "bg-black/10" : "bg-white/15"}`}
                  />
                )}
                <span className="relative">{item.label}</span>
              </motion.a>
            );
          })}
        </nav>

        <p className={`shrink-0 text-base transition-colors duration-500 ${topLight ? "text-[#4a4a4a]" : "text-muted-300"}`}>
          {time ?? " "}
        </p>
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
    </>
  );
}
