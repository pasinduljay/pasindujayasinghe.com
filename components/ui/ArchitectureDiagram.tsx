"use client";

import { motion } from "framer-motion";
import { Database, ShieldCheck, Users, Lock } from "lucide-react";

export default function ArchitectureDiagram() {
    return (
        // Dark Mode: Gradient Border Wrapper
        <div className="w-full h-full">
            <style jsx>{`
                @keyframes flow-mobile {
                    0% { top: -100%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes flow-desktop {
                    0% { left: -50%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
                .mobile-flow {
                    animation: flow-mobile 2s linear infinite;
                }
                .desktop-flow {
                    animation: flow-desktop 2.5s linear infinite;
                }
            `}</style>
            {/* Inner Content Card */}
            <div className="w-full h-full p-6 bg-card border border-border rounded-xl relative overflow-hidden font-sans text-xs select-none shadow-sm dark:shadow-none transition-colors duration-300">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-8 relative z-10 font-semibold text-[10px]">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                        Infrastructure Map
                    </span>
                    <span className="font-mono text-[9px]">REGION: AP-SOUTH-1</span>
                </div>

                {/* Diagram Container */}
                <div className="flex flex-col sm:flex-row items-center justify-between relative z-10 px-4 h-auto sm:h-64 gap-4 sm:gap-0 py-8 sm:py-0">

                    {/* 1. Client */}
                    <div className="flex flex-col items-center gap-2 group cursor-pointer z-20">
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-black/40 border border-border flex items-center justify-center transition-all duration-300">
                            <Users className="w-6 h-6 text-zinc-400 dark:text-zinc-500 group-hover:text-[#10b981] transition-colors" />
                        </div>
                        <span className="text-zinc-500 dark:text-zinc-500 font-semibold text-[10px]">CLIENT</span>
                    </div>

                    {/* Connection 1: Client <-> Cloudflare */}
                    <div className="flex-none sm:flex-1 flex flex-col justify-center items-center gap-3 relative mx-2 sm:-translate-y-3 w-full sm:w-auto h-24 sm:h-auto">
                        <div className="relative w-[1.5px] h-full sm:w-full sm:h-[1.5px] bg-zinc-200 dark:bg-zinc-800/80 rounded-full overflow-hidden">
                            <div className="w-full h-full relative">
                                {/* Mobile Line */}
                                <motion.div
                                    className="sm:hidden absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#10b981] to-transparent"
                                    animate={{ top: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                                {/* Desktop Line */}
                                <motion.div
                                    className="hidden sm:block absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-[#10b981] to-transparent"
                                    animate={{ left: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        </div>

                        {/* Secure Lock Ingress - Centered */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-1.5 rounded-full border border-border z-10">
                            <Lock className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                        </div>
                    </div>

                    {/* 2. Cloudflare/CDN */}
                    <div className="flex flex-col items-center gap-2 group cursor-pointer z-20">
                        <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-black/40 border border-border flex items-center justify-center transition-all duration-300">
                            <ShieldCheck className="w-8 h-8 text-zinc-400 dark:text-zinc-500 group-hover:text-[#10b981] transition-colors" />
                        </div>
                        <span className="text-zinc-500 dark:text-zinc-500 font-semibold text-[10px]">CLOUDFLARE</span>
                    </div>

                    {/* Connection 2: Cloudflare <-> Edge */}
                    <div className="flex-none sm:flex-1 flex flex-col justify-center items-center gap-3 relative mx-2 sm:-translate-y-3 w-full sm:w-auto h-24 sm:h-auto">
                        <div className="relative w-[1.5px] h-full sm:w-full sm:h-[1.5px] bg-zinc-200 dark:bg-zinc-800/80 rounded-full overflow-hidden">
                            <div className="w-full h-full relative">
                                {/* Mobile Line */}
                                <motion.div
                                    className="sm:hidden absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#10b981] to-transparent"
                                    animate={{ top: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                                />
                                {/* Desktop Line */}
                                <motion.div
                                    className="hidden sm:block absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-[#10b981] to-transparent"
                                    animate={{ left: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Secure Lock Egress - Centered */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-1.5 rounded-full border border-border z-10">
                            <Lock className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                        </div>
                    </div>

                    {/* 3. Vercel/Compute */}
                    <div className="flex flex-col items-center gap-2 group cursor-pointer z-20">
                        <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-black/40 border border-border flex items-center justify-center transition-all duration-300">
                            <svg className="w-8 h-8 text-zinc-400 dark:text-zinc-500 group-hover:text-[#10b981] transition-colors" viewBox="0 0 76 65" fill="currentColor"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" /></svg>
                        </div>
                        <span className="text-zinc-500 dark:text-zinc-500 font-semibold text-[10px]">EDGE_COMPUTE</span>
                    </div>

                    {/* Connection 3: Edge <-> Database */}
                    <div className="flex-none sm:flex-1 flex flex-col justify-center items-center gap-3 relative mx-2 sm:-translate-y-3 w-full sm:w-auto h-24 sm:h-auto">
                        <div className="relative w-[1.5px] h-full sm:w-full sm:h-[1.5px] bg-zinc-200 dark:bg-zinc-800/80 rounded-full overflow-hidden">
                            <div className="w-full h-full relative">
                                {/* Mobile Line */}
                                <motion.div
                                    className="sm:hidden absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#10b981] to-transparent"
                                    animate={{ top: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                                />
                                {/* Desktop Line */}
                                <motion.div
                                    className="hidden sm:block absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-[#10b981] to-transparent"
                                    animate={{ left: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. Database */}
                    <div className="flex flex-col items-center gap-2 group cursor-pointer z-20">
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-black/40 border border-border flex items-center justify-center transition-all duration-300">
                            <Database className="w-6 h-6 text-zinc-400 dark:text-zinc-500 group-hover:text-[#10b981] transition-colors" />
                        </div>
                        <span className="text-zinc-500 dark:text-zinc-500 font-semibold text-[10px]">DATABASE</span>
                    </div>

                </div>

                {/* Floating particles background hint */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800/40 to-transparent -z-0 opacity-50 transition-colors duration-300" />
            </div>
        </div>
    );
}
