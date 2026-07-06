import Image from "next/image";
import ProjectCard from "@/components/ProjectCard";
import Contact from "@/components/sections/Contact";
import { PROJECTS } from "@/data/projects";
import CaseStudySection from "./CaseStudySection";
import StickyNote from "./StickyNote";
import GoalBubble from "./GoalBubble";
import SolutionBlock from "./SolutionBlock";
import OutcomeBadge from "./OutcomeBadge";

const project = PROJECTS.find((p) => p.id === "uniqkey")!;

const NOTES = [
  { src: "/images/uk-note-messaging.svg", title: "Technical messaging felt overwhelming." },
  { src: "/images/uk-note-benefits.svg", title: "Important benefits lacked emphasis." },
  { src: "/images/uk-note-value.svg", title: "Value proposition wasn't immediately obvious." },
  { src: "/images/uk-note-narrative.svg", title: "The page needed a stronger narrative flow." },
  { src: "/images/uk-note-cta.svg", title: "Calls-to-action could be more prominent." },
];

const GOALS = [
  {
    src: "/images/uk-goal-complex.svg",
    title: "Complex Security Concepts",
    description: "Make cybersecurity easier for non-technical decision makers.",
  },
  {
    src: "/images/uk-goal-trust.svg",
    title: "Enterprise Trust",
    description: "Use visual hierarchy and credibility cues to reinforce confidence.",
  },
  {
    src: "/images/uk-goal-storytelling.svg",
    title: "Improve Storytelling",
    description: "Create a logical flow that gradually explains the problem and solution.",
  },
  {
    src: "/images/uk-goal-conversions.svg",
    title: "Drive Conversions",
    description: "Design a clearer path toward trying the feature or booking a demo.",
  },
];

const OUTCOMES = [
  {
    labelSrc: "/images/uk-outcome-communication.svg",
    label: "Clearer Security Communication",
    barColor: "rgba(102,177,81,0.47)",
    barWidth: "163px",
    metric: "↓ Complexity",
  },
  {
    labelSrc: "/images/uk-outcome-storytelling.svg",
    label: "Stronger Storytelling",
    barColor: "rgba(0,110,169,0.47)",
    barWidth: "116px",
    metric: "1 Clear User Journey",
  },
  {
    labelSrc: "/images/uk-outcome-enterprise.svg",
    label: "Enterprise-ready Experience",
    barColor: "rgba(131,0,128,0.47)",
    barWidth: "105px",
    metric: "↑ Brand Trust",
  },
  {
    labelSrc: "/images/uk-outcome-conversion.svg",
    label: "Better Conversion Flow",
    barColor: "rgba(184,52,0,0.47)",
    barWidth: "102px",
    metric: "↑ CTA Visibility",
  },
];

