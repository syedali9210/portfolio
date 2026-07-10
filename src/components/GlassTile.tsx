import Image from "next/image";
import { ReactNode } from "react";

export default function GlassTile({
  src,
  alt = "",
  className = "",
  imgClassName = "object-cover",
  empty = false,
  priority = false,
  children,
}: {
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  empty?: boolean;
  priority?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-[11px] bg-black shadow-[inset_0_0_33.5px_0_rgba(48,48,48,0.25)] ${className}`}
    >
      {!empty && src && (
        <Image src={src} alt={alt} fill className={imgClassName} sizes="200px" priority={priority} />
      )}
      {children}
    </div>
  );
}
