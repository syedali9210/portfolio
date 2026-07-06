import Image from "next/image";
import FadeInUp from "@/components/FadeInUp";
import GlassPanel from "@/components/GlassPanel";
import GlassTile from "@/components/GlassTile";
import HeroGlow from "@/components/HeroGlow";
import HeroMobileStack from "@/components/HeroMobileStack";
import PetBuddy from "@/components/PetBuddy";
import TiltCard from "@/components/TiltCard";
import DeskBuddyCard from "@/components/DeskBuddyCard";

const LEFT_ROW_ICONS = [
  { src: "/images/image-16.png", imgClassName: "scale-150 object-contain" },
  { src: "/images/image-22.png", imgClassName: "object-cover" },
  { src: "/images/image-23.png", imgClassName: "object-cover" },
  { src: "/images/image-21.png", imgClassName: "scale-125 object-cover" },
];

const RIGHT_ROW_ICONS = [
  { src: "/images/image-17.png", imgClassName: "object-cover" },
  { src: "/images/image-24.png", imgClassName: "object-cover" },
  { src: "/images/ri-github-fill.svg", imgClassName: "object-contain p-2" },
  { src: "/images/image-27.png", imgClassName: "object-cover" },
  { src: "/images/image-28.png", imgClassName: "object-cover" },
  { src: "/images/ri-supabase-fill.svg", imgClassName: "object-contain p-2" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-6 pt-32 pb-24 md:justify-center"
    >
      {/* ambient glow: stays subtle behind headline/dock, warms up near the bottom */}
      <HeroGlow>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background:
              "radial-gradient(ellipse at bottom, rgba(140,50,0,0.4) 0%, rgba(60,20,0,0.18) 45%, transparent 75%)",
          }}
        />
      </HeroGlow>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <p className="font-pixel-square text-base leading-relaxed text-muted-600 sm:text-lg md:text-xl">
          The guy that design things and bring them to life,
          <br className="hidden sm:block" />
          {" cuz why not, engineering made me things do the "}
          <span className="font-body underline decoration-wavy decoration-[3.5%] underline-offset-2">
            unconventional
          </span>
          {" way."}
        </p>

        {/* Desktop / tablet dock composition */}
        <div className="mt-16 hidden w-full max-w-4xl items-start justify-center gap-3 md:flex">
          {/* left: icon row + tablet screenshot, each independently hoverable */}
          <div className="flex -rotate-3 -skew-x-3 flex-col gap-3">
            <FadeInUp delay={0.05}>
              <TiltCard peekCorner="top-right">
                <GlassPanel className="flex flex-row gap-2">
                  {LEFT_ROW_ICONS.map((icon) => (
                    <GlassTile key={icon.src} src={icon.src} alt="" className="h-13 w-13" imgClassName={icon.imgClassName} />
                  ))}
                </GlassPanel>
              </TiltCard>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <TiltCard peekCorner="top-left">
                <GlassPanel>
                  <GlassTile src="/images/rectangle-77.png" alt="" className="h-[150px] w-[274px]" />
                </GlassPanel>
              </TiltCard>
            </FadeInUp>
          </div>

          {/* center: bordered control panel */}
          <FadeInUp delay={0}>
            <GlassPanel className="flex flex-col gap-2.5">
              <div className="relative h-2.5 w-11.5 shrink-0">
                <Image src="/images/application-controls-active.svg" alt="" fill />
              </div>
              <div className="flex flex-row gap-2">
                <GlassTile src="/images/rectangle-76.png" alt="" className="h-40 w-36" />
                <div className="flex flex-col gap-3">
                  <GlassTile
                    src="/images/image-16.png"
                    alt=""
                    className="h-[78px] w-19"
                    imgClassName="scale-150 object-contain"
                  />
                  <GlassTile empty className="h-[70px] w-19">
                    <PetBuddy />
                  </GlassTile>
                </div>
              </div>
            </GlassPanel>
          </FadeInUp>

          {/* right: icon row + code editor screenshot, each independently hoverable */}
          <div className="flex rotate-3 skew-x-3 flex-col gap-3">
            <FadeInUp delay={0.1}>
              <DeskBuddyCard icons={RIGHT_ROW_ICONS} />
            </FadeInUp>
            <FadeInUp delay={0.25}>
              <TiltCard peekCorner="top-right" showPeekingBuddy={false}>
                <GlassPanel className="flex flex-row items-center gap-2">
                  <GlassTile src="/images/rectangle-78.png" alt="" className="h-24 w-40" />
                  <div className="flex flex-col gap-1.5">
                    <GlassTile src="/images/rectangle-79.png" alt="" className="h-11 w-17" />
                    <GlassTile src="/images/rectangle-80.png" alt="" className="h-11 w-17" />
                  </div>
                </GlassPanel>
              </TiltCard>
            </FadeInUp>
          </div>
        </div>

        {/* Mobile: 3-card fan — tap a skewed side card to bring it to the front */}
        <FadeInUp delay={0.1} className="mt-10 w-full md:hidden">
          <HeroMobileStack />
        </FadeInUp>

        <p
          className="mt-16 text-lg text-muted-400 sm:text-xl md:text-2xl"
          style={{ fontVariationSettings: '"wdth" 100' }}
        >
          *See the design from my desk
        </p>
      </div>

      {/* Music player: compact round sound button at bottom-left on mobile
          (the bottom nav owns the center); full bar centered on md+ */}
      <div className="absolute bottom-22 left-6 z-10 flex items-center gap-2 rounded-[27px] border-[0.5px] border-white/26 bg-white/10 p-2.5 shadow-[0px_5px_5px_rgba(0,0,0,0.16)] md:bottom-8 md:left-1/2 md:w-[calc(100%-3rem)] md:max-w-[280px] md:-translate-x-1/2 md:rounded-[10px]">
        <div className="relative size-5 shrink-0 md:size-10">
          <Image src="/images/app-icons-music.svg" alt="" fill />
        </div>
        <p className="hidden min-w-0 flex-1 truncate text-[13px] tracking-[-0.08px] text-white md:block">
          Moth to a Flame
        </p>
        <span className="hidden shrink-0 text-[13px] text-white/55 md:inline">▶</span>
        <span className="hidden shrink-0 text-[11px] text-white/26 md:inline">▶▶</span>
      </div>
    </section>
  );
}
