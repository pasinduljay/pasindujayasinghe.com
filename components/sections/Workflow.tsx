"use client";

// Performance optimized - lightweight scroll-linked pipeline

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import { FaDocker } from "react-icons/fa";
import { VscCode } from "react-icons/vsc";
import { SiGithubactions, SiSonarcloud, SiKubernetes } from "react-icons/si";

const steps = [
    {
        id: 1,
        title: "Containerization",
        description: "Encapsulating applications with Docker to ensure consistency across environments. Building optimized images.",
        icon: <FaDocker size={28} className="text-cyber-green" />,
        side: "right",
    },
    {
        id: 2,
        title: "Build & Test",
        description: "Automated CI pipelines trigger on commit. Running unit tests, integration tests, and building artifacts.",
        icon: <VscCode size={28} className="text-cyber-green" />,
        side: "left",
    },
    {
        id: 3,
        title: "Pipeline Integration",
        description: "Orchestrating workflows with Jenkins/GitHub Actions. Managing secrets, dependencies, and environment configurations.",
        icon: <SiGithubactions size={28} className="text-cyber-green" />,
        side: "right",
    },
    {
        id: 4,
        title: "Security & Scan",
        description: "Shift-left security using Trivy and SonarQube. Scanning images and code for vulnerabilities before prod.",
        icon: <SiSonarcloud size={28} className="text-cyber-green" />,
        side: "left",
    },
    {
        id: 5,
        title: "Production Deploy",
        description: "Blue/Green or Canary deployments with manual approval gates. Zero-downtime rollout to Kubernetes.",
        icon: <SiKubernetes size={28} className="text-cyber-green" />,
        side: "right",
    },
];

export default function Workflow() {
    return (
        <section id="workflow" className="relative py-32 bg-background text-foreground transition-colors duration-300 overflow-hidden">
            {/* Faint responsive background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <Container>
                <div className="text-center mb-24 relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl md:text-4xl font-bold mb-4 tracking-tight font-sans text-zinc-900 dark:text-white"
                    >
                        Pipeline Architecture <span className="text-[#10B981]">Workflow</span>
                    </motion.h2>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-sm font-sans">
                        Frictionless continuous integration and deployment pipeline automation.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto px-4 md:px-0">
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;
                        const isRight = step.side === "right";
                        const nextIsRight = !isLast && steps[index + 1].side === "right";

                        return (
                            <div key={step.id}>
                                <div className={`flex w-full ${isRight ? "justify-end" : "justify-start"} relative z-20`}>
                                    <PipelineCard step={step} />
                                </div>

                                {!isLast && (
                                    <div className="h-12 md:h-40 w-full relative z-10 pointer-events-none flex items-center justify-center">
                                        {/* Simple vertical connection line for mobile */}
                                        <div className="w-[1px] h-full bg-zinc-200 dark:bg-zinc-800 md:hidden" />
                                        
                                        {/* Desktop pipeline curves */}
                                        <div className="hidden md:block w-full h-full">
                                            <PipelineConnector
                                                fromSide={isRight ? "right" : "left"}
                                                toSide={nextIsRight ? "right" : "left"}
                                                index={index}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}

// In PipelineCard
type PipelineStep = typeof steps[0];

function PipelineCard({ step }: { step: PipelineStep }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-10%", once: true }}
            transition={{ duration: 0.3 }}
            className="relative w-full md:w-[45%] group"
            style={{ willChange: "transform" }} // GPU acceleration hint
        >
            <Card variant="glass" className="p-8 hover:border-zinc-300 dark:hover:border-white/10 transition-colors duration-300 bg-card/60 border border-border">
                <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-white/[0.02] border border-border flex items-center justify-center rounded-xl text-[#10B981]">
                        {step.icon}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-wide font-sans">{step.title}</h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs font-sans select-text">{step.description}</p>
            </Card>
        </motion.div>
    );
}

function PipelineConnector({ fromSide, toSide, index }: { fromSide: "left" | "right"; toSide: "left" | "right"; index: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 80%", "end 45%"]
    });

    // Reduced damping for lighter physics calculation
    const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 20, restDelta: 0.001 });

    const fromX = fromSide === "right" ? 77.5 : 22.5;
    const toX = toSide === "right" ? 77.5 : 22.5;

    const pathD = `M ${fromX} 0 C ${fromX} 30, ${fromX} 40, ${(fromX + toX) / 2} 50 C ${toX} 60, ${toX} 70, ${toX} 100`;

    return (
        <div ref={containerRef} className="w-full h-full relative pointer-events-none">
            <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ willChange: "transform" }} // GPU hint
            >
                <defs>
                    <linearGradient id={`e-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(16,185,129,0)" />
                        <stop offset="50%" stopColor="rgba(16,185,129,1)" />
                        <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                    </linearGradient>
                </defs>

                {/* Faint single line connector */}
                <path
                    d={pathD}
                    fill="none"
                    className="stroke-zinc-200 dark:stroke-zinc-800/80"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Animated progress indicator */}
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke={`url(#e-${index})`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ pathLength, willChange: "auto" }}
                />
            </svg>
        </div>
    );
}
