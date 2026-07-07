import Image from "next/image";
import ProjectCard from "@/components/ProjectCard";
import Contact from "@/components/sections/Contact";
import { PROJECTS } from "@/data/projects";
import CaseStudySection from "./CaseStudySection";
import StickyNote from "./StickyNote";
import SpeechBubble from "./SpeechBubble";
import SolutionBlock from "./SolutionBlock";
import OutcomeBadge from "./OutcomeBadge";
import InsightAccordion from "./InsightAccordion";

const project = PROJECTS.find((p) => p.id === "airtribe")!;

const STICKY_NOTES = [
  {
    src: "/images/cs-note-learning-journey.svg",
    title: "Learning Journey",
    points: [
      "Users struggled to understand the overall course flow.",
      "Progress wasn't clearly communicated.",
    ],
  },
  {
    src: "/images/cs-note-navigation.svg",
    title: "Navigation",
    points: [
      "Finding recordings, assignments, and resources required unnecessary effort.",
      "Core sections felt disconnected.",
    ],
  },
  {
    src: "/images/cs-note-info-hierarchy.svg",
    title: "Information Hierarchy",
    points: [
      "Important actions competed for attention.",
      "Users had difficulty identifying priorities.",
    ],
  },
  {
    src: "/images/cs-note-engagement.svg",
    title: "Engagement",
    points: [
      "The platform lacked proactive guidance.",
      "Learners often had to search for information instead of receiving timely support.",
    ],
  },
];

const SPEECH_BUBBLES = [
  {
    src: "/images/cs-bubble-learning-flow.svg",
    title: "Learning Flow",
    quotes: [
      "“Not sure where to start.”",
      "“The course journey feels confusing.”",
      "“I don't know what's coming next.”",
    ],
  },
  {
    src: "/images/cs-bubble-navigation.svg",
    title: "Navigation",
    quotes: [
      "“Finding recordings takes too many clicks.”",
      "“I keep jumping between different sections.”",
      "“Assignments and resources feel disconnected.”",
    ],
  },
  {
    src: "/images/cs-bubble-info-heir.svg",
    title: "Info. Heir.",
    quotes: [
      "“Everything feels the same.”",
      "“Not sure what to do.”",
      "“Easy to miss updates.”",
    ],
  },
  {
    src: "/images/cs-bubble-ai.svg",
    title: "AI",
    quotes: [
      "“Need instant answers.”",
      "“Resources are hard to find.”",
      "“Need tailored recommendations.”",
    ],
  },
];

const INSIGHTS = [
  {
    title: "Reduce cognitive load",
    description:
      "Learning should feel effortless. Surface only what's relevant instead of making learners process everything at once.",
  },
  {
    title: "Guide, don't overwhelm",
    description:
      "Instead of presenting every resource upfront, provide contextual guidance and clear next steps based on where the learner is in their journey.",
  },
  {
    title: "Context beats search",
    description:
      "Learners shouldn't have to remember where information lives. Answers should appear within the context of the task they're already doing.",
  },
  {
    title: "AI should augment, not replace",
    description:
      "AI is most valuable when it supports mentors and learners with summaries, recommendations, and guidance—not when it attempts to replace human teaching.",
  },
];

const OUTCOMES = [
  {
    labelSrc: "/images/cs-outcome-learning.svg",
    label: "Clear Learning Journey",
    barColor: "rgba(102,177,81,0.47)",
    barWidth: "163px",
    metric: "↓ Cognitive Load (Qualitative)",
  },
  {
    labelSrc: "/images/cs-outcome-navigation.svg",
    label: "Faster Navigation",
    barColor: "rgba(0,110,169,0.47)",
    barWidth: "81px",
    metric: "3 → 1 Clicks",
  },
  {
    labelSrc: "/images/cs-outcome-ai.svg",
    label: "Contextual AI Support",
    barColor: "rgba(131,0,128,0.47)",
    barWidth: "105px",
    metric: "24/7 Assistance",
  },
  {
    labelSrc: "/images/cs-outcome-hierarchy.svg",
    label: "Better Information Hierarchy",
    barColor: "rgba(184,52,0,0.47)",
    barWidth: "102px",
    metric: "↑ Task Visibility",
  },
];

