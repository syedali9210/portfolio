import ShapePill from "@/components/ShapePill";

export default function OutcomeBadge({
  labelSrc,
  label,
  barColor,
  barWidth,
  metric,
}: {
  labelSrc: string;
  label: string;
  barColor: string;
  barWidth: string;
  metric: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <ShapePill src={labelSrc} className="h-10 w-fit" textClassName="text-white text-base sm:text-lg">
        <span className="inline-flex items-center gap-2">
          {label}
          <span className="inline-block rotate-45">→</span>
        </span>
      </ShapePill>
      <div className="h-4 rounded-md" style={{ backgroundColor: barColor, width: barWidth }} />
      <p className="font-pixel-square text-xs text-muted-400">{metric}</p>
    </div>
  );
}
