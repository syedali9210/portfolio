import Image from "next/image";
import { ReactNode } from "react";

export default function ShapePill({
  src,
  className = "",
  textClassName = "text-black",
  children,
}: {
  src: string;
  className?: string;
  textClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={`relative flex items-center justify-center px-3 py-1.5 ${className}`}>
      <Image src={src} alt="" fill className="pointer-events-none" />
      <p className={`relative font-pixel text-sm whitespace-nowrap sm:text-base ${textClassName}`}>
        {children}
      </p>
    </div>
  );
}
