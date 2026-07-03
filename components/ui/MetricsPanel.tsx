"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, Volume2 } from "lucide-react";

interface MetricsPanelProps {
    isAmbientMode?: boolean;
    onToggleAmbient?: () => void;
}

export default function MetricsPanel({ isAmbientMode = false, onToggleAmbient }: MetricsPanelProps) {
    const [cpuData, setCpuData] = useState<number[]>(new Array(40).fill(2));
    const [memory, setMemory] = useState(2.1);
    const [requests, setRequests] = useState(42);

    // Simulate real-time data
    useEffect(() => {
        let isVisible = false;

        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        }, { threshold: 0 });

        const element = document.getElementById('metrics-panel');
        if (element) observer.observe(element);

        const interval = setInterval(() => {
            if (!isVisible) return; // Pause updates if off-screen

            // CPU: Low usage (1-5%) for 4 CPU core server
            setCpuData(prev => {
                const newValue = Math.max(0.5, Math.min(8, prev[prev.length - 1] + (Math.random() - 0.5) * 2));
                return [...prev.slice(1), newValue];
            });

            // Memory: Steady around 2GB (OS + App)
            setMemory(prev => Math.max(1.8, Math.min(2.5, prev + (Math.random() - 0.5) * 0.1)));

            // Requests: Very slow increment (30-40 visitors/day = ~1.5/hour)
            // Only increment 5% of the time per tick
            if (Math.random() > 0.95) {
                setRequests(prev => prev + 1);
            }
        }, 800);

        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, []);

    // Generate Path for SVG
    const generatePath = (data: number[]) => {
        const width = 100;
        const height = 50;
        const step = width / (data.length - 1);

        const path = data.map((val, i) => {
            const x = i * step;
            const y = height - (val / 100) * height;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(" ");

        return `${path} L 100 50 L 0 50 Z`; // Close path for area fill
    };

    return (
        <div id="metrics-panel" className="w-full h-full">
            <div className="w-full h-full p-6 bg-card border border-border rounded-xl flex flex-col justify-between gap-6 font-sans text-xs shadow-sm dark:shadow-none transition-colors duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-2 gap-4 sm:gap-0 font-semibold text-[10px]">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                            Live Metrics
                        </span>

                        {/* Mobile Ambient Toggle */}
                        <button
                            onClick={onToggleAmbient}
                            className={`flex sm:hidden items-center gap-2 px-2 py-1 rounded-full text-[10px] font-bold border transition-all ${isAmbientMode
                                ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                                : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                                }`}
                        >
                            {isAmbientMode ? <Volume2 size={12} className="animate-pulse" /> : <Server size={12} />}
                            {isAmbientMode ? "SOUND: ON" : "AMBIENT"}
                        </button>
                    </div>
                    <span className="font-mono text-[9px]">ID: SRV-09</span>
                </div>

                {/* CPU Graph */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[#10b981] font-bold">
                        <span>CPU Load</span>
                        <span className="font-mono">{cpuData[cpuData.length - 1].toFixed(1)}%</span>
                    </div>
                    <div className="h-24 w-full bg-zinc-100 dark:bg-black/40 rounded border border-border relative overflow-hidden transition-colors duration-300">
                        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="cpuGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                d={generatePath(cpuData)}
                                fill="url(#cpuGradient)"
                                stroke="#10b981"
                                strokeWidth="1.5"
                                vectorEffect="non-scaling-stroke"
                                initial={{ d: "M 0 50 L 100 50" }}
                                animate={{ d: generatePath(cpuData) }}
                                transition={{ ease: "linear", duration: 0.8 }}
                            />
                        </svg>
                    </div>
                </div>

                {/* Memory & Latency Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Memory */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-zinc-500 font-semibold text-[10px]">
                            <span>MEM Usage</span>
                            <span className="text-zinc-800 dark:text-zinc-300 font-bold font-mono">{memory.toFixed(1)}G/24G</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-200 dark:bg-black/30 rounded-full overflow-hidden transition-colors duration-300 border border-border">
                            <motion.div
                                className="h-full bg-[#10b981]"
                                animate={{ width: `${(memory / 24) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Latency */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-zinc-500 font-semibold text-[10px]">
                            <span>Latency</span>
                            <span className="text-zinc-800 dark:text-zinc-300 font-bold font-mono">24ms</span>
                        </div>
                        <div className="flex gap-0.5 h-1.5 items-end">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`flex-1 rounded-sm ${i < 4 ? 'bg-[#10b981]' : 'bg-zinc-200 dark:bg-zinc-900'} h-full transition-colors duration-300`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Storage Row */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-zinc-500 font-semibold text-[10px]">
                        <span>Storage Allocation</span>
                        <span className="text-zinc-800 dark:text-zinc-300 font-bold font-mono">{4.2.toFixed(1)}G/200G</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-black/30 rounded-full overflow-hidden transition-colors duration-300 border border-border">
                        <motion.div
                            className="h-full bg-zinc-400 dark:bg-zinc-500"
                            initial={{ width: "2%" }}
                            animate={{ width: `${(4.2 / 200) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Stats Footer */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border text-zinc-500 text-[10px] font-semibold">
                    <div>
                        <div>Uptime Ratio</div>
                        <div className="text-xl text-zinc-800 dark:text-white font-bold font-mono">99.99<span className="text-zinc-400 dark:text-zinc-600 text-sm">%</span></div>
                    </div>
                    <div>
                        <div>Request Total</div>
                        <div className="text-xl text-zinc-800 dark:text-white font-bold font-mono">{requests.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
