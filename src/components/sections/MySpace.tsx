"use client";

import { useState } from "react";
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
            <div className="h-[220px] w-full rounded-lg bg-[#808080] sm:h-[291px]" />
          </div>
          <p className="font-pixel-triangle text-sm leading-relaxed text-muted-500 sm:text-base">
            Rapid prototyping is basically my excuse to build random ideas that
            absolutely didn&rsquo;t need to exist. Some worked, some humbled me
            real quick (free character development), but every prototype taught
            me something new about interactions, motion, and how ideas
            actually feel once they&rsquo;re out of Figma.
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
