"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

// A draggable, glowing wireframe-cube visualization — ported from the
// standalone Basenine "cube" prototype (three concentric unfolding-cube
// shells + a dashed outer shell + ten data packets orbiting the outer
// cube's edges). The original ran its own document-level drag listeners
// and an infinite rAF loop, which doesn't play nice with React lifecycles;
// here everything is scoped to this component's own root and torn down on
// unmount. The unfold machinery from the source is dropped — the demo
// never actually drove it past its resting (folded) pose, so faithfully
// reproducing what's on screen only needs the folded geometry.
const SVG_NS = "http://www.w3.org/2000/svg";
const CX = 203;
const CY = 203;
const SQRT3_2 = Math.sqrt(3) / 2;
const BASE_SCALE = 80;
const NUM_PACKETS = 10;

type Vec3 = { x: number; y: number; z: number };
type Pt2 = { x: number; y: number };

interface Vertex {
  localPt: Vec3;
  worldPt: Vec3;
  projectedPt: Pt2;
}

interface Shell {
  showMedians: boolean;
  faces: { vertices: Vertex[]; wireGroup: SVGGElement; wirePath: SVGPathElement }[];
}

const FACE_COORDS: ((u: number, v: number) => [number, number, number])[] = [
  (u, v) => [u, -1, v], // bottom
  (u, v) => [u, v, 1], // front
  (u, v) => [u, v, -1], // back
  (u, v) => [-1, u, v], // left
  (u, v) => [1, u, v], // right
  (u, v) => [u, 1, v], // top
];

function rotate3D(p: Vec3, rx: number, ry: number): Vec3 {
  const sX = Math.sin(rx);
  const cX = Math.cos(rx);
  const y1 = p.y * cX - p.z * sX;
  const z1 = p.y * sX + p.z * cX;
  const sY = Math.sin(ry);
  const cY = Math.cos(ry);
  const x2 = p.x * cY + z1 * sY;
  const z2 = -p.x * sY + z1 * cY;
  return { x: x2, y: y1, z: z2 };
}

function distance3D(a: Vec3, b: Vec3) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function easeInOutSine(x: number) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

function easeInOutQuart(x: number) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function project(p: Vec3, currentScale: number): Pt2 {
  return {
    x: CX + (p.x - p.z) * SQRT3_2 * currentScale,
    y: CY + (p.x + p.z) * 0.5 * currentScale - p.y * currentScale,
  };
}

function buildShell(
  group: SVGGElement,
  scale: number,
  stroke: string,
  strokeWidth: string,
  dashArray: string | null,
  fill: string,
  filterId: string | null,
  groupOpacity: string,
  showMedians: boolean
): Shell {
  const faces = FACE_COORDS.map((coords) => {
    const wireGroup = document.createElementNS(SVG_NS, "g");
    wireGroup.setAttribute("opacity", groupOpacity);
    const wirePath = document.createElementNS(SVG_NS, "path");
    wirePath.setAttribute("fill", fill);
    wirePath.setAttribute("stroke", stroke);
    wirePath.setAttribute("stroke-width", strokeWidth);
    if (dashArray) wirePath.setAttribute("stroke-dasharray", dashArray);
    if (filterId) wirePath.setAttribute("filter", filterId);
    wireGroup.appendChild(wirePath);
    group.appendChild(wireGroup);

    const vertices: Vertex[] = [];
    for (let v = -1; v <= 1; v++) {
      for (let u = -1; u <= 1; u++) {
        const [x, y, z] = coords(u, v);
        const localPt = { x: x * scale, y: y * scale, z: z * scale };
        vertices.push({ localPt, worldPt: { ...localPt }, projectedPt: { x: 0, y: 0 } });
      }
    }
    return { vertices, wireGroup, wirePath };
  });
  return { showMedians, faces };
}

