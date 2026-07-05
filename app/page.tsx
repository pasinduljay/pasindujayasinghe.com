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

import { headers } from "next/headers";
import { checkIpBlock } from "@/lib/security";

export const dynamic = "force-dynamic";

export default async function Home() {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0] || headerList.get("x-real-ip") || "127.0.0.1";

  const blockCheck = await checkIpBlock(ip);

  if (blockCheck.blocked) {
    return (
      <main className="min-h-screen bg-background text-foreground font-sans relative">
        <Preloader isBlocked={true} blockReason={blockCheck.reason} />
      </main>
    );
  }

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

