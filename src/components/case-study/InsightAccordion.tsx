"use client";

import { useState } from "react";

export default function InsightAccordion({
  items,
}: {
  items: { title: string; description: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col gap-4">
      {items.map((item, index) => {
        const open = index === openIndex;
        return (
          <div key={item.title} className="rounded-2xl bg-[#2e2e2e]">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <p className="font-pixel-square text-lg text-white sm:text-2xl">{item.title}</p>
              <p
                className="font-pixel-square text-lg text-white transition-transform duration-300 sm:text-2xl"
                style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                +
              </p>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="font-pixel-square px-5 pb-4 text-base leading-relaxed text-[#999] sm:text-xl">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
