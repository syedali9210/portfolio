import Image from "next/image";

export default function StickyNote({
  src,
  title,
  points,
}: {
  src: string;
  title: string;
  points?: string[];
}) {
  return (
    <div className="relative aspect-square w-full max-w-[305px]">
      <Image src={src} alt="" fill className="pointer-events-none" />
      <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-8 py-8">
        <p className="font-pixel-square text-xl text-white">{title}</p>
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
