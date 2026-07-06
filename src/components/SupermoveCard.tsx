import Image from "next/image";

export default function SupermoveCard() {
  return (
    <div className="relative h-[260px] w-full max-w-[340px] overflow-hidden rounded-2xl border-[0.5px] border-[#777] bg-black">
      <div className="pointer-events-none absolute top-0 right-0 h-full w-[90px] opacity-90">
        <Image src="/images/vector-24.svg" alt="" fill className="object-contain" />
      </div>
      <div className="pointer-events-none absolute top-1 left-4 h-[170px] w-[150px] opacity-90">
        <Image src="/images/vector-23.svg" alt="" fill className="object-contain" />
      </div>
      <div className="pointer-events-none absolute bottom-14 left-7 h-[68px] w-[220px] opacity-90">
        <Image src="/images/vector-25.svg" alt="" fill className="object-contain" />
      </div>
      <div className="pointer-events-none absolute bottom-3 left-1/2 h-[110px] w-[180px] -translate-x-1/2">
        <Image src="/images/frame-2095586604.png" alt="" fill className="object-contain" />
      </div>

      <p className="absolute top-4 left-4 font-pixel-triangle text-sm text-white sm:text-base">
        Supermove
      </p>
      <p className="absolute top-9 left-4 w-[85%] text-[8px] text-[#505050] sm:text-[10px]">
        Supermove is a vertical B2B SaaS platform that helps moving companies
        manage and automate their end-to-end operations.
      </p>

      <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
        <span className="rounded-full bg-[#878787] px-2 py-0.5 text-[10px] text-[#414141]">
          Case Study
        </span>
        <span className="rounded-full bg-[#878787] px-2 py-0.5 text-[10px] text-[#414141]">
          Video
        </span>
      </div>
    </div>
  );
}
