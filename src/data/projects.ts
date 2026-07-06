export type Project = {
  id: string;
  navLabel: string;
  titleBg: string;
  title: string;
  meta: string;
  gradient: string;
  image: string;
  borderColor: string;
  categoryPill: string;
  categoryLabel: string;
  description: string;
  hasCaseStudy: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "airtribe",
    navLabel: "Airtribe",
    titleBg: "bg-[#dff3dc]",
    title: "Airtribe - AI Learning Experience",
    meta: "EduTech, 2025",
    gradient: "from-[#123600] to-[#005266]",
    image: "/images/frame-7.png",
    borderColor: "border-[#f3f3f3]",
    categoryPill: "/images/subtract-airtribe-tag.svg",
    categoryLabel: "Product Design",
    description:
      "Designed an AI experience for the users to ease their learning experience through out the site.",
    hasCaseStudy: true,
  },
  {
    id: "kodex",
    navLabel: "Kodex",
    titleBg: "bg-[#e9d5aa]",
    title: "Kodex",
    meta: "BASENINE, 2026",
    gradient: "from-[#7f5d83] to-[#7c7340]",
    image: "/images/kodex-screenshot.png",
    borderColor: "border-[#f3f3f3]",
    categoryPill: "/images/subtract-kodex-tag.svg",
    categoryLabel: "Website redesign",
    description: "Redesigning Kodex's digital experience for enterprise customers.",
    hasCaseStudy: true,
  },
  {
    id: "uniqkey",
    navLabel: "Uniqkey",
    titleBg: "bg-[#f0f3e7]",
    title: "Uniqkey",
    meta: "BASENINE, 2026",
    gradient: "from-[#3a4855] to-[#545b3c]",
    image: "/images/uniqkey-screenshot.png",
    borderColor: "border-[#7a7a7a]",
    categoryPill: "/images/subtract-uniqkey-tag.svg",
    categoryLabel: "Website design",
    description: "Designing a landing page that turns security awareness into action.",
    hasCaseStudy: true,
  },
];
