"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Calendar } from "lucide-react";

interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

interface ContributionData {
    total: {
        [year: string]: number;
    };
    contributions: ContributionDay[];
}

export default function GithubCity() {
    const [data, setData] = useState<ContributionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
    // Limit to the last ~100-150 days or so to keep the "city" manageable widely
    // or we can show a full year in a grid.
    // For a nice isometric view, a 14x7 or 20x7 grid usually looks good.
    // Let's grab the last 20 weeks (140 days).
    const [cityDays, setCityDays] = useState<ContributionDay[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch data for 'pasinduljay'
                const res = await fetch('https://github-contributions-api.jogruber.de/v4/pasinduljay?y=last');
                const json = await res.json();

                // The API returns contributions for the whole last year (or YTD).
                // Let's filter for the last 150 days to make a nice city block.
                const allContributions = json.contributions;
                const last150 = allContributions.slice(allContributions.length - 150);

                setData(json);
                setCityDays(last150);
            } catch (error) {
                console.error("Failed to fetch GitHub data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getBuildingHeight = (count: number) => {
        if (count === 0) return 4; // Flat ground
        // Scale height: max height around 60-80px for high contributions
        return Math.min(count * 8 + 8, 80);
    };

    const getBuildingColor = (level: number) => {
        switch (level) {
            case 0: return "bg-zinc-200 dark:bg-zinc-900/30"; // Empty
            case 1: return "bg-emerald-200 dark:bg-emerald-950/40";
            case 2: return "bg-emerald-400/60 dark:bg-emerald-800/50";
            case 3: return "bg-[#10b981] dark:bg-[#10b981]/70";
            case 4: return "bg-emerald-600 dark:bg-white"; // Highlights
            default: return "bg-zinc-200 dark:bg-zinc-900/30";
        }
    };

    const getGlowEffect = (_level: number) => {
        return "";
    };

    return (
        <section className="py-24 relative overflow-hidden flex flex-col items-center justify-center min-h-[600px] bg-background text-foreground transition-colors duration-300">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
                <div className="text-center mb-12 relative z-10">
                    <h2 className="text-3xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white mb-2 flex items-center justify-center gap-2.5">
                        <Calendar className="w-6 h-6 text-[#10b981]" />
                        Active Contributions Map
                    </h2>
                    <p className="text-zinc-500 max-w-2xl mx-auto text-sm font-sans font-light">
                        Visualizing my GitHub contribution graph as a 3D isometric layout. Each building represents a day of coding activity.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-[#10b981] animate-spin" />
                        <span className="font-sans text-zinc-500 text-sm">Loading city data...</span>
                    </div>
                ) : (
                    <div
                        className="relative w-full max-w-5xl h-[400px] flex items-center justify-center perspective-[2000px] group"
                        onMouseMove={(e) => {
                            const tooltip = document.getElementById('city-tooltip');
                            if (tooltip) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;

                                // Offset tooltip to not cover cursor
                                tooltip.style.transform = `translate(${x + 15}px, ${y + 15}px)`;
                            }
                        }}
                    >

                        {/* City Grid Container */}
                        <div
                            className="relative grid grid-cols-[repeat(15,1fr)] gap-2 transform-style-3d rotate-x-60 -rotate-z-45"
                            style={{
                                transform: "rotateX(55deg) rotateZ(-45deg)",
                                width: "600px",
                            }}
                        >
                            <AnimatePresence>
                                {cityDays.slice(-100).map((day, index) => {
                                    const height = getBuildingHeight(day.count);

                                    return (
                                        <motion.div
                                            key={day.date}
                                            initial={{ scaleY: 0, opacity: 0 }}
                                            animate={{ scaleY: 1, opacity: 1 }}
                                            transition={{ delay: index * 0.005, duration: 0.5, type: "spring" }}
                                            onMouseEnter={() => setHoveredDay(day)}
                                            onMouseLeave={() => setHoveredDay(null)}
                                            className="relative w-8 w-8 group/building transition-colors duration-300 transform-style-3d"
                                            style={{
                                                height: `${height}px`,
                                            }}
                                        >
                                            {/* Building Block */}
                                            <div className={`absolute bottom-0 w-full group-hover/building:brightness-150 transition-all duration-300 ${getBuildingColor(day.level)} ${getGlowEffect(day.level)} border-t border-l border-white/20`}
                                                style={{ height: '100%' }}
                                            >
                                                {/* Roof */}
                                                <div className="absolute -top-[8px] left-0 w-full h-[8px] bg-white/10 skew-x-[45deg] origin-bottom-left" />
                                                {/* Side */}
                                                <div className="absolute top-0 -right-[8px] w-[8px] h-full bg-black/20 skew-y-[45deg] origin-top-left" />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Floating Tooltip */}
                        <div
                            id="city-tooltip"
                            className={`absolute top-0 left-0 pointer-events-none z-50 transition-opacity duration-200 ${hoveredDay ? 'opacity-100' : 'opacity-0'}`}
                            style={{ willChange: 'transform' }}
                        >
                            {hoveredDay && (
                                <div className="bg-card/95 backdrop-blur-md border border-border px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap font-sans text-xs">
                                    <div className="text-[#10b981] font-bold">{hoveredDay.date}</div>
                                    <div className="text-foreground mt-1">
                                        <span className="text-[#10b981] font-bold">{hoveredDay.count}</span> contributions
                                    </div>
                                    {/* Small arrow */}
                                    <div className="absolute top-0 -left-1 w-2 h-2 bg-card border-l border-t border-border transform -rotate-45 translate-y-3 -translate-x-1/2" />
                                </div>
                            )}
                        </div>

                    </div>
                )}

                {/* Stats Footer Cards */}
                {!loading && data && (
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                        <div className="bg-card border border-border p-6 rounded-3xl text-center shadow-sm dark:shadow-none transition-colors duration-300">
                            <div className="text-2xl font-bold text-zinc-900 dark:text-white font-sans">
                                {Object.values(data.total).reduce((a, b) => a + b, 0)}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-sans mt-1 uppercase tracking-wider font-semibold">Total Contributions YTD</div>
                        </div>
                        <div className="bg-card border border-border p-6 rounded-3xl text-center shadow-sm dark:shadow-none transition-colors duration-300">
                            <div className="text-2xl font-bold text-zinc-900 dark:text-white font-sans">
                                {cityDays.filter(d => d.count > 0).length}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-sans mt-1 uppercase tracking-wider font-semibold">Active Days</div>
                        </div>
                        <div className="bg-card border border-border p-6 rounded-3xl text-center shadow-sm dark:shadow-none transition-colors duration-300">
                            <div className="text-2xl font-bold text-zinc-900 dark:text-white font-sans">
                                {Math.max(...cityDays.map(d => d.count))}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-sans mt-1 uppercase tracking-wider font-semibold">Peak Daily Commits</div>
                        </div>
                        <div className="bg-card border border-border p-6 rounded-3xl text-center shadow-sm dark:shadow-none transition-colors duration-300">
                            <div className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center justify-center gap-2 font-sans">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
                                </span>
                                SECURE
                            </div>
                            <div className="text-[10px] text-zinc-500 font-sans mt-1 uppercase tracking-wider font-semibold">API Sync Status</div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
