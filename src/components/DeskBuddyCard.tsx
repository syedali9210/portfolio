"use client";

import { useState } from "react";
import DeskBuddy from "@/components/DeskBuddy";
import GlassPanel from "@/components/GlassPanel";
import GlassTile from "@/components/GlassTile";
import TiltCard from "@/components/TiltCard";

export default function DeskBuddyCard({
  icons,
}: {
  icons: { src: string; imgClassName: string }[];
}) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="relative"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <TiltCard peekCorner="top-left" showPeekingBuddy={false}>
        <GlassPanel className="flex flex-row flex-wrap gap-2">
          {icons.map((icon) => (
            <GlassTile key={icon.src} src={icon.src} alt="" className="h-13 w-13" imgClassName={icon.imgClassName} />
          ))}
        </GlassPanel>
      </TiltCard>
      <DeskBuddy active={hovering} />
    </div>
  );
}
