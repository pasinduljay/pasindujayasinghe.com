"use client";

import Container from "@/components/ui/Container";
import { motion } from "framer-motion";
import { 
    Github,
    Users,
    Terminal,
    Shield,
    Plus,
    Sparkles,
    Globe,
    Check
} from "lucide-react";

// High-fidelity SVG logos for CI/CD & Cloud stack
const DockerLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="14" width="4" height="3.5" rx="0.5" />
        <rect x="7.5" y="14" width="4" height="3.5" rx="0.5" />
        <rect x="13" y="14" width="4" height="3.5" rx="0.5" />
        <rect x="18.5" y="14" width="4" height="3.5" rx="0.5" />
        <rect x="4.75" y="9.5" width="4" height="3.5" rx="0.5" />
        <rect x="10.25" y="9.5" width="4" height="3.5" rx="0.5" />
        <rect x="15.75" y="9.5" width="4" height="3.5" rx="0.5" />
        <rect x="7.5" y="5" width="4" height="3.5" rx="0.5" />
    </svg>
);

const VercelLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 19.5h20L12 2z" />
    </svg>
);

const OracleLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 6A6 6 0 0 1 16.5 18H7.5A6 6 0 0 1 7.5 6H16.5ZM7.5 4A8 8 0 0 0 7.5 20H16.5A8 8 0 0 0 16.5 4H7.5Z" />
    </svg>
);

