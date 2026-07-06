import Image from "next/image";

export default function GoalBubble({
  src,
  title,
  description,
}: {
  src: string;
  title: string;
  description: string;
}) {
  return (
    // Sized to the artwork's own proportions (viewBox ~235x196) instead of
    // a guessed min-height — otherwise <Image fill> stretches it unevenly
    // (it has no intrinsic object-fit) and the bubble shape distorts.
    <div className="relative aspect-[235/196] w-full max-w-[240px]">
      <Image src={src} alt="" fill className="pointer-events-none" />
      <div className="relative z-10 flex h-full flex-col items-center px-6 pt-3 text-center">
        <p className="font-pixel-square text-base text-black">{title}</p>
        <p className="font-pixel-square mt-16 text-[11px] leading-tight text-black">{description}</p>
      </div>
    </div>
  );
}
