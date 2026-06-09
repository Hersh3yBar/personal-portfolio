import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Timeline } from "@/components/Timeline";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { GitHubRecent } from "@/components/GitHubRecent";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { EasterEggs } from "@/components/EasterEggs";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SideMeta } from "@/components/SideMeta";

export default function Home() {
  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <ScrollProgress />
      <CustomCursor />
      <EasterEggs />
      <SideMeta />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Timeline />
        <Skills />
        <Projects />
        <GitHubRecent />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
