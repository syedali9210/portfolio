import Image from "next/image";

export default function SpeechBubble({
  src,
  title,
  quotes,
}: {
  src: string;
  title: string;
  quotes: string[];
}) {
  return (
    <div className="relative min-h-[280px] w-full max-w-[240px]">
      <Image src={src} alt="" fill className="pointer-events-none" />
      <div className="relative z-10 flex h-full flex-col gap-2 px-5 pt-4 pb-8">
        <p className="text-center font-pixel-square text-base text-black">{title}</p>
        <ul className="list-disc space-y-1.5 pl-4 font-pixel-square text-[11px] leading-tight text-black">
          {quotes.map((quote) => (
            <li key={quote}>{quote}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
