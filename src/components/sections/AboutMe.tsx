"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "motion/react";
import GlassPanel from "@/components/GlassPanel";

type CardId = "experience" | "sidequests" | "brain" | "compiling";

type Card = {
  id: CardId;
  tabLabel: string;
  // The card's photo; the brain card renders <BrainCollage /> instead.
  image?: string;
  panelTitle: string;
  panelContent: string[];
  // Phase 1 entrance: where the card flies in from (an extra transform on
  // top of its resting `left`/`top`) and how much extra tilt it carries
  // mid-flight before settling into its slot's rotation.
  enter: { x: number; y: number; extraRotate: number };
};

// The four "scattered on the desk" slots (as a % of the stage). Cards are
// not pinned to a slot — when a card is activated it swaps slots with
// whoever currently holds the center slot, so the collage rearranges
// itself instead of leaving a hole behind. `z` is the resting stacking
// order: the back slot peeks out from underneath the center card.
const SLOTS = [
  { left: 0, top: 1.7, width: 28.3, height: 97.8, rotate: -6.41, z: 10 },
  { left: 28.3, top: 0, width: 39.4, height: 70.0, rotate: 0, z: 10 },
  { left: 67.4, top: 18.7, width: 32.6, height: 78.0, rotate: 8.15, z: 10 },
  { left: 29.8, top: 35.9, width: 35.8, height: 63.7, rotate: 4.84, z: 2 },
];
// The slot the expanded card sits on top of — the card it displaces moves
// into the activated card's old slot.
const CENTER_SLOT = 1;

// The stagger rhythm for the entrance: each card (including the decorative
// background one) waits `index * ENTRANCE_STAGGER` after `ENTRANCE_DELAY`
// before flying in, so the collage assembles piece by piece instead of
// popping in all at once.
const ENTRANCE_DELAY = 0.05;
const ENTRANCE_STAGGER = 0.12;
// A springy, slightly overshooting entrance (the "toss it on the desk" feel)
// vs. a soft, gliding spring for later clicks once everything has settled.
const ENTRANCE_SPRING = { type: "spring" as const, stiffness: 130, damping: 12 };
const SETTLED_SPRING = { type: "spring" as const, stiffness: 130, damping: 21, mass: 0.9 };
// How long the staggered entrance takes end-to-end, after which card
// interactions switch to the settled spring.
const SETTLE_AFTER_MS = 1100;

// Mobile deck: the fanned "stack of polaroids" pose per depth (top of the
// deck first), taken from the Figma mobile frame. Swiping the top card
// sends it to the back and the next card fans up into its place.
const DECK_POSES = [
  { x: 8, rotate: 0, scale: 1 },
  { x: -14, rotate: -5, scale: 0.98 },
  { x: -36, rotate: -9.1, scale: 0.96 },
  { x: -58, rotate: -11.3, scale: 0.94 },
];
const SWIPE_THRESHOLD = 80;

// Clicking a card plays in two beats: it first "lifts off the desk"
// (scales up slightly and casts a deep drop shadow) for LIFT_MS, and only
// then travels into the center-stage slot while the displaced card slides
// underneath it into the vacated spot.
const LIFT_MS = 220;
// Both shadows keep the same layer count so motion can interpolate
// smoothly between them; the second layer is the "lifted off the desk"
// depth that fades in under the lifted/active card.
const SHADOW_RESTING = "0px 10px 5px rgba(0,0,0,0.15), 0px 0px 0px rgba(0,0,0,0)";
const SHADOW_LIFTED = "0px 10px 5px rgba(0,0,0,0.15), 0px 45px 55px rgba(0,0,0,0.65)";

// Every card animates into this same central slot when clicked — this is
// what makes the click feel like "grow + move to center stage", regardless
// of where the card started out scattered on the desk.
const EXPANDED_CARD = { left: 28.3, top: 0, width: 39.4, height: 70.0 };
// The info panel that "expands" out of the card once it has arrived center-stage.
const EXPANDED_PANEL = { left: 70.3, top: 0.4, width: 20.0 };

