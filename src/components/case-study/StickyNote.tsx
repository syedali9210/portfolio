import Image from "next/image";

export default function StickyNote({
  src,
  title,
  points,
  // Airtribe's note artwork is square-ish; Kodex/Uniqkey's is a short
  // banner — sets the padding/text size for each, but no longer forces a
  // fixed aspect ratio (see below).
  banner = false,
}: {
  src: string;
  title: string;
  points?: string[];
  banner?: boolean;
}) {
  return (
    // The background art is authored to stretch (its SVGs are exported
    // with preserveAspectRatio="none"), so instead of forcing a fixed
    // aspect ratio or min-height — which either clipped longer point
    // lists or left dead space under short titles — the box is left to
    // size itself from its own content, and the artwork just fills
    // whatever height that content ends up needing.
    <div className="relative w-full max-w-[305px]">
      <Image src={src} alt="" fill className="pointer-events-none" />
      <div
        className={`relative z-10 flex flex-col justify-center gap-3 ${
          banner ? "px-6 py-4" : "px-8 py-8"
        }`}
      >
        <p className={`font-pixel-square text-white ${banner ? "text-base" : "text-xl"}`}>{title}</p>
        {points && (
          <ul className="list-disc space-y-1 pl-5 font-pixel-square text-sm text-white">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
