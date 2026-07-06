"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Osmo Supply "Welcoming Words Loader", adapted for React: the markup,
// data attributes, and GSAP timeline are kept as authored — only the
// DOMContentLoaded init is swapped for a mount effect, and GSAP comes
// from the npm package instead of the CDN script.
export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadingContainer = containerRef.current;
    if (!loadingContainer) return; // Stop animation when no [data-loading-words] is found

    const loadingWords = loadingContainer.querySelector<HTMLElement>("[data-loading-words]");
    if (!loadingWords) return;
    const wordsTarget = loadingWords.querySelector<HTMLElement>("[data-loading-words-target]");
    if (!wordsTarget) return;
    const words = (loadingWords.getAttribute("data-loading-words") ?? "")
      .split(",")
      .map((w) => w.trim());

    const tl = gsap.timeline();

    tl.set(loadingWords, {
      yPercent: 50,
    });

    tl.to(loadingWords, {
      opacity: 1,
      yPercent: 0,
      duration: 1,
      ease: "Expo.easeInOut",
    });

    words.forEach((word) => {
      tl.call(
        () => {
          wordsTarget.textContent = word;
        },
        undefined,
        "+=0.15"
      );
    });

    tl.to(loadingWords, {
      opacity: 0,
      yPercent: -75,
      duration: 0.8,
      ease: "Expo.easeIn",
    });

    tl.to(
      loadingContainer,
      {
        autoAlpha: 0,
        duration: 0.6,
        ease: "Power1.easeInOut",
      },
      "+ -0.2"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} data-loading-container="" className="loading-container">
      <div className="loading-screen">
        <div
          data-loading-words="Hello, Bonjour, स्वागत हे, Ciao, Olá, おい, Hallå, Guten tag, Hallo, See the design from my desk"
          className="loading-words"
        >
          <div className="loading-words__dot"></div>
          <p data-loading-words-target="" className="loading-words__word">
            Hello
          </p>
        </div>
      </div>
    </div>
  );
}
