import Image from "next/image";
import ProjectCard from "@/components/ProjectCard";
import Contact from "@/components/sections/Contact";
import { PROJECTS } from "@/data/projects";
import CaseStudySection from "./CaseStudySection";
import StickyNote from "./StickyNote";
import GoalBubble from "./GoalBubble";
import SolutionBlock from "./SolutionBlock";
import OutcomeBadge from "./OutcomeBadge";

const project = PROJECTS.find((p) => p.id === "kodex")!;

const NOTES = [
  { src: "/images/kx-note-messaging.svg", title: "Product messaging wasn't immediately clear." },
  { src: "/images/kx-note-hierarchy.svg", title: "Important content lacked visual hierarchy." },
  { src: "/images/kx-note-navigation.svg", title: "Navigation made exploration feel difficult." },
  { src: "/images/kx-note-trust.svg", title: "Enterprise trust wasn't communicated effectively." },
  { src: "/images/kx-note-consistency.svg", title: "Visual consistency varied across pages." },
];

const GOALS = [
  {
    src: "/images/kx-goal-clarity.svg",
    title: "Product Clarity",
    description: "Help visitors understand what Kodex does within the first few seconds.",
  },
  {
    src: "/images/kx-goal-trust.svg",
    title: "Enterprise Trust",
    description: "Create a premium visual language that reflects the maturity of the platform.",
  },
  {
    src: "/images/kx-goal-navigation.svg",
    title: "Simplify Navigation",
    description: "Reduce friction and make important information easier to discover.",
  },
  {
    src: "/images/kx-goal-conversions.svg",
    title: "Drive Conversions",
    description:
      "Design clear user journeys that naturally lead visitors toward booking a demo or exploring documentation.",
  },
];

const OUTCOMES = [
  {
    labelSrc: "/images/kx-outcome-communication.svg",
    label: "Clearer Product Communication",
    barColor: "rgba(102,177,81,0.47)",
    barWidth: "163px",
    metric: "↓ Learning Curve",
  },
  {
    labelSrc: "/images/kx-outcome-navigation.svg",
    label: "Improved Navigation",
    barColor: "rgba(0,110,169,0.47)",
    barWidth: "116px",
    metric: "3 → 1 Navigation Path",
  },
  {
    labelSrc: "/images/kx-outcome-trust.svg",
    label: "Stronger Enterprise Trust",
    barColor: "rgba(131,0,128,0.47)",
    barWidth: "105px",
    metric: "↑ Brand Trust",
  },
  {
    labelSrc: "/images/kx-outcome-conversion.svg",
    label: "Conversion-Focused Journey",
    barColor: "rgba(184,52,0,0.47)",
    barWidth: "102px",
    metric: "↑ CTA Visibility",
  },
];

export default function CaseStudyKodex() {
  return (
    <main className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <ProjectCard project={project} />

        <div className="flex flex-col gap-8">
          <CaseStudySection className="flex flex-col items-start gap-4">
            <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Overview</p>
            <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
              Kodex is a B2B compliance platform that helps organizations integrate regulatory
              workflows into their existing systems.
              <br />
              Redesigning the marketing website to better communicate the product, improve usability,
              and create a stronger enterprise-first experience.
            </p>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-4">
            <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">The Challenge</p>
            <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
              The existing website didn&rsquo;t effectively communicate the value of the product.
              Technical information was difficult to digest, navigation lacked structure, and the
              overall experience didn&rsquo;t reflect the maturity of the platform.
            </p>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-12">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">
                Understanding the Existing Experience
              </p>
              <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                After reviewing the existing website, I identified several areas that created friction
                for users.
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
                After identifying the key pain points, I defined a few design goals that guided the
                entire redesign. The focus wasn&rsquo;t just on improving the UI, but on making the
                experience clearer, easier to navigate, and more aligned with how enterprise users
                explore and understand a product like Kodex.
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
                labelSrc="/images/kx-label-hero.svg"
                label="Hero Experience"
                leftText="The hero section didn't clearly communicate Kodex's value proposition."
                rightTitle="Why this solution"
                rightText="Redesigned the hero with stronger messaging, supporting visuals, and clear primary actions to immediately explain the platform."
              >
                <div className="relative aspect-[1060/558] w-full overflow-hidden rounded-2xl">
                  <Image src="/images/kx-hero-image.png" alt="Kodex hero redesign" fill className="object-cover" />
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Why it works</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                    Visitors understand what Kodex does within seconds and know where to go next.
                  </p>
                </div>
              </SolutionBlock>

              <SolutionBlock
                labelSrc="/images/kx-label-navigation.svg"
                label="Information Architecture & Navigation"
                leftText="Users had difficulty discovering products, industries, and integrations due to an unstructured navigation system."
                rightText="Reorganized the navigation around user intent and introduced a clearer information architecture."
              >
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative aspect-[381/309] w-full overflow-hidden rounded-md">
                    <Image src="/images/kx-nav-frame2.png" alt="" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[332/348] w-full overflow-hidden rounded-md">
                    <Image src="/images/kx-nav-frame1.png" alt="" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[851/298] w-full overflow-hidden rounded-md sm:col-span-2">
                    <Image src="/images/kx-nav-image9.png" alt="" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Why it works</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                    Makes exploring the platform more intuitive while reducing decision fatigue.
                  </p>
                </div>
              </SolutionBlock>

              <SolutionBlock
                labelSrc="/images/kx-label-storytelling.svg"
                label="Product Storytelling"
                leftText="Complex compliance workflows were difficult to understand through text-heavy sections."
                rightText="Rebuilt product pages using modular layouts, visual storytelling, and clearer content hierarchy."
              >
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <div className="relative aspect-[450/230] w-full max-w-[450px] overflow-hidden rounded-[10px]">
                    <Image src="/images/kx-story-image10.png" alt="" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[530/208] w-full max-w-[530px] overflow-hidden rounded-[10px]">
                    <Image src="/images/kx-story-image11.png" alt="" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Why it works</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                    Transforms technical information into content that&rsquo;s easier to scan and
                    understand.
                  </p>
                </div>
              </SolutionBlock>

              <SolutionBlock
                labelSrc="/images/kx-label-trust.svg"
                label="Enterprise Trust"
                leftText="The website lacked visual elements that reinforced credibility and trust."
                rightTitle="Why it works"
                rightText="Introduced stronger typography, consistent spacing, customer logos, supporting visuals, and enterprise-focused layouts."
              >
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative aspect-[238/190] w-full overflow-hidden rounded-md">
                    <Image src="/images/kx-trust-chart.png" alt="" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[313/78] w-full overflow-hidden rounded-md">
                    <Image src="/images/kx-trust-frame1.png" alt="" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[313/75] w-full overflow-hidden rounded-md">
                    <Image src="/images/kx-trust-frame3.png" alt="" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[246/88] w-full overflow-hidden rounded-md">
                    <Image src="/images/kx-trust-frame2.png" alt="" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Impact</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                    Creates a more credible and professional experience for enterprise buyers.
                  </p>
                </div>
              </SolutionBlock>
            </div>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-12">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Outcomes</p>
              <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                The redesign transformed Kodex&rsquo;s website into a clearer, more structured
                experience that better communicates the product while reinforcing trust with
                enterprise customers.
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
              Working on Kodex taught me that designing for B2B products goes beyond creating clean
              interfaces—it&rsquo;s about simplifying complex ideas and communicating them with
              clarity. I also learned how to balance stakeholder feedback, business goals, and
              technical constraints while building a scalable experience that feels intuitive,
              trustworthy, and ready to grow.
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
