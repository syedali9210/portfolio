type Side = "top" | "bottom";

// A smooth blur ramp — sharp/clear at one end, heavily blurred at the
// other — built the standard way CSS has to fake it: `backdrop-filter`
// has no gradient of its own, so this stacks several full-height layers,
// each blurred a little more than the last and masked to fade in only
// over its own band. Where the bands overlap near the strong edge, the
// blurs compound into a gradient instead of a hard step.
export default function ProgressiveBlur({
  side,
  height = 140,
  maxBlur = 18,
  layers = 6,
  position = "fixed",
  className = "",
}: {
  side: Side;
  height?: number | string;
  maxBlur?: number;
  layers?: number;
  // "fixed" anchors to the viewport (nav chrome); "absolute" anchors to
  // the nearest positioned ancestor and scrolls with the page (in-content
  // effects, like softening a hero glow's edge).
  position?: "fixed" | "absolute";
  className?: string;
}) {
  // "to bottom" ramps 0%→100% top-to-bottom, so a top-anchored strip (clear
  // at its own top edge, blurred toward the nav) wants the opposite ramp.
  const gradientDirection = side === "top" ? "to top" : "to bottom";

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${position} inset-x-0 ${side === "top" ? "top-0" : "bottom-0"} ${className}`}
      style={{ height }}
    >
      {Array.from({ length: layers }).map((_, i) => {
        const blur = maxBlur * Math.pow((i + 1) / layers, 1.6);
        const start = (i / layers) * 100;
        const end = ((i + 1) / layers) * 100;
        const mask = `linear-gradient(${gradientDirection}, transparent ${start}%, black ${end}%, black 100%)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur.toFixed(1)}px)`,
              WebkitBackdropFilter: `blur(${blur.toFixed(1)}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
