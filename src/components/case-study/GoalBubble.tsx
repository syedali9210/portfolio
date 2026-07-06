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
    <div className="relative min-h-[240px] w-full max-w-[240px]">
      <Image src={src} alt="" fill className="pointer-events-none" />
      <div className="relative z-10 flex h-full flex-col items-center px-6 pt-3 text-center">
        <p className="font-pixel-square text-base text-black">{title}</p>
        <p className="font-pixel-square mt-20 text-[11px] leading-tight text-black">{description}</p>
      </div>
    </div>
  );
}
