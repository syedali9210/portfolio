"use client";

import { useState } from "react";
import GlassTile from "@/components/GlassTile";
import PetBuddy from "@/components/PetBuddy";
import ShapePill from "@/components/ShapePill";
import SupermoveCard from "@/components/SupermoveCard";

type Tab = "blogs" | "archive";

function CarouselIndicator({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-start gap-2.5 ${className}`}>
      <span className="h-2.5 w-13 rounded-full bg-[#d9d9d9]" />
      <span className="h-2.5 w-8 rounded-full bg-[#d9d9d9]" />
      <span className="h-2.5 w-8 rounded-full bg-[#d9d9d9]" />
    </div>
  );
}

export default function MySpace() {
  const [tab, setTab] = useState<Tab>("blogs");

  return (
    <section id="my-space" className="relative px-6 py-20 sm:px-10">
      <h2 className="mb-10 text-center font-pixel text-6xl text-muted-500 sm:text-8xl">
        My Space
      </h2>

      {tab === "blogs" ? (
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-9">
          <p className="text-center font-pixel text-3xl text-muted-500 sm:text-5xl">
            Rapid Prototyping
          </p>
          <div className="relative w-full">
            <CarouselIndicator className="absolute top-1/2 -left-16 hidden -translate-y-1/2 lg:flex" />
            <GlassTile empty className="h-[220px] w-full sm:h-[291px]">
              <PetBuddy />
            </GlassTile>
          </div>
          <p className="font-pixel-triangle text-sm leading-relaxed text-muted-500 sm:text-base">
            From developing my own portfolio to making my own pet buddy like{" "}
            <em>Claude</em>, this idea came to my mind while i was glued to my
            desk while making my portfolio with my earphones on.
            <br />
            <br />
            The pet buddy is currently at version 0.1 — it still needs
            refinement and work to make it awesome, which i will use it on my
            portfolio and my experiment sites that absolutely makes sense to
            me at 3:00 am in the morning.
            <br />
            <br />
            There are some hidden animations of the pet buddy across my
            portfolio, which you can see while hovering over the elements.
            <br />
            <br />
            I want to make my pet buddy a completely banger pet buddy. The
            upcoming version of it will have better interactions, animation,
            more texture and more feelings to it, stay tuned to see the Pet
            Buddy coming fully alive :)
          </p>
        </div>
      ) : (
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-10">
          <p className="max-w-xl text-center font-pixel-triangle text-lg text-white sm:text-xl">
            Welcome to the space where i keep on experimenting with things,
            anything and everything will be put up in this area, :)
          </p>
          <div className="flex w-full flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-10">
            <SupermoveCard />
            <SupermoveCard />
          </div>
        </div>
      )}

      <div className="mt-16 flex items-center justify-center gap-9">
        {tab === "blogs" ? (
          <>
            <ShapePill src="/images/subtract-4.svg" className="h-10 w-[115px]" textClassName="text-black text-lg sm:text-xl">
              Blogs
            </ShapePill>
            <button
              type="button"
              onClick={() => setTab("archive")}
              className="font-pixel text-lg text-white transition-opacity hover:opacity-70 sm:text-xl"
            >
              Archive
            </button>
          </>
        ) : (
          <>
            <ShapePill src="/images/subtract-4.svg" className="h-10 w-[115px]" textClassName="text-black text-lg sm:text-xl">
              Archive
            </ShapePill>
            <button
              type="button"
              onClick={() => setTab("blogs")}
              className="font-pixel text-lg text-white transition-opacity hover:opacity-70 sm:text-xl"
            >
              Blogs
            </button>
          </>
        )}
      </div>
    </section>
  );
}