export default function CaseStudyAirtribe() {
  return (
    <main className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <ProjectCard project={project} linkable={false} />

        <div className="flex flex-col gap-8">
          <CaseStudySection className="flex flex-col items-start gap-4">
            <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Overview</p>
            <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
              An AI-powered redesign of Airtribe&rsquo;s learning platform focused on helping learners
              navigate courses more confidently, reduce friction, and receive contextual AI assistance
              throughout their learning journey.
              <br />
              Airtribe is a cohort-based edtech platform where professionals learn through live sessions,
              mentorship, assignments, and community-driven programs.
            </p>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-4">
            <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">The Challenge</p>
            <div className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
              <p className="mb-4">
                Although Airtribe offered quality learning content, the overall experience made it
                difficult for learners to understand where they were, what to do next, and how to make
                the most of the platform.
              </p>
              <p>
                My goal was to redesign the learning experience while exploring how AI could provide
                contextual assistance without overwhelming users.
              </p>
            </div>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-12">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">
                Breaking Down the Problem
              </p>
              <div className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                <p className="mb-4">
                  To dig deeper, I broke the problem down into four areas: how learners moved through
                  their course journey, how they navigated the platform, how information was
                  prioritized, and how engaged they felt along the way.
                </p>
                <p>
                  Each area became its own lens for uncovering exactly where the friction was coming
                  from.
                </p>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 place-items-center gap-8 sm:grid-cols-2">
              {STICKY_NOTES.map((note) => (
                <StickyNote key={note.title} {...note} />
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-center gap-12">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">
                Research &amp; Findings
              </p>
              <div className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                <p className="mb-4">
                  After reviewing the existing platform, studying the user journey, and comparing similar
                  learning platforms, I found that most friction didn&rsquo;t come from the content
                  itself — it came from how learners interacted with the platform.
                </p>
                <p className="mb-4">
                  Users weren&rsquo;t looking for more features. They wanted a learning experience that
                  felt structured, guided, and easy to navigate.
                </p>
                <p>The research highlighted four recurring themes that became the foundation of the redesign.</p>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {SPEECH_BUBBLES.map((bubble) => (
                <SpeechBubble key={bubble.title} {...bubble} />
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-8">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Insights</p>
              <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                The research uncovered recurring patterns in user behavior that revealed where learners
                experienced the most friction. These insights guided the redesign and shaped every
                feature that followed.
              </p>
            </div>
            <InsightAccordion items={INSIGHTS} />
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-8">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Solutions</p>
              <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                The redesign focused on solving the most critical pain points uncovered during research.
              </p>
            </div>

            <div className="flex w-full flex-col">
              <SolutionBlock
                labelSrc="/images/cs-label-ai-companion.svg"
                label="AI Learning Companion"
                leftText="Learners spent too much time searching for answers across recordings, discussions, and resources."
                rightTitle="Why this solution"
                rightText="Redesigned the hero around a stronger value proposition with supporting visuals and clear CTAs."
              >
                <div className="relative aspect-[938/661] w-full overflow-hidden rounded-2xl">
                  <Image src="/images/cs-image-12.png" alt="AI learning companion" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Impact</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                    Faster access to information, reduced friction, and a more guided learning experience.
                  </p>
                </div>
              </SolutionBlock>

              <SolutionBlock
                labelSrc="/images/cs-label-dashboard.svg"
                label="Redesigned Dashboard"
                leftText="Users couldn't quickly understand their progress or what required attention."
                rightText="Highlights priorities, upcoming sessions, and progress in a single, easy-to-scan view."
              >
                <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
                  <div className="flex w-full max-w-[420px] flex-col items-center gap-4">
                    <div className="relative aspect-[514/261] w-full overflow-hidden rounded-md border-[0.5px] border-[#b8b8b8]">
                      <Image src="/images/cs-screenshot-before.png" alt="Before" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                    </div>
                    <p className="font-body text-lg font-semibold text-[#d7d7d7]">Before</p>
                  </div>
                  <div className="flex w-full max-w-[420px] flex-col items-center gap-4">
                    <div className="relative aspect-[516/262] w-full overflow-hidden rounded-md border-[0.5px] border-[#b8b8b8]">
                      <Image src="/images/cs-image-5-after.png" alt="After" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                    </div>
                    <p className="font-body text-lg font-semibold text-[#d7d7d7]">After</p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Why it works</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-muted-600 sm:text-xl">
                    Learners can see exactly what needs attention at a glance, without digging through
                    multiple screens.
                  </p>
                </div>
              </SolutionBlock>

              <SolutionBlock
                labelSrc="/images/cs-label-navigation.svg"
                label="Simplified Navigation"
                leftText="Finding recordings, assignments, and resources required unnecessary effort."
                rightText="Users can reach core sections faster with a more predictable navigation experience."
              >
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative aspect-[510/198] w-full overflow-hidden rounded-md">
                    <Image src="/images/cs-ai-curated-section.png" alt="AI curated section" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                  <div className="relative aspect-[792/250] w-full overflow-hidden rounded-md bg-white">
                    <Image src="/images/cs-quick-notes.png" alt="Quick notes" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-contain p-2" />
                  </div>
                  <div className="relative aspect-[792/231] w-full overflow-hidden rounded-md bg-white">
                    <Image src="/images/cs-container.png" alt="Workspace container" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-contain p-2" />
                  </div>
                  <div className="relative aspect-[532/187] w-full overflow-hidden rounded-md bg-white">
                    <Image src="/images/cs-projects-mock.png" alt="Projects" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-contain p-2" />
                  </div>
                </div>
              </SolutionBlock>

              <SolutionBlock
                labelSrc="/images/cs-label-info-hierarchy.svg"
                label="Improved Information Hierarchy"
                leftText="Important information competed equally for attention."
                rightTitle="Why it works"
                rightText="Reorganized content using stronger hierarchy, spacing, and visual emphasis."
              >
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="relative aspect-[1212/643] w-full overflow-hidden rounded-md">
                    <Image src="/images/cs-image-6.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                  <div className="relative aspect-[525/281] w-full overflow-hidden rounded-md border-[0.45px] border-[#b6b6b6]">
                    <Image src="/images/cs-image-12.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                  <div className="relative aspect-[1025/752] w-full overflow-hidden rounded-md">
                    <Image src="/images/cs-image-7.png" alt="" fill sizes="(min-width: 1024px) 950px, 100vw" className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Impact</p>
                  <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                    Users can identify priorities at a glance and make decisions more confidently.
                  </p>
                </div>
              </SolutionBlock>
            </div>
          </CaseStudySection>

          <CaseStudySection className="flex flex-col items-start gap-12">
            <div className="flex flex-col items-start gap-4">
              <p className="font-body w-full text-2xl font-semibold text-white sm:text-3xl">Outcomes</p>
              <p className="font-pixel-square w-full text-base leading-relaxed text-[#999] sm:text-xl">
                The redesign focused on creating a clearer and more guided learning experience by
                simplifying navigation, improving information hierarchy, and introducing contextual AI
                support.
              </p>
            </div>

            <p className="font-pixel-triangle max-w-md text-lg text-white sm:text-xl">
              You&rsquo;ve officially graduated from this case study.
              <br />
              Time to enroll in the next one.
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
              This project helped me think beyond just designing screens. I learned how small UX
              decisions can shape the entire learning experience and how AI should solve real user
              problems instead of being added just because it&rsquo;s trending.
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
