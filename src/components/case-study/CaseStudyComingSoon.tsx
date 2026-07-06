import type { Project } from "@/data/projects";

export default function CaseStudyComingSoon({ project }: { project: Project }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-32 text-center sm:px-10">
      <h1 className="font-pixel text-5xl text-muted-500 sm:text-7xl">{project.navLabel}</h1>
      <p className="font-pixel-triangle max-w-md text-lg text-white sm:text-xl">
        The full case study for {project.navLabel} is still being written up — check back soon.
      </p>
    </main>
  );
}
