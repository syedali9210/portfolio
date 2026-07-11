"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

export interface RippleGridHandle {
  triggerAt: (clientX: number, clientY: number) => void;
}

type RippleShape = "circle" | "star" | "radialLines" | "diamond" | "cross" | "wave" | "lightning";

interface RippleGridProps {
  radius?: number;
  elementSize?: number;
  gap?: number;
  fill?: string;
  colors?: string[];
  shape?: RippleShape;
  scale?: number;
  className?: string;
  // Optional bitmap (row-major), nearest-neighbor scaled to however many
  // actual grid cells the container resolves to, so it holds its shape at
  // any size. Without `patternFill`, only `true` cells are drawn (in
  // `fill`) and everything else stays transparent. With `patternFill` set,
  // every cell is drawn in the base `fill` and `true` cells are drawn in
  // `patternFill` instead — the pattern reads as a highlight over an
  // otherwise-normal grid rather than the only thing visible. A ripple
  // still lights up every cell regardless, pattern or not.
  pattern?: boolean[][];
  patternFill?: string;
}

interface GridElement {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
}

const extractRGB = (value: string) => {
  const match = value.match(/(rgba|rgb)\(.*?\)/g);
  return match ? match[0] : value;
};

// A grid of small rounded squares that ripples outward — in color and
// scale — from wherever `triggerAt` is called. Ported from a Framer
// component that did the same with canvas + rAF; this version swaps its
// React-state ripple bookkeeping for a plain ref, since the draw loop
// already repaints every frame regardless.
const RippleGrid = forwardRef<RippleGridHandle, RippleGridProps>(function RippleGrid(
  { radius = 3, elementSize = 6, gap = 4, fill, colors = ["#ffffff", "#da7756"], shape = "circle", scale = 2, className = "", pattern, patternFill },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rippleElementsRef = useRef<Map<string, { colorIndex: number; scale: number }>>(new Map());
  const isPlayingRef = useRef(false);
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

  const { columns, rows, elements } = useMemo(() => {
    const { width, height } = dimensions;
    const columns = Math.max(1, Math.floor((width + gap) / (elementSize + gap)));
    const rows = Math.max(1, Math.floor((height + gap) / (elementSize + gap)));
    const totalW = columns * elementSize + (columns - 1) * gap;
    const totalH = rows * elementSize + (rows - 1) * gap;
    const offsetX = (width - totalW) / 2;
    const offsetY = (height - totalH) / 2;
    const els: GridElement[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        els.push({ id: `${row}-${col}`, row, col, x: offsetX + col * (elementSize + gap), y: offsetY + row * (elementSize + gap) });
      }
    }
    return { columns, rows, elements: els };
  }, [dimensions, elementSize, gap]);

  const patternRows = pattern?.length ?? 0;
  const patternCols = pattern?.[0]?.length ?? 0;

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((el) => {
      const ripple = rippleElementsRef.current.get(el.id);
      const currentScale = ripple ? ripple.scale : 1;
      const size = elementSize * currentScale;
      const x = el.x + (elementSize - size) / 2;
      const y = el.y + (elementSize - size) / 2;

      let fillStyle: string | undefined;
      if (ripple) {
        fillStyle = colors[ripple.colorIndex] ?? colors[0];
      } else {
        const isPatternCell =
          patternRows > 0 &&
          pattern![Math.min(patternRows - 1, Math.floor((el.row / rows) * patternRows))][
            Math.min(patternCols - 1, Math.floor((el.col / columns) * patternCols))
          ];
        if (isPatternCell && patternFill) {
          fillStyle = patternFill;
        } else if (patternRows > 0 && !patternFill) {
          // No patternFill: the bitmap is the only thing drawn (icon-style).
          fillStyle = isPatternCell ? fill : undefined;
        } else {
          fillStyle = fill;
        }
      }
      if (!fillStyle) return;

      ctx.fillStyle = extractRGB(fillStyle);
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, radius);
      ctx.fill();
    });
  }, [elements, elementSize, radius, fill, patternFill, colors, dimensions, pattern, patternRows, patternCols, rows, columns]);

  // Redraws continuously only while a ripple is actually animating —
  // idle grids (which is most of the time, on every page view) render
  // once per relevant change instead of burning a rAF callback forever.
  const frameRef = useRef<number | null>(null);

  const startRenderLoop = useCallback(() => {
    if (frameRef.current !== null) return;
    const loop = () => {
      renderCanvas();
      if (rippleElementsRef.current.size > 0) {
        frameRef.current = requestAnimationFrame(loop);
      } else {
        frameRef.current = null;
      }
    };
    frameRef.current = requestAnimationFrame(loop);
  }, [renderCanvas]);

  useEffect(() => {
    if (frameRef.current === null) renderCanvas();
  }, [renderCanvas]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  const calculateDelay = useCallback(
    (el: GridElement, origin: GridElement) => {
      const dx = el.col - origin.col;
      const dy = el.row - origin.row;
      let distance: number;
      switch (shape) {
        case "star": {
          const angle = Math.atan2(dy, dx);
          const normalized = ((angle + Math.PI) / (2 * Math.PI)) * 10;
          const rayIndex = Math.floor(normalized);
          const rayOffset = normalized - rayIndex;
          const isMainRay = rayIndex % 2 === 0;
          const isSubRay = Math.abs(rayOffset - 0.5) < 0.2;
          const base = Math.sqrt(dx * dx + dy * dy);
          distance = (isMainRay ? base * 0.8 : isSubRay ? base * 2.5 : base * 4) * (0.8 + Math.random() * 0.4);
          break;
        }
        case "radialLines": {
          const rd = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          const normalized = ((angle + Math.PI) / (2 * Math.PI)) * 8;
          const lineIndex = Math.round(normalized) % 8;
          const onLine = Math.abs(normalized - lineIndex) < 0.3;
          distance = onLine ? rd : rd * 3;
          break;
        }
        case "diamond":
          distance = Math.abs(dx) + Math.abs(dy);
          break;
        case "cross":
          distance = dx === 0 || dy === 0 ? Math.max(Math.abs(dx), Math.abs(dy)) : Math.max(Math.abs(dx), Math.abs(dy)) * 3;
          break;
        case "wave": {
          const wd = Math.sqrt(dx * dx + dy * dy);
          distance = wd * (Math.sin((dx + dy) * 0.5) * 0.5 + 1);
          break;
        }
        case "lightning": {
          const ld = Math.sqrt(dx * dx + dy * dy);
          distance = ld * (Math.sin(ld * 2) * 0.5 + 1);
          break;
        }
        case "circle":
        default:
          distance = Math.sqrt(dx * dx + dy * dy);
      }
      const maxDistance = Math.max(columns, rows);
      return (distance / maxDistance) * 800;
    },
    [shape, columns, rows]
  );

  const animateElement = useCallback(
    (id: string, colorIndex: number, delay: number) => {
      const startTime = Date.now() + delay;
      const duration = 480;
      const step = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < 0) {
          requestAnimationFrame(step);
          return;
        }
        if (elapsed >= duration) {
          rippleElementsRef.current.delete(id);
          return;
        }
        const progress = elapsed / duration;
        const currentScale =
          progress < 0.5 ? 1 + (scale - 1) * (progress * 2) : scale - (scale - 1) * ((progress - 0.5) * 2);
        rippleElementsRef.current.set(id, { colorIndex, scale: currentScale });
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    [scale]
  );

  const triggerAt = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container || isPlayingRef.current || elements.length === 0) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      let closest = elements[0];
      let minDist = Infinity;
      for (const el of elements) {
        const cx = el.x + elementSize / 2;
        const cy = el.y + elementSize / 2;
        const d = Math.hypot(x - cx, y - cy);
        if (d < minDist) {
          minDist = d;
          closest = el;
        }
      }

      isPlayingRef.current = true;
      let maxDelay = 0;
      elements.forEach((el) => {
        const delay = calculateDelay(el, closest);
        maxDelay = Math.max(maxDelay, delay);
        const dx = el.col - closest.col;
        const dy = el.row - closest.row;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const colorIndex =
          distance === 0
            ? 0
            : Math.round(Math.min(distance / (Math.max(columns, rows) * 0.5), 1) * (colors.length - 1));
        animateElement(el.id, colorIndex, delay);
      });
      startRenderLoop();
      setTimeout(() => {
        isPlayingRef.current = false;
      }, maxDelay + 480);
    },
    [elements, elementSize, columns, rows, colors, calculateDelay, animateElement, startRenderLoop]
  );

  useImperativeHandle(ref, () => ({ triggerAt }), [triggerAt]);

  return (
    <div ref={containerRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
});

export default RippleGrid;
