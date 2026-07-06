import Nav from "@/components/Nav";
import RevealSection from "@/components/RevealSection";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import AboutMe from "@/components/sections/AboutMe";
import MySpace from "@/components/sections/MySpace";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <RevealSection>
          <AboutMe />
        </RevealSection>
        <RevealSection>
          <MySpace />
        </RevealSection>
        <RevealSection>
          <Contact />
        </RevealSection>
      </main>
    </>
  );
}