const CARDS: Card[] = [
  {
    id: "sidequests",
    tabLabel: "Side quests",
    image: "/about/side-quest.webp",
    panelTitle: "Side quests",
    panelContent: ["Still building this one out — check back soon."],
    enter: { x: -260, y: 90, extraRotate: -24 },
  },
  {
    id: "experience",
    tabLabel: "Experience",
    image: "/about/experience-main.png",
    panelTitle: "Experience",
    panelContent: [
      "Product Designer at BASENINE",
      "Learned frontend to ship my own ideas.",
      "Fell into the AI rabbit hole.",
      "Still obsessed with tiny interactions",
      `"There has to be a better way."`,
    ],
    enter: { x: 0, y: 200, extraRotate: 16 },
  },
  {
    id: "brain",
    tabLabel: "Inside my brain",
    panelTitle: "Inside my brain",
    panelContent: ["Still building this one out — check back soon."],
    enter: { x: 240, y: -100, extraRotate: 22 },
  },
  {
    id: "compiling",
    tabLabel: "Compiling",
    image: "/about/experience-bg.png",
    panelTitle: "Compiling",
    panelContent: ["Still building this one out — check back soon."],
    enter: { x: -140, y: 140, extraRotate: -18 },
  },
];

// The "inside my brain" collage, rebuilt from its individual full-opacity
// screenshots (the old single PNG export had Figma's 40% layer opacity
// baked in). Positions are % conversions of the Figma frame (349x279).
const BRAIN_PIECES = [
  { src: "/about/brain/screen-wide.png", left: 1.1, top: 5.4, width: 49.7, height: 28.0, rotate: -6.16, radius: 16 },
  { src: "/about/brain/strip.png", left: 58.5, top: 19.4, width: 28.9, height: 6.8, radius: 6 },
  { src: "/about/brain/steps.png", left: 13.2, top: 38.7, width: 19.5, height: 12.9, radius: 5 },
  { src: "/about/brain/effort.png", left: 40.1, top: 38.7, width: 30.7, height: 10.4, radius: 8 },
  { src: "/about/brain/branches.png", left: 72.8, top: 36.6, width: 27.2, height: 11.8, radius: 10 },
  { src: "/about/brain/graph.png", left: 10.3, top: 59.5, width: 45.0, height: 34.8, radius: 0 },
  { src: "/about/brain/pcb.png", left: 75.6, top: 58.8, width: 23.5, height: 39.1, radius: 0 },
];

