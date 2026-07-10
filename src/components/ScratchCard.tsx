"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion } from "motion/react";

// Coverage is tracked on a coarse grid rather than by reading canvas pixels
// every frame — cheap to update, plenty accurate for "have they scratched
// most of it off yet."
const GRID = 16;
const REVEAL_THRESHOLD = 0.45;
const BRUSH_RADIUS = 26;

// A scratch-off card: a foil-like layer sits over the children until the
// user drags across it enough (mouse or touch), at which point it fades
// away and reveals what's underneath for good. The classic scratch-card
// technique — draw with `globalCompositeOperation: "destination-out"` to
// erase the foil layer along the pointer's path.
export default function ScratchCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clearedRef = useRef<boolean[]>(new Array(GRID * GRID).fill(false));
  const isScratchingRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setDimensions({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.globalCompositeOperation = "source-over";

    const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
    gradient.addColorStop(0, "#3a3a3a");
    gradient.addColorStop(1, "#141414");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 6;
    for (let x = -dimensions.height; x < dimensions.width; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + dimensions.height, dimensions.height);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to reveal", dimensions.width / 2, dimensions.height / 2);
  }, [dimensions]);

  useEffect(() => {
    clearedRef.current = new Array(GRID * GRID).fill(false);
    setRevealed(false);
    paintFoil();
  }, [paintFoil]);

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      const gx = Math.floor((x / dimensions.width) * GRID);
      const gy = Math.floor((y / dimensions.height) * GRID);
      const reach = Math.max(1, Math.ceil((BRUSH_RADIUS / Math.min(dimensions.width, dimensions.height)) * GRID));
      for (let dx = -reach; dx <= reach; dx++) {
        for (let dy = -reach; dy <= reach; dy++) {
          const cx = gx + dx;
          const cy = gy + dy;
          if (cx < 0 || cy < 0 || cx >= GRID || cy >= GRID) continue;
          clearedRef.current[cy * GRID + cx] = true;
        }
      }

      const clearedCount = clearedRef.current.reduce((n, c) => n + (c ? 1 : 0), 0);
      if (clearedCount / (GRID * GRID) >= REVEAL_THRESHOLD) setRevealed(true);
    },
    [dimensions]
  );

  // Scratching stops the gesture here (stopPropagation) so a swipeable
  // stack around this card doesn't mistake it for a swipe-to-next drag.
  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    isScratchingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current) return;
    e.stopPropagation();
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    isScratchingRef.current = false;
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        animate={{ opacity: revealed ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ touchAction: "none" }}
        className={`absolute inset-0 block h-full w-full cursor-pointer ${revealed ? "pointer-events-none" : ""}`}
      />
    </div>
  );
}
