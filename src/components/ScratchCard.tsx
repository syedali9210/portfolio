"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";

// A pixel-exact replica of the Framer University "Image Scratch" card
// (https://scratcher.learnframer.site/): a 480x300 black credit-card with a
// dotted foil surface that scratches off under a grungy 70px brush to reveal
// the text hiding underneath. The foil is the actual production technique
// from Framer's ImageScratch module — an overlay image painted onto a
// canvas, erased along the pointer path with `destination-out` stamps of a
// custom brush image.
const CARD_W = 480;
const CARD_H = 300;
const BRUSH_SIZE = 70;

const FOIL_SRC = "/images/scratch/foil-dots.png";
const BRUSH_SRC = "/images/scratch/brush-grunge.png";
const NOISE_SRC = "/images/scratch/noise.png";

const CARD_SHADOW =
  "0px 10px 20px 0px rgba(0,0,0,0.15), 0px 20px 40px 0px rgba(0,0,0,0.2), 0px 30px 60px 0px rgba(0,0,0,0.1), 0.5px 0.5px 0px 0px rgba(255,255,255,0.1) inset, 4px 4px 15px 0px rgba(255,255,255,0.05) inset";

function CardMark() {
  return (
    <svg width="14" height="21" viewBox="0 0 14 21" className="shrink-0">
      <path
        d="M 14 0 L 14 7 L 7 7 L 0 0 Z M 0 7 L 7 7 L 14 14 L 7 14 L 7 21 L 0 14 Z"
        fill="rgb(232, 232, 232)"
      />
    </svg>
  );
}

// "GENERATED" stamps the moment the card was rendered (client-side only, so
// the server markup never disagrees with the visitor's clock/locale).
function useGeneratedNow() {
  const [now, setNow] = useState<{ date: string; time: string } | null>(null);
  useEffect(() => {
    const d = new Date();
    setNow({
      date: d.toLocaleDateString("en-US"),
      time: d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
    });
  }, []);
  return now;
}

interface ScratchCardProps {
  forLabel?: string;
  revealText?: string;
  plan?: string;
  period?: string;
}