function updateShell(
  shell: Shell,
  rotX: number,
  rotY: number,
  currentScale: number,
  renderables: { el: SVGElement; depth: number }[]
) {
  for (const f of shell.faces) {
    let cx = 0;
    let cy = 0;
    let cz = 0;
    for (const vtx of f.vertices) {
      const p = rotate3D(vtx.localPt, rotX, rotY);
      vtx.worldPt = p;
      vtx.projectedPt = project(p, currentScale);
      cx += p.x;
      cy += p.y;
      cz += p.z;
    }
    const depth = (cx + cy + cz) / 9;

    const corners = [0, 2, 8, 6];
    let d = "";
    corners.forEach((ci, i) => {
      const pt = f.vertices[ci].projectedPt;
      d += i === 0 ? `M${pt.x},${pt.y} ` : `L${pt.x},${pt.y} `;
    });
    d += "Z ";
    if (shell.showMedians) {
      for (let u = -1; u <= 1; u++) {
        const v0 = f.vertices[0 * 3 + (u + 1)].projectedPt;
        const v1 = f.vertices[2 * 3 + (u + 1)].projectedPt;
        d += `M${v0.x},${v0.y} L${v1.x},${v1.y} `;
      }
      for (let v = -1; v <= 1; v++) {
        const v0 = f.vertices[(v + 1) * 3 + 0].projectedPt;
        const v1 = f.vertices[(v + 1) * 3 + 2].projectedPt;
        d += `M${v0.x},${v0.y} L${v1.x},${v1.y} `;
      }
    }
    f.wirePath.setAttribute("d", d);
    renderables.push({ el: f.wireGroup, depth });
  }
}

