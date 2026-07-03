import { getPortfolioData } from "@/lib/data";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import TerminalSection from "@/components/sections/TerminalSection";
import Workflow from "@/components/sections/Workflow";
import GithubCity from "@/components/sections/GithubCity";
import SystemMonitor from "@/components/sections/SystemMonitor";
import Footer from "@/components/sections/Footer";
import Preloader from "@/components/ui/Preloader";
import RecruiterVault from "@/components/ui/RecruiterVault";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <main className="min-h-screen bg-background text-foreground font-sans relative transition-colors duration-300">
      <Preloader />



      <ScrollToTop />

      <Hero profile={data.profile} skills={data.skills} projects={data.projects} />
      <Projects projects={data.projects} />
      <TerminalSection profile={data.profile} skills={data.skills} projects={data.projects} />
      <Workflow />
      <SystemMonitor />
      <RecruiterVault profile={data.profile} />
      <GithubCity />
      <Footer profile={data.profile} />
    </main>
  );
}

