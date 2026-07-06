import Image from "next/image";

export default function StickyNote({
  src,
  title,
  points,
  // Airtribe's note artwork is square (viewBox 305x305); Kodex/Uniqkey's
  // is a short banner (viewBox ~305x140) — forcing both into aspect-square
  // stretched the banner variant tall since <Image fill> has no intrinsic
  // object-fit to fall back on.
  banner = false,
}: {
  src: string;
  title: string;
  points?: string[];
  banner?: boolean;
}) {
  return (
    <div className={`relative w-full max-w-[305px] ${banner ? "aspect-[305/145]" : "aspect-square"}`}>
      <Image src={src} alt="" fill className="pointer-events-none" />
      <div
        className={`relative z-10 flex h-full flex-col justify-center gap-3 ${
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