function BrainCollage() {
  return (
    <div className="relative size-full overflow-hidden rounded-xl">
      {BRAIN_PIECES.map((p) => (
        <div
          key={p.src}
          className="absolute overflow-hidden"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.width}%`,
            height: `${p.height}%`,
            borderRadius: p.radius,
            rotate: p.rotate ? `${p.rotate}deg` : undefined,
          }}
        >
          <Image src={p.src} alt="" fill sizes="250px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="size-3">
      <path
        d="M1 1L11 11M11 1L1 11"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AboutMe() {
  const [activeId, setActiveId] = useState<CardId | null>(null);
  // The card currently in its "lift off the desk" beat, before it starts
  // traveling to the center slot.
  const [liftedId, setLiftedId] = useState<CardId | null>(null);
  // order[i] = which card currently occupies SLOTS[i]. Activating a card
  // swaps it with the center-slot occupant, so positions interchange.
  const [order, setOrder] = useState<CardId[]>(() => CARDS.map((c) => c.id));
  const activeCard = CARDS.find((c) => c.id === activeId) ?? null;

  // Mobile deck order, top card first. Starts with "Inside my brain" on
  // top to match the Figma mobile frame.
  const [deck, setDeck] = useState<CardId[]>(["brain", "experience", "compiling", "sidequests"]);
  const topCard = CARDS.find((c) => c.id === deck[0])!;
  const cycleDeck = () => setDeck((prev) => [...prev.slice(1), prev[0]]);
  const bringToTop = (id: CardId) =>
    setDeck((prev) => (prev[0] === id ? prev : [id, ...prev.filter((x) => x !== id)]));
  const liftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (liftTimer.current) clearTimeout(liftTimer.current);
  }, []);

  const activate = (id: CardId) => {
    if (id === activeId) return;
    if (liftTimer.current) clearTimeout(liftTimer.current);
    // Beat 1: lift. Beat 2 (after LIFT_MS): swap slots and expand.
    setLiftedId(id);
    liftTimer.current = setTimeout(() => {
      setLiftedId(null);
      setActiveId(id);
      setOrder((prev) => {
        const from = prev.indexOf(id);
        if (from === CENTER_SLOT) return prev;
        const next = [...prev];
        next[from] = prev[CENTER_SLOT];
        next[CENTER_SLOT] = id;
        return next;
      });
    }, LIFT_MS);
  };

  // Phase 1 (the staggered "fly in and land" assembly) plays once the desk
  // scrolls into view. Phase 3 (grow + center-stage on click) only takes
  // over once that entrance has finished settling.
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.3 });
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setSettled(true), SETTLE_AFTER_MS);
    return () => clearTimeout(id);
  }, [inView]);

  return (
    <section id="about" className="relative px-6 py-20 sm:px-10">
      <h2 className="mb-16 text-center font-pixel text-6xl text-muted-500 sm:text-8xl">
        About Me
      </h2>

      <p
        className="mx-auto mb-10 max-w-4xl bg-gradient-to-b from-white to-[#999] bg-clip-text text-lg leading-snug text-transparent sm:text-xl"
      >
        An engineering student that somehow ended up in design. A product
        designer, UI/UX designer, a design engineer... call me whatever you
        want.
        <br />
        <br />
        At the end of the day, I just like bringing ideas to life and
        shipping things that people can actually use. Turns out watching
        something go from a random thought to a real product is way more fun
        than it should be.
      </p>

      <div className="mx-auto mb-16 hidden max-w-4xl items-center gap-4 md:flex">
        <GlassPanel className="shrink-0">
          <span className="text-xs font-medium tracking-[-0.08px] text-[#dbdbdb] lg:text-sm">
            About me
          </span>
        </GlassPanel>
        <GlassPanel className="shrink-0">
          <div className="flex items-center gap-4">
            {CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => activate(card.id)}
                className={`text-xs font-medium tracking-[-0.08px] transition-colors lg:text-sm ${
                  card.id === activeId ? "text-white" : "text-[#a6a6a6] hover:text-white"
                }`}
              >
                {card.tabLabel}
              </button>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Desktop: scattered photo cards on a "desk". Clicking a card grows
          it and moves it into the shared center-stage slot, then the info
          panel expands out beside it. */}
      <div ref={stageRef} className="relative mx-auto hidden h-[400px] w-full max-w-[1104px] md:block">
        {CARDS.map((card, index) => {
          const isActive = card.id === activeId;
          const isLifted = card.id === liftedId;
          const homeSlot = SLOTS[order.indexOf(card.id)];
          const slot = isActive ? EXPANDED_CARD : homeSlot;
          const style: CSSProperties = {
            left: `${slot.left}%`,
            top: `${slot.top}%`,
            width: `${slot.width}%`,
            height: `${slot.height}%`,
            // The lifted/active card floats above everything; the displaced
            // card slides underneath it into the vacated slot.
            zIndex: isLifted ? 30 : isActive ? 20 : homeSlot.z,
          };
          const restingRotate = isActive ? 0 : homeSlot.rotate;

          return (
            <motion.button
              key={card.id}
              type="button"
              layout
              onClick={() => activate(card.id)}
              initial={false}
              animate={
                inView
                  ? {
                      opacity: 1,
                      scale: isLifted ? 1.06 : 1,
                      x: 0,
                      y: 0,
                      rotate: restingRotate,
                      boxShadow: isLifted || isActive ? SHADOW_LIFTED : SHADOW_RESTING,
                    }
                  : {
                      opacity: 0,
                      scale: 0.5,
                      x: card.enter.x,
                      y: card.enter.y,
                      rotate: restingRotate + card.enter.extraRotate,
                      boxShadow: SHADOW_RESTING,
                    }
              }
              transition={
                settled
                  ? {
                      ...SETTLED_SPRING,
                      scale: { type: "spring", stiffness: 240, damping: 22 },
                      boxShadow: { duration: 0.35, ease: "easeOut" },
                    }
                  : { ...ENTRANCE_SPRING, delay: ENTRANCE_DELAY + (index + 1) * ENTRANCE_STAGGER }
              }
              className="absolute cursor-pointer rounded-2xl text-left"
              style={style}
            >
              <div className="size-full overflow-hidden rounded-2xl border-[0.5px] border-white/26 bg-gradient-to-b from-white/10 to-[#999999]/10 p-3 backdrop-blur-[48px]">
                {card.image ? (
                  <div className="relative size-full overflow-hidden rounded-xl">
                    <Image
                      src={card.image}
                      alt={card.tabLabel}
                      fill
                      sizes="440px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <BrainCollage />
                )}
              </div>
            </motion.button>
          );
        })}

        <AnimatePresence>
          {activeCard && (
            <motion.div
              key={activeCard.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ delay: 0.35, duration: 0.25 }}
              className="absolute flex flex-col gap-2.5"
              style={{
                left: `${EXPANDED_PANEL.left}%`,
                top: `${EXPANDED_PANEL.top}%`,
                width: `${EXPANDED_PANEL.width}%`,
                zIndex: 21,
              }}
            >
              <div className="rounded-md bg-[#004db2] px-6 py-3 shadow-[10px_10px_7.5px_rgba(0,0,0,0.15)]">
                <p className="text-sm font-medium tracking-[-0.08px] text-[#e9e9e9]">
                  {activeCard.panelTitle}
                </p>
                <div className="mt-2 flex flex-col gap-3 text-sm font-medium tracking-[-0.08px] text-[#e9e9e9]">
                  {activeCard.panelContent.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                aria-label="Close"
                className="flex size-8 shrink-0 items-center justify-center rounded-full border-[0.5px] border-white/26 bg-[rgba(255,0,0,0.58)] shadow-[0px_10px_5px_rgba(0,0,0,0.15)] backdrop-blur-[48px]"
              >
                <CloseIcon />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: tab pills + a swipeable stacked deck. Swiping the top
          card sends it to the back and reveals the next card + content. */}
      <div className="mx-auto flex max-w-md flex-col gap-5 md:hidden">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => bringToTop(card.id)}
              className={`rounded-2xl border-[0.5px] border-white/26 bg-gradient-to-b from-white/10 to-[#999999]/10 px-2.5 py-1 text-[11px] font-medium tracking-[-0.08px] backdrop-blur-[48px] transition-colors ${
                card.id === deck[0] ? "text-white" : "text-[#a6a6a6]"
              }`}
            >
              {card.tabLabel}
            </button>
          ))}
        </div>

        <div className="relative mx-auto h-[264px] w-full max-w-[320px]">
          {CARDS.map((card) => {
            const depth = deck.indexOf(card.id);
            const pose = DECK_POSES[depth];
            const isTop = depth === 0;
            return (
              <motion.div
                key={card.id}
                drag={isTop ? "x" : false}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) cycleDeck();
                }}
                animate={{ x: pose.x, rotate: pose.rotate, scale: pose.scale }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className="absolute top-1/2 left-1/2 h-[222px] w-[167px]"
                style={{
                  marginLeft: -83.5,
                  marginTop: -111,
                  zIndex: 40 - depth * 10,
                  touchAction: "pan-y",
                }}
              >
                <div className="size-full overflow-hidden rounded-2xl border-[0.5px] border-white/26 bg-gradient-to-b from-white/10 to-[#999999]/10 p-3 shadow-[0px_10px_5px_rgba(0,0,0,0.15)] backdrop-blur-[48px]">
                  {card.image ? (
                    <div className="pointer-events-none relative size-full overflow-hidden rounded-xl">
                      <Image src={card.image} alt={card.tabLabel} fill sizes="167px" className="object-cover" />
                    </div>
                  ) : (
                    <BrainCollage />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={topCard.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mx-auto w-full max-w-[280px] rounded-md bg-[#004db2] px-5 py-3 shadow-[10px_10px_7.5px_rgba(0,0,0,0.15)]"
          >
            <p className="text-sm font-medium tracking-[-0.08px] text-[#e9e9e9]">
              {topCard.panelTitle}
            </p>
            <div className="mt-2 flex flex-col gap-2.5 text-sm font-medium tracking-[-0.08px] text-[#e9e9e9]">
              {topCard.panelContent.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <p
        className="mt-10 hidden text-center text-lg text-muted-400 sm:text-xl md:block md:text-2xl"
        style={{ fontVariationSettings: '"wdth" 100' }}
      >
        *Tap to reveal
      </p>
    </section>
  );
}
