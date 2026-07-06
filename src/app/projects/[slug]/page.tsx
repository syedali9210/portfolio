import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import CaseStudyAirtribe from "@/components/case-study/CaseStudyAirtribe";
import CaseStudyKodex from "@/components/case-study/CaseStudyKodex";
import CaseStudyUniqkey from "@/components/case-study/CaseStudyUniqkey";
import CaseStudyComingSoon from "@/components/case-study/CaseStudyComingSoon";
import { PROJECTS } from "@/data/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.id }));
}

const CASE_STUDIES: Record<string, () => React.ReactNode> = {
  airtribe: () => <CaseStudyAirtribe />,
  kodex: () => <CaseStudyKodex />,
  uniqkey: () => <CaseStudyUniqkey />,
};

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  const renderCaseStudy = CASE_STUDIES[slug];

  return (
    <>
      <Nav />
      {renderCaseStudy ? renderCaseStudy() : <CaseStudyComingSoon project={project} />}
    </>
  );
}