function getNextVertex(v: Vertex, prev: Vertex | null, allVertices: Vertex[]): Vertex {
  const neighbors = allVertices.filter((u) => {
    const d = distance3D(v.worldPt, u.worldPt);
    return d > 0.95 && d < 1.05;
  });
  if (neighbors.length === 0) return v;
  const forward = neighbors.filter((u) => u !== prev);
  const pool = forward.length > 0 ? forward : neighbors;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function CubeReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 406 406");
    svg.style.overflow = "visible";
    svg.style.width = "100%";
    svg.style.height = "100%";

    const defs = document.createElementNS(SVG_NS, "defs");

    const glow = document.createElementNS(SVG_NS, "filter");
    glow.setAttribute("id", "cube-glow");
    glow.setAttribute("x", "-50%");
    glow.setAttribute("y", "-50%");
    glow.setAttribute("width", "200%");
    glow.setAttribute("height", "200%");
    const blur = document.createElementNS(SVG_NS, "feGaussianBlur");
    blur.setAttribute("stdDeviation", "3.275");
    blur.setAttribute("result", "coloredBlur");
    const merge = document.createElementNS(SVG_NS, "feMerge");
    const mergeNode1 = document.createElementNS(SVG_NS, "feMergeNode");
    mergeNode1.setAttribute("in", "coloredBlur");
    const mergeNode2 = document.createElementNS(SVG_NS, "feMergeNode");
    mergeNode2.setAttribute("in", "SourceGraphic");
    merge.appendChild(mergeNode1);
    merge.appendChild(mergeNode2);
    glow.appendChild(blur);
    glow.appendChild(merge);
    defs.appendChild(glow);

    const innerShadow = document.createElementNS(SVG_NS, "filter");
    innerShadow.setAttribute("id", "cube-inner-shadow");
    innerShadow.setAttribute("x", "-20%");
    innerShadow.setAttribute("y", "-20%");
    innerShadow.setAttribute("width", "140%");
    innerShadow.setAttribute("height", "140%");
    const offset = document.createElementNS(SVG_NS, "feOffset");
    offset.setAttribute("dx", "-1");
    offset.setAttribute("dy", "5");
    offset.setAttribute("in", "SourceAlpha");
    const shadowBlur = document.createElementNS(SVG_NS, "feGaussianBlur");
    shadowBlur.setAttribute("stdDeviation", "34.4");
    shadowBlur.setAttribute("result", "offset-blur");
    const compositeOut = document.createElementNS(SVG_NS, "feComposite");
    compositeOut.setAttribute("operator", "out");
    compositeOut.setAttribute("in", "SourceAlpha");
    compositeOut.setAttribute("in2", "offset-blur");
    compositeOut.setAttribute("result", "inverse");
    const flood = document.createElementNS(SVG_NS, "feFlood");
    flood.setAttribute("flood-color", "#006316");
    flood.setAttribute("flood-opacity", "0.56");
    flood.setAttribute("result", "color");
    const compositeIn = document.createElementNS(SVG_NS, "feComposite");
    compositeIn.setAttribute("operator", "in");
    compositeIn.setAttribute("in", "color");
    compositeIn.setAttribute("in2", "inverse");
    compositeIn.setAttribute("result", "shadow");
    const compositeOver = document.createElementNS(SVG_NS, "feComposite");
    compositeOver.setAttribute("operator", "over");
    compositeOver.setAttribute("in", "shadow");
    compositeOver.setAttribute("in2", "SourceGraphic");
    innerShadow.appendChild(offset);
    innerShadow.appendChild(shadowBlur);
    innerShadow.appendChild(compositeOut);
    innerShadow.appendChild(flood);
    innerShadow.appendChild(compositeIn);
    innerShadow.appendChild(compositeOver);
    defs.appendChild(innerShadow);

    svg.appendChild(defs);
    const sortedLayer = document.createElementNS(SVG_NS, "g");
    const topLayer = document.createElementNS(SVG_NS, "g");
    svg.appendChild(sortedLayer);
    svg.appendChild(topLayer);
    container.appendChild(svg);

    const glowFill = "rgba(0, 99, 22, 0.015)";
    const outer = buildShell(sortedLayer, 1.0, "#777777", "0.75", "4 4", "transparent", null, "0.8", true);
    const mid = buildShell(sortedLayer, 0.8, "rgba(0, 99, 22, 1.0)", "1.0", null, glowFill, "url(#cube-inner-shadow)", "0.5", true);
    const inner = buildShell(sortedLayer, 0.49, "rgba(0, 99, 22, 1.0)", "1.0", null, glowFill, "url(#cube-inner-shadow)", "0.3", false);
    const core = buildShell(sortedLayer, 0.28, "rgba(0, 99, 22, 1.0)", "1.0", null, glowFill, "url(#cube-inner-shadow)", "0.1", false);
    const shells = [outer, mid, inner, core];
    const allVertices = outer.faces.flatMap((f) => f.vertices);

    const centerGlow = document.createElementNS(SVG_NS, "circle");
    centerGlow.setAttribute("cx", String(CX));
    centerGlow.setAttribute("cy", String(CY));
    centerGlow.setAttribute("fill", "#006316");
    centerGlow.setAttribute("filter", "url(#cube-glow)");

    const packets = Array.from({ length: NUM_PACKETS }, () => {
      const dot = document.createElementNS(SVG_NS, "circle");
      dot.setAttribute("r", "1.5");
      dot.setAttribute("fill", "rgba(20, 35, 20, 0.8)");
      dot.setAttribute("filter", "url(#cube-glow)");
      topLayer.appendChild(dot);
      const trail = document.createElementNS(SVG_NS, "circle");
      trail.setAttribute("r", "1");
      trail.setAttribute("fill", "#1a231a");
      trail.style.opacity = "0.7";
      topLayer.appendChild(trail);
      const start = allVertices[Math.floor(Math.random() * allVertices.length)];
      return {
        el: dot,
        trail,
        progress: Math.random(),
        speed: 0.0015 + Math.random() * 0.0015,
        currentVertex: start,
        targetVertex: getNextVertex(start, null, allVertices),
      };
    });

    // Drag-to-rotate, scoped to this component's own root instead of the
    // document (the original demo's page-wide listeners would otherwise
    // hijack every mouse gesture on the site).
    let tX = 0;
    let tY = 0;
    let cPX = 0;
    let cPY = 0;
    let vX = 0;
    let vY = 0;
    let globalRotX = 0;
    let globalRotY = 0;
    const startTime = performance.now();
    let raf = 0;

    const onPointerMoveWindow = (e: globalThis.PointerEvent) => {
      if (!dragRef.current.dragging) return;
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      vY = dx * 0.4;
      vX = -dy * 0.4;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    };
    const onPointerUpWindow = () => {
      dragRef.current.dragging = false;
    };
    window.addEventListener("pointermove", onPointerMoveWindow);
    window.addEventListener("pointerup", onPointerUpWindow);

    function renderLoop(now: number) {
      const time = (now - startTime) * 0.001;

      if (!dragRef.current.dragging) {
        vX *= 0.94;
        vY *= 0.94;
      }
      tX += vX;
      tY += vY;

      const entryEase = easeInOutQuart(Math.min(1, time / 4));
      const currentScale = BASE_SCALE * (0.01 + 0.99 * entryEase);
      const extraSpin = (1 - entryEase) * 180;

      const autoTiltX = Math.sin(time * 0.5) * 4;
      const autoTiltY = Math.cos(time * 0.3) * 4;
      cPX += (tX + autoTiltX - cPX) * 0.08;
      cPY += (tY + autoTiltY - cPY) * 0.08;
      globalRotX = cPX * (Math.PI / 180);
      globalRotY = (cPY + extraSpin) * (Math.PI / 180);

      const pulse = 11 + Math.sin(time * 2) * 2;
      centerGlow.setAttribute("r", String(pulse));

      const renderables: { el: SVGElement; depth: number }[] = [{ el: centerGlow, depth: 0 }];
      for (const shell of shells) updateShell(shell, globalRotX, globalRotY, currentScale, renderables);
      renderables.sort((a, b) => a.depth - b.depth);
      for (const r of renderables) sortedLayer.appendChild(r.el);

      for (const p of packets) {
        p.progress += p.speed;
        const dist = distance3D(p.currentVertex.worldPt, p.targetVertex.worldPt);
        if (dist > 1.5) {
          p.targetVertex = getNextVertex(p.currentVertex, null, allVertices);
          p.progress = 0;
        }
        if (p.progress >= 1) {
          p.progress = 0;
          const prev = p.currentVertex;
          p.currentVertex = p.targetVertex;
          p.targetVertex = getNextVertex(p.currentVertex, prev, allVertices);
        }
        const ease = easeInOutSine(p.progress);
        const cw = p.currentVertex.worldPt;
        const tw = p.targetVertex.worldPt;
        const prevCx = p.el.getAttribute("cx");
        const prevCy = p.el.getAttribute("cy");
        const x3d = cw.x + (tw.x - cw.x) * ease;
        const y3d = cw.y + (tw.y - cw.y) * ease;
        const z3d = cw.z + (tw.z - cw.z) * ease;
        const proj = project({ x: x3d, y: y3d, z: z3d }, currentScale);
        p.el.setAttribute("cx", String(proj.x));
        p.el.setAttribute("cy", String(proj.y));
        if (prevCx !== null && prevCy !== null) {
          p.trail.setAttribute("cx", prevCx);
          p.trail.setAttribute("cy", prevCy);
        }
      }

      raf = requestAnimationFrame(renderLoop);
    }
    raf = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMoveWindow);
      window.removeEventListener("pointerup", onPointerUpWindow);
      container.removeChild(svg);
    };
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current.dragging = true;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
  };

  return (
    <div
      ref={rootRef}
      onPointerDown={onPointerDown}
      className="flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing"
      style={{ touchAction: "none" }}
    />
  );
}
