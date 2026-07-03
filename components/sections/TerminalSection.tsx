"use client";

import Container from "@/components/ui/Container";
import TerminalInterface from "@/components/ui/TerminalInterface";
import { Profile, Skill, Project } from "@/lib/data";

export default function TerminalSection({ profile, skills, projects }: { profile: Profile; skills: Skill[]; projects: Project[] }) {
    return (
        <section className="py-20 relative bg-background text-foreground transition-colors duration-300">
            <Container>
                <div className="max-w-4xl mx-auto w-full">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white mb-2">
                            Interactive Lab Terminal
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-sans flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                            Simulate active DevOps operations and query configuration states.
                        </p>
                    </div>
                    {/* Clean SaaS Card Wrapper */}
                    <div className="relative rounded-2xl bg-card border border-border overflow-hidden shadow-2xl transition-colors duration-300">
                        <TerminalInterface profile={profile} skills={skills} projects={projects} />
                    </div>
                </div>
            </Container>
        </section>
    );
}