export default function ScratchCard({
  forLabel = "For You",
  revealText = "$299",
  plan = "PRO",
  period = "8760H",
}: ScratchCardProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const foilRef = useRef<HTMLImageElement | null>(null);
  const brushRef = useRef<HTMLImageElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  // The card is a fixed 480x300 design (like the Framer original) scaled
  // uniformly to whatever width it's given, so every proportion survives on
  // small screens instead of reflowing.
  const [scale, setScale] = useState(1);
  const now = useGeneratedNow();

  // Layout effect so the very first paint is already scaled — otherwise a
  // phone flashes the full 480px card for a frame before shrinking.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const fit = () => setScale(frame.clientWidth / CARD_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  // Paint the dotted foil over the scratch surface (cover-fit, dpr-sharp).
  const paintFoil = useCallback(() => {
    const surface = surfaceRef.current;
    const canvas = canvasRef.current;
    const img = foilRef.current;
    if (!surface || !canvas || !img) return;
    const w = surface.clientWidth;
    const h = surface.clientHeight;
    if (w <= 0 || h <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = "source-over";
    const cover = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const sw = img.naturalWidth * cover;
    const sh = img.naturalHeight * cover;
    ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    load(FOIL_SRC).then(
      (img) => {
        if (cancelled) return;
        foilRef.current = img;
        paintFoil();
      },
      () => undefined
    );
    load(BRUSH_SRC).then(
      (img) => {
        if (cancelled) return;
        brushRef.current = img;
      },
      () => undefined
    );
    return () => {
      cancelled = true;
    };
  }, [paintFoil]);

  // Pointer position in the surface's own (unscaled) coordinate space —
  // getBoundingClientRect is shrunk by the card's scale transform, the
  // canvas backing store is not.
  const getPoint = (e: PointerEvent) => {
    const surface = surfaceRef.current;
    if (!surface) return null;
    const rect = surface.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    return {
      x: ((e.clientX - rect.left) / rect.width) * surface.clientWidth,
      y: ((e.clientY - rect.top) / rect.height) * surface.clientHeight,
    };
  };

  const stamp = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const half = BRUSH_SIZE / 2;
    ctx.globalCompositeOperation = "destination-out";
    const brush = brushRef.current;
    if (brush && brush.naturalWidth > 0) {
      ctx.drawImage(brush, x - half, y - half, BRUSH_SIZE, BRUSH_SIZE);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, half, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // stopPropagation keeps the surrounding swipe deck from reading a scratch
  // as a swipe-to-next-card drag.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const ctx = canvasRef.current?.getContext("2d");
    const pt = getPoint(e);
    if (!ctx || !pt) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic/stale pointers can't be captured — scratching still works,
      // the stroke just ends at the surface's edge.
    }
    drawingRef.current = true;
    lastRef.current = pt;
    stamp(ctx, pt.x, pt.y);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current) return;
    e.stopPropagation();
    const ctx = canvasRef.current?.getContext("2d");
    const pt = getPoint(e);
    if (!ctx || !pt) return;
    // Interpolate stamps between events so fast swipes leave a continuous
    // scratch instead of a dotted line (same 0.4-radius step as the original).
    const last = lastRef.current;
    if (last) {
      const dist = Math.hypot(pt.x - last.x, pt.y - last.y);
      const steps = Math.max(1, Math.ceil(dist / (BRUSH_SIZE * 0.2)));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        stamp(ctx, last.x + (pt.x - last.x) * t, last.y + (pt.y - last.y) * t);
      }
    } else {
      stamp(ctx, pt.x, pt.y);
    }
    lastRef.current = pt;
  };

  const endStroke = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    drawingRef.current = false;
    lastRef.current = null;
  };

  const bigText =
    "font-open-runde whitespace-nowrap text-[86px] font-semibold leading-[1.2] tracking-[-0.01em]";

  return (
    <div ref={frameRef} className="relative w-full" style={{ aspectRatio: `${CARD_W} / ${CARD_H}` }}>
      <div
        className="absolute top-0 left-0 flex flex-col items-center gap-3.5 overflow-clip rounded-[20px] bg-[#131313] py-5"
        style={{
          width: CARD_W,
          height: CARD_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          boxShadow: CARD_SHADOW,
        }}
      >
        <div className="flex w-full items-center justify-between px-5">
          <CardMark />
          <p className="font-open-runde text-[15px] font-medium leading-[18px] text-[#9ba1a5] opacity-80">
            {forLabel}
          </p>
        </div>

        {/* The prize under the foil: a dark embossed copy with a 66% light
            copy stacked on it, both centered on the card (not the foil). */}
        <div className="absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2">
          <p className={`${bigText} text-[#212121]`}>{revealText}</p>
        </div>
        <div className="absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 opacity-[0.66]">
          <p className={`${bigText} text-[#e8e8e8]`}>{revealText}</p>
        </div>

        <div className="relative z-[2] min-h-0 w-full flex-1 px-5">
          <div
            ref={surfaceRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onPointerLeave={endStroke}
            className="relative h-full w-full overflow-hidden rounded-[10px]"
            style={{ touchAction: "none" }}
          >
            <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 block h-full w-full" />
          </div>

          {/* Data labels ride above the foil — they never scratch off. */}
          <div className="pointer-events-none absolute inset-y-0 right-5 left-5 z-[2] flex items-end gap-2.5 p-2 font-geist-mono text-xs font-medium leading-[1.3] tracking-[0.03em] text-[#e8e8e8] tabular-nums">
            <div className="flex-1">
              <p>PLAN / {plan}</p>
              <p>PERIOD / {period}</p>
            </div>
            <div className="flex-1 text-right">
              <p>GENERATED</p>
              <div className="flex items-center justify-end gap-2.5">
                <p>{now?.date ?? ""}</p>
                <p>{now?.time ?? ""}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Film-grain wash over the whole card. */}
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[20px] opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url(${NOISE_SRC})`, backgroundRepeat: "repeat", backgroundSize: "109px auto" }}
        />
      </div>
    </div>
  );
}
