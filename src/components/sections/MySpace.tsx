"use client";

import { useState } from "react";
import CubeReveal from "@/components/CubeReveal";
import GlassPanel from "@/components/GlassPanel";
import GlassTile from "@/components/GlassTile";
import PetBuddy from "@/components/PetBuddy";
import ScratchCard from "@/components/ScratchCard";
import SwipeableCards from "@/components/SwipeableCards";
import VideoReveal from "@/components/VideoReveal";

type Tab = "blogs" | "archive";

export default function MySpace() {
  const [tab, setTab] = useState<Tab>("blogs");

  return (
    <section id="my-space" className="relative px-6 py-12 sm:px-10 sm:py-20">
      <h2 className="mb-10 text-center font-pixel text-6xl text-muted-500 sm:text-8xl">
        My Space
      </h2>

      {tab === "blogs" ? (
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-9">
          <p className="text-center font-pixel text-3xl text-muted-500 sm:text-5xl">
            Rapid Prototyping
          </p>
          <div className="relative w-full">
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
          <SwipeableCards
            cards={[
              <ScratchCard
                key="cube"
                forLabel="For You"
                plan="PROTOTYPE"
                period="LIVE"
                reveal={<CubeReveal />}
              />,
              <ScratchCard
                key="demo"
                forLabel="For You"
                plan="DEMO"
                period="REC"
                reveal={<VideoReveal src="/videos/archive-demo.mp4" />}
              />,
            ]}
          />
        </div>
      )}

      <div className="mt-16 flex justify-center">
        <GlassPanel className="flex items-center gap-[34px] px-5 py-2.5">
          <button
            type="button"
            onClick={() => setTab("blogs")}
            className={`text-sm font-medium tracking-[-0.08px] transition-colors ${
              tab === "blogs" ? "text-white" : "text-[#a6a6a6] hover:text-white"
            }`}
          >
            Blogs
          </button>
          <button
            type="button"
            onClick={() => setTab("archive")}
            className={`text-sm font-medium tracking-[-0.08px] transition-colors ${
              tab === "archive" ? "text-white" : "text-[#a6a6a6] hover:text-white"
            }`}
          >
            Archive
          </button>
        </GlassPanel>
      </div>
    </section>
  );
}
