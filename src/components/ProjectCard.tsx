import Image from "next/image";
import Link from "next/link";
import ShapePill from "@/components/ShapePill";
import type { Project } from "@/data/projects";

function CardBody({ project }: { project: Project }) {
  return (
    <>
      <div
        className={`relative flex h-[220px] items-center justify-center overflow-hidden rounded-[15px] bg-gradient-to-b sm:h-[320px] md:h-[420px] ${project.gradient}`}
      >
        <div className={`relative h-[85%] w-[95%] overflow-hidden rounded-lg border-4 ${project.borderColor} sm:border-5`}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top"
            sizes="(min-width: 1024px) 900px, 90vw"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className={`rounded-md px-2.5 py-1 ${project.titleBg}`}>
            <p className="font-pixel text-base text-black sm:text-xl">{project.title}</p>
          </div>
          <p className="font-pixel text-base text-white sm:text-xl">| {project.meta}</p>
        </div>

        <ShapePill src={project.categoryPill} className="h-8 w-[126px]" textClassName="text-black text-sm">
          {project.categoryLabel}
        </ShapePill>

        <p className="font-pixel text-lg text-white sm:text-xl">{project.description}</p>
      </div>
    </>
  );
}

export default function ProjectCard({
  project,
  linkable = true,
}: {
  project: Project;
  // Case-study pages reuse this card as their own hero image, so linking
  // it to `/projects/${project.id}` would point the card at the page
  // it's already on — a dead click styled like a live one.
  linkable?: boolean;
}) {
  const className =
    "flex flex-col gap-2.5 rounded-2xl border-[0.5px] border-white/26 bg-gradient-to-b from-white/10 to-[#999999]/10 p-4 shadow-[0px_10px_5px_rgba(0,0,0,0.15)] backdrop-blur-[48px] sm:px-[18px] sm:py-[19px]";

  if (project.hasCaseStudy && linkable) {
    return (
      <Link
        href={`/projects/${project.id}`}
        id={project.id}
        className={`${className} transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0px_18px_24px_rgba(0,0,0,0.35)]`}
      >
        <CardBody project={project} />
      </Link>
    );
  }

  return (
    <article id={project.id} className={className}>
      <CardBody project={project} />
    </article>
  );
}
