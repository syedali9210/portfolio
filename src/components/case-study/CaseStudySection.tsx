import { ReactNode } from "react";

export default function CaseStudySection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[33px] bg-[#0f0f0f] p-6 sm:p-8 md:p-11 ${className}`}>
      {children}
    </div>
  );
}