export default function CaseStudyUniqkey() {
  return (
    <main className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <ProjectCard project={project} />

        <div className="flex flex-col gap-8">
          <CaseStudySection className="flex flex-col items-start gap-4">
            <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Overview</p>
            <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
              Uniqkey is a European password and access management platform that helps businesses
              secure employee credentials and manage access across their organization.
              <br />
              Design a focused landing page that explains Data Breach Monitoring in a simple way,
              builds trust, and encourages businesses to assess their security posture.
            </p>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-4">
            <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">The Challenge</p>
            <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
              Data breach monitoring is a technical topic that can easily overwhelm visitors. The
              challenge was to communicate the value of the feature in a way that felt approachable,
              trustworthy, and conversion-focused without sacrificing technical credibility.
            </p>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-12">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">
                Understanding the Existing Experience
              </p>
              <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                I reviewed how information was presented and how users progressed through the page to
                identify opportunities for improving clarity and conversions.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {NOTES.map((note) => (
                <StickyNote key={note.title} src={note.src} title={note.title} />
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-center gap-12">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Design Goals</p>
              <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                The redesign focused on balancing technical depth with simplicity while guiding
                visitors toward meaningful action.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {GOALS.map((goal) => (
                <GoalBubble key={goal.title} {...goal} />
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-8">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">The Redesign</p>
              <p className="font-pixel-square w-full text-base leading-relaxed text-muted-600 sm:text-xl">
                The redesign focused on solving the most critical pain points uncovered during research.
              </p>
            </div>

            <div className="flex w-full flex-col">
              <SolutionBlock
                labelSrc="/images/uk-label-hero.svg"
                label="Hero Experience"
                leftText="The hero didn't immediately explain why data breach monitoring matters."
                rightTitle="Why this solution"
                rightText="Redesigned the hero around a stronger value proposition with supporting visuals and clear CTAs."
              >
                <div className="relative aspect-[938/661] w-full overflow-hidden rounded-2xl">
                  <Image src="/images/uk-hero-image.png" alt="Uniqkey hero redesign" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Why it works</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                    Visitors immediately understand the problem and how Uniqkey solves it.
                  </p>
                </div>
              </SolutionBlock>

              <SolutionBlock
                labelSrc="/images/uk-label-risk.svg"
                label="Problem & Risk Communication"
                leftText="The impact of a data breach wasn't clearly communicated."
                rightText="Introduced structured content and visual storytelling to explain the risks and their business impact."
              >
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative aspect-[351/334] w-full overflow-hidden rounded-md">
                    <Image src="/images/uk-risk-frame2.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                  <div className="relative aspect-[466/347] w-full overflow-hidden rounded-md">
                    <Image src="/images/uk-risk-frame3.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                  <div className="relative aspect-[575/237] w-full overflow-hidden rounded-md sm:col-span-2">
                    <Image src="/images/uk-risk-frame1.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Why it works</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                    Creates urgency without overwhelming users.
                  </p>
                </div>
              </SolutionBlock>

              <SolutionBlock
                labelSrc="/images/uk-label-feature.svg"
                label="Feature Breakdown"
                leftText="Core features were buried within large blocks of content."
                rightText="Redesigned feature sections using modular cards, icons, and concise explanations."
              >
                <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="relative aspect-[165/374] w-full overflow-hidden rounded-md">
                    <Image src="/images/uk-feature-frame4.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                  <div className="relative col-span-2 aspect-[610/370] w-full overflow-hidden rounded-md sm:col-span-1 sm:aspect-[297/209]">
                    <Image src="/images/uk-feature-frame2.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                  <div className="relative col-span-2 aspect-[610/370] w-full overflow-hidden rounded-md sm:col-span-1 sm:aspect-auto sm:row-span-2 sm:h-full">
                    <Image src="/images/uk-feature-frame1.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                  <div className="relative aspect-[233/483] w-full overflow-hidden rounded-md">
                    <Image src="/images/uk-feature-frame3.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Why it works</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                    Makes capabilities easier to scan and compare.
                  </p>
                </div>
              </SolutionBlock>

              <SolutionBlock
                labelSrc="/images/uk-label-trust.svg"
                label="Trust & Credibility"
                leftText="The page lacked enough proof to reassure enterprise buyers."
                rightTitle="Why it works"
                rightText="Added stronger trust signals through testimonials, certifications, and supporting visuals."
              >
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <div className="relative aspect-[203/242] w-full max-w-[203px] overflow-hidden rounded-md">
                    <Image src="/images/uk-trust-image1.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                  <div className="relative aspect-[234/268] w-full max-w-[234px] -rotate-[8deg] overflow-hidden rounded-md">
                    <Image src="/images/uk-trust-image2.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Impact</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                    Builds confidence before users reach the CTA.
                  </p>
                </div>
              </SolutionBlock>
            </div>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-12">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Outcomes</p>
              <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                The redesign focused on creating a clearer, more structured experience that better
                communicates the product while making it easier for enterprise users to explore,
                understand, and take action.
              </p>
            </div>

            <p className="font-pixel-triangle max-w-md text-lg text-[#999] sm:text-xl">
              Phew... that was a lot of compliance.
              <br />
              Thanks for sticking around. Let&rsquo;s move on to something a little less regulated.
            </p>

            <div className="grid w-full grid-cols-1 place-items-start gap-8 sm:grid-cols-2">
              {OUTCOMES.map((outcome) => (
                <OutcomeBadge key={outcome.label} {...outcome} />
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-4">
            <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">What I Learned</p>
            <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
              Designing for cybersecurity taught me that users don&rsquo;t need every technical detail
              upfront—they need clarity, confidence, and a clear understanding of why the product
              matters. This project strengthened my ability to simplify complex topics while designing
              experiences that educate, build trust, and encourage action.
            </p>
          </CaseStudySection>
        </div>
      </div>

      <div className="mt-32 -mx-6 sm:-mx-10">
        <Contact />
      </div>
    </main>
  );
}
