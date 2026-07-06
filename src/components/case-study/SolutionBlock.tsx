import { ReactNode } from "react";
import ShapePill from "@/components/ShapePill";

export default function SolutionBlock({
  labelSrc,
  label,
  leftTitle = "Problem",
  leftText,
  rightTitle = "Solution",
  rightText,
  children,
}: {
  labelSrc: string;
  label: string;
  leftTitle?: string;
  leftText: string;
  rightTitle?: string;
  rightText: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 border-b border-white/15 py-11 first:pt-0 last:border-b-0">
      <ShapePill src={labelSrc} className="h-10 w-fit" textClassName="text-white text-base sm:text-lg">
        {label}
      </ShapePill>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="font-body text-2xl font-semibold text-white sm:text-3xl">{leftTitle}</p>
          <p className="font-pixel-square text-base text-[#999] sm:text-xl">{leftText}</p>
        </div>
        <div className="flex flex-col gap-3 md:border-l md:border-white/15 md:pl-8">
          <p className="font-body text-2xl font-semibold text-white sm:text-3xl">{rightTitle}</p>
          <p className="font-pixel-square text-base text-[#999] sm:text-xl">{rightText}</p>
        </div>
      </div>

      {children}
    </div>
  );
}