const GatewayLogo = ({ className = "w-3 h-3" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export default function FeaturedSystemsLayout({ projects: _projects }: { projects?: any }) {
    return (
        <section id="systems" className="relative py-28 bg-background text-foreground transition-colors duration-300">
            <Container>
                {/* Section Header */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3.5 mb-4"
                    >
                        <div className="h-[1.5px] w-10 bg-[#10b981]" />
                        <span className="text-[#10b981] font-sans text-xs font-bold tracking-wider uppercase">System Architecture</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white font-sans"
                    >
                        Systems infrastructure, ready for enterprise deployment
                    </motion.h2>
                </div>

                {/* 5-Card Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 w-full">
                    
                    {/* Card 1: Multi-Cloud Deployments (Spans 3 cols on md) */}
                    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[480px] md:col-span-3">
                        <div className="space-y-2 max-w-md">
                            <div className="flex flex-col sm:flex-row sm:items-center items-start gap-1.5 sm:gap-2">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans">
                                    Multi-Cloud Deployments
                                </h3>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200/50 dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-500 border border-border whitespace-nowrap">
                                    hybrid infrastructure
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                                Unified CI/CD pipelines orchestrating self-hosted runners, security scans, and multi-cloud delivery via GitHub.
                            </p>
                        </div>

                        {/* Connection Diagram Container */}
                        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden pt-4 select-none">
                            <style jsx>{`
                                @keyframes flow-dash {
                                    to {
                                        stroke-dashoffset: -32;
                                    }
                                }
                                .animate-flow-dash {
                                    stroke-dasharray: 6 10;
                                    animation: flow-dash 1.8s linear infinite;
                                }
                            `}</style>
                            
                            <div className="relative w-[500px] h-[320px] shrink-0 scale-[0.55] min-[375px]:scale-[0.65] min-[425px]:scale-[0.75] sm:scale-90 md:scale-100 origin-center">
                                {/* SVG Connector Lines */}
                                <svg className="absolute inset-0 w-full h-full text-zinc-200 dark:text-zinc-800" viewBox="0 0 500 320" fill="none">
                                    {/* Curved Paths Center to Outers */}
                                    <path d="M 250 160 C 170 160, 170 60, 90 60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                                    <path d="M 250 160 L 60 160" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                                    <path d="M 250 160 C 170 160, 170 260, 90 260" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                                    <path d="M 250 160 C 330 160, 330 60, 410 60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                                    <path d="M 250 160 L 440 160" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                                    <path d="M 250 160 C 330 160, 330 260, 410 260" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />

                                    {/* Animated light pulses running outward */}
                                    <path d="M 250 160 C 170 160, 170 60, 90 60" stroke="#10b981" strokeWidth="1.5" className="animate-flow-dash opacity-60" />
                                    <path d="M 250 160 L 60 160" stroke="#10b981" strokeWidth="1.5" className="animate-flow-dash opacity-60" />
                                    <path d="M 250 160 C 170 160, 170 260, 90 260" stroke="#10b981" strokeWidth="1.5" className="animate-flow-dash opacity-60" />
                                    <path d="M 250 160 C 330 160, 330 60, 410 60" stroke="#10b981" strokeWidth="1.5" className="animate-flow-dash opacity-60" />
                                    <path d="M 250 160 L 440 160" stroke="#10b981" strokeWidth="1.5" className="animate-flow-dash opacity-60" />
                                    <path d="M 250 160 C 330 160, 330 260, 410 260" stroke="#10b981" strokeWidth="1.5" className="animate-flow-dash opacity-60" />
                                </svg>

                                {/* Center Hub Node - GitHub */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                    <div className="w-14 h-14 bg-background border-2 border-border shadow-lg rounded-xl flex items-center justify-center relative group hover:border-[#10b981]/50 transition-colors">
                                        <div className="absolute inset-0 rounded-xl bg-[#10b981]/5 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center shadow-sm">
                                            <Github className="w-4 h-4 text-white dark:text-zinc-900" />
                                        </div>
                                    </div>
                                </div>

                                {/* Outer Integration Nodes */}
                                {/* Top-Left: Developers */}
                                <div className="absolute left-[8%] top-[10%]">
                                    <div className="flex items-center gap-2 bg-background border border-border px-3.5 py-1.5 rounded-lg shadow-sm hover:border-[#10b981]/30 transition-colors text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                        <Users className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                                        <span>Developers</span>
                                    </div>
                                </div>

                                {/* Mid-Left: Self-hosted Runners */}
                                <div className="absolute left-[4%] top-[43%]">
                                    <div className="flex items-center justify-center w-10 h-10 bg-background border border-border rounded-lg shadow-sm hover:border-[#10b981]/30 transition-colors" title="Private Runners">
                                        <Terminal className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                                    </div>
                                </div>

                                {/* Bottom-Left: Semgrep */}
                                <div className="absolute left-[8%] bottom-[10%]">
                                    <div className="flex items-center gap-2 bg-background border border-border px-3.5 py-1.5 rounded-lg shadow-sm hover:border-[#10b981]/30 transition-colors text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                        <Shield className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                                        <span>Semgrep</span>
                                    </div>
                                </div>

                                {/* Top-Right: Oracle Cloud */}
                                <div className="absolute right-[8%] top-[10%]">
                                    <div className="flex items-center gap-2 bg-background border border-border px-3.5 py-1.5 rounded-lg shadow-sm hover:border-[#10b981]/30 transition-colors text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                        <OracleLogo className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                                        <span>Oracle Cloud</span>
                                    </div>
                                </div>

                                {/* Mid-Right: Docker Registry */}
                                <div className="absolute right-[4%] top-[43%]">
                                    <div className="flex items-center justify-center w-10 h-10 bg-background border border-border rounded-lg shadow-sm hover:border-[#10b981]/30 transition-colors" title="Docker Registry">
                                        <DockerLogo className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                                    </div>
                                </div>

                                {/* Bottom-Right: Vercel */}
                                <div className="absolute right-[8%] bottom-[10%]">
                                    <div className="flex items-center gap-2 bg-background border border-border px-3.5 py-1.5 rounded-lg shadow-sm hover:border-[#10b981]/30 transition-colors text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                        <VercelLogo className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                                        <span>Vercel</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Secure Access Gateways (Spans 3 cols on md) */}
                    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[480px] md:col-span-3">
                        <div className="space-y-2 max-w-md">
                            <div className="flex flex-col sm:flex-row sm:items-center items-start gap-1.5 sm:gap-2">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans">
                                    Secure Access Gateways
                                </h3>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200/50 dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-500 border border-border whitespace-nowrap">
                                    zero trust policies
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                                encrypted private links and VPN tunnels with zero-trust access policies.
                            </p>
                        </div>

                        {/* Stacked Windows Visualizer */}
                        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden pt-6 select-none">
                            <div className="relative w-[460px] h-[240px] shrink-0 scale-[0.6] min-[375px]:scale-[0.7] min-[425px]:scale-[0.8] sm:scale-90 md:scale-100 origin-center">
                                
                                {/* 1. Back Window (wireguard) */}
                                <div className="absolute left-[3%] top-[0%] w-[84%] h-[180px] bg-background/30 dark:bg-zinc-900/30 border border-border/40 rounded-2xl shadow transform -rotate-2 scale-95 opacity-55 flex flex-col overflow-hidden">
                                    <div className="px-4 py-2 border-b border-border/40 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/25" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/25" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/25" />
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[8px] font-mono text-zinc-400/50">
                                            <span>wireguard</span>
                                            <Plus size={8} />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Middle Window (cloudflare) */}
                                <div className="absolute left-[7%] top-[8%] w-[86%] h-[190px] bg-background/60 dark:bg-zinc-900/60 border border-border/70 rounded-2xl shadow transform rotate-1.5 scale-[0.98] opacity-75 flex flex-col overflow-hidden">
                                    <div className="px-4 py-2 border-b border-border/60 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[8px] font-mono text-zinc-400/70">
                                            <span>cloudflare</span>
                                            <Plus size={8} />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Front Active Window (gateways / Private Network) */}
                                <div className="absolute left-[10%] top-[16%] w-[90%] h-[200px] bg-background border border-border rounded-2xl shadow-2xl z-10 flex flex-col overflow-hidden transition-colors duration-300">
                                    {/* Window Header */}
                                    <div className="px-4 py-2.5 border-b border-border bg-black/[0.02] dark:bg-black/20 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 dark:text-zinc-400">
                                            <span>gateways</span>
                                            <div className="h-2 w-[1px] bg-border" />
                                            <GatewayLogo className="w-2.5 h-2.5 text-zinc-500 dark:text-zinc-400" />
                                            <span>Private Network</span>
                                            <Plus size={9} className="text-zinc-400" />
                                        </div>
                                    </div>

                                    {/* Active Area: Dual cards side-by-side */}
                                    <div className="p-4 grid grid-cols-2 gap-3 flex-grow bg-transparent text-left font-sans text-xs">
                                        {/* Card 1 */}
                                        <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between transition-colors shadow-sm relative group/item">
                                            <div className="space-y-1">
                                                <div className="text-[10px] text-zinc-900 dark:text-white font-bold leading-tight font-sans">
                                                    Private Bastion Link
                                                </div>
                                                <div className="text-[9px] text-zinc-500 dark:text-zinc-400">
                                                    Peer Tunnel: 10.0.12.4
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400 pt-2 border-t border-border mt-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span>WireGuard</span>
                                            </div>
                                        </div>

                                        {/* Card 2 */}
                                        <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between transition-colors shadow-sm relative group/item">
                                            <div className="space-y-1">
                                                <div className="text-[10px] text-zinc-900 dark:text-white font-bold leading-tight font-sans">
                                                    Access Proxy Tunnel
                                                </div>
                                                <div className="text-[9px] text-zinc-500 dark:text-zinc-400">
                                                    Status: TLS 1.3 encrypted
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400 pt-2 border-t border-border mt-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span>Cloudflare</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Card 3: System Observability (Spans 2 cols on md) */}
                    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[380px] md:col-span-2">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans">
                                System Observability
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                                telemetry sync with active Grafana dashboards & alerts.
                            </p>
                        </div>

                        {/* Chat / Event log mockup */}
                        <div className="border border-border bg-background/50 dark:bg-black/10 rounded-2xl p-4 space-y-3 flex-grow flex flex-col justify-center mt-6">
                            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                <div className="flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">AlertManager</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                    <span className="text-[9px] font-mono text-zinc-400">Active Checks</span>
                                </div>
                            </div>

                            <div className="space-y-2 flex-grow flex flex-col justify-end text-[10px] leading-relaxed">
                                {/* Event log bubble */}
                                <div className="self-end max-w-[85%] bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-1.5 text-zinc-800 dark:text-zinc-200">
                                    Container load spikes on node-01-api
                                </div>

                                {/* Automated Response card */}
                                <div className="self-start max-w-[90%] bg-card border border-border rounded-xl p-3 space-y-1.5 shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 rounded bg-[#10b981] flex items-center justify-center text-white text-[8px] font-bold">
                                            AS
                                        </div>
                                        <span className="font-sans font-bold text-zinc-900 dark:text-white text-[9px]">Ansible System</span>
                                    </div>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-[10px] leading-relaxed">
                                        Executing automated scaling rule. Provisioned extra API replicas on k8s-cluster. Uptime remains at 99.98%.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: DevOps Pipelines (Spans 2 cols on md) */}
                    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[380px] md:col-span-2">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans">
                                DevOps Pipelines
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                                automated testing & security scans on code commit.
                            </p>
                        </div>

                        {/* DevOps Pipeline Visual */}
                        <div className="space-y-4 flex-grow flex flex-col justify-center mt-6">
                            {/* Jenkins Job status */}
                            <div className="bg-background/80 dark:bg-black/20 border border-border rounded-xl p-3 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="text-[8px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">JENKINS RUNNER</div>
                                    <div className="text-[10px] font-mono text-zinc-700 dark:text-zinc-300">build_and_scan: success</div>
                                </div>
                                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-[#10b981]">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                            </div>

                            {/* Dynamic node connection map */}
                            <div className="relative h-24 flex items-center justify-center">
                                {/* Horizontal line */}
                                <div className="absolute left-[20%] right-[20%] h-[1px] border-t border-dashed border-border" />
                                
                                <div className="flex justify-between items-center w-full px-4 relative z-10">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center shadow-sm relative group hover:border-[#10b981]/40 transition-colors">
                                            <Terminal className="w-4 h-4 text-zinc-500" />
                                            <div className="absolute -inset-1 rounded-full bg-zinc-500/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-[8px] font-mono text-zinc-500">Git Push</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center shadow-sm relative">
                                            <div className="absolute inset-0 rounded-full bg-[#10b981]/5 animate-pulse" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                                        </div>
                                        <span className="text-[8px] font-mono text-[#10b981] font-semibold">SonarQube</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center shadow-sm relative group hover:border-[#10b981]/40 transition-colors">
                                            <Globe className="w-4 h-4 text-zinc-500" />
                                            <div className="absolute -inset-1 rounded-full bg-[#10b981]/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-[8px] font-mono text-zinc-500">Registry</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 5: Infrastructure Telemetry (Spans 2 cols on md) */}
                    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[380px] md:col-span-2">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans">
                                Infrastructure Telemetry
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                                real-time resource consumption metrics.
                            </p>
                        </div>

                        {/* Gauge and charts visual */}
                        <div className="grid grid-cols-2 gap-4 items-center flex-grow mt-6">
                            {/* Left Side: Semi-circular progress gauge */}
                            <div className="flex flex-col items-center justify-center relative">
                                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" className="text-zinc-100 dark:text-zinc-800" fill="transparent" />
                                    <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="37.6" strokeLinecap="round" fill="transparent" />
                                </svg>
                                <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-sm font-bold font-mono text-zinc-900 dark:text-white">85%</span>
                                    <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-wider">Memory Pool</span>
                                </div>
                            </div>

                            {/* Right Side: Horizontal bar chart representation */}
                            <div className="h-24 flex items-end justify-between px-2 pt-4 bg-background/40 dark:bg-black/10 rounded-xl border border-border/50">
                                <div className="flex flex-col items-center gap-1.5 w-3.5">
                                    <div className="w-full bg-[#10b981]/30 rounded-t-sm h-12 hover:bg-[#10b981] transition-colors animate-pulse" />
                                    <span className="text-[7px] font-mono text-zinc-400">M1</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 w-3.5">
                                    <div className="w-full bg-[#10b981]/40 rounded-t-sm h-14 hover:bg-[#10b981] transition-colors" />
                                    <span className="text-[7px] font-mono text-zinc-400">M2</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 w-3.5">
                                    <div className="w-full bg-[#10b981]/70 rounded-t-sm h-16 hover:bg-[#10b981] transition-colors animate-pulse" />
                                    <span className="text-[7px] font-mono text-zinc-400">M3</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 w-3.5">
                                    <div className="w-full bg-[#10b981] rounded-t-sm h-20 hover:bg-[#10b981] transition-colors" />
                                    <span className="text-[7px] font-mono text-zinc-550 font-bold">M4</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
