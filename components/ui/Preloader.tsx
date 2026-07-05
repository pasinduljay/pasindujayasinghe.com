"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingPhrases = [
    { pct: 0, text: "Initializing secure terminal session..." },
    { pct: 15, text: "Scanning route pathways..." },
    { pct: 35, text: "Loading environment variables..." },
    { pct: 55, text: "Optimizing layout parameters..." },
    { pct: 75, text: "Establishing connection nodes..." },
    { pct: 90, text: "Finalizing system boot..." },
    { pct: 100, text: "Verification complete. Access granted." }
];

export default function Preloader({ isBlocked = false, blockReason = "" }: { isBlocked?: boolean; blockReason?: string }) {
    const [complete, setComplete] = useState(false);
    const [progress, setProgress] = useState(0);
    const [ipAddress, setIpAddress] = useState("SCANNING...");
    const [location, setLocation] = useState("RESOLVING...");
    const [vpnDetected, setVpnDetected] = useState<boolean | null>(null);

    useEffect(() => {
        let isMounted = true;

        // Prevent body/html scroll during load and reset position
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        window.scrollTo(0, 0);

        // Fetch user IP details, resolve location, and check VPN heuristics
        const checkConnection = async () => {
            let detectedIp = "";
            let detectedCity = "";
            let detectedCountry = "";
            let detectedTimezone = "";
            let detectedOrg = "";

            // 1. Try to get IPv4 from ipify first (forces IPv4)
            try {
                const ipifyRes = await fetch("https://api.ipify.org?format=json");
                if (ipifyRes.ok) {
                    const data = await ipifyRes.json();
                    if (data.ip) {
                        detectedIp = data.ip;
                    }
                }
            } catch (e) {
                console.warn("ipify IPv4 resolve failed, falling back to dual-stack detection", e);
            }

            // 2. Query geolocation details using the detected IPv4 if available
            const geoUrls = detectedIp
                ? [
                    `https://ipapi.co/${detectedIp}/json/`,
                    `https://ipinfo.io/${detectedIp}/json`
                  ]
                : [
                    "https://ipapi.co/json/",
                    "https://ipinfo.io/json"
                  ];

            for (const url of geoUrls) {
                try {
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        // If we didn't get IPv4 from ipify, get the IP from the geo response
                        if (!detectedIp) {
                            detectedIp = data.ip || data.query || "";
                        }
                        detectedCity = data.city || "";
                        detectedCountry = data.country_name || data.country || "";
                        detectedTimezone = data.timezone || "";
                        detectedOrg = (data.org || data.org_name || data.asn || "").toLowerCase();
                        break;
                    }
                } catch (e) {
                    console.warn(`Failed to fetch geo details from ${url}`, e);
                }
            }

            // If we still have no IP (completely offline or blocked), fallback to local
            if (isMounted) {
                if (detectedIp) {
                    setIpAddress(detectedIp);
                    const locStr = detectedCity && detectedCountry ? `${detectedCity}, ${detectedCountry}` : detectedCountry || "Unknown Location";
                    setLocation(locStr);

                    // Evaluate VPN heuristics
                    const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const isTimezoneMismatch = detectedTimezone && systemTimezone !== detectedTimezone;
                    const vpnKeywords = [
                        "vpn", "hosting", "mullvad", "nord", "express", "surfshark", "proton", 
                        "tunnelbear", "datacenter", "digitalocean", "amazon", "google", "linode", 
                        "ovh", "hetzner", "cloudflare", "server", "private", "proxy"
                    ];
                    const isVpnOrg = vpnKeywords.some(keyword => detectedOrg.includes(keyword));
                    setVpnDetected(!!(isTimezoneMismatch || isVpnOrg));
                } else {
                    setIpAddress("127.0.0.1 (LOCAL)");
                    setLocation("Loopback Interface");
                    setVpnDetected(false);
                }
            }
        };

        checkConnection();

        // Progress Counter Interval
        const interval = setInterval(() => {
            if (!isMounted) return;
            setProgress(prev => {
                // If IP is blocked, halt loading state at 99%
                if (isBlocked && prev >= 99) {
                    return 99;
                }
                if (prev >= 100) {
                    clearInterval(interval);
                    // Trigger completion transition after a slight delay for visual verification
                    setTimeout(() => {
                        if (isMounted) {
                            setComplete(true);
                            document.body.style.overflow = "auto";
                            document.documentElement.style.overflow = "auto";
                            window.scrollTo(0, 0);
                        }
                    }, 650);
                    return 100;
                }
                // Speeds up and slows down dynamically for realism
                const step = prev < 30 ? 1 : prev < 70 ? 2 : prev < 90 ? 1 : 1;
                return Math.min(prev + step, 100);
            });
        }, 45);

        return () => {
            isMounted = false;
            clearInterval(interval);
            document.body.style.overflow = "auto";
            document.documentElement.style.overflow = "auto";
        };
    }, [isBlocked]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (complete) return null;

    // Get current loading phrase based on progress percentage
    let currentPhrase = [...loadingPhrases]
        .reverse()
        .find(phrase => progress >= phrase.pct)?.text || "Loading...";

    if (isBlocked && progress >= 99) {
        currentPhrase = `Verification failed. Access restricted. Reason: ${blockReason || "Flagged IP address"}`;
    }

    const preloaderStyles = `
        .preloader-bg {
            background-color: #f8fafc;
            background-image: radial-gradient(circle at center, ${isBlocked ? "rgba(239,68,68,0.015)" : "rgba(5,150,105,0.015)"} 0%, transparent 85%), linear-gradient(rgba(248, 250, 252, 0) 50%, rgba(15, 23, 42, 0.02) 50%);
            background-size: 100% 100%, 100% 4px;
        }
        .dark .preloader-bg {
            background-color: #050508;
            background-image: radial-gradient(circle at center, ${isBlocked ? "rgba(239,68,68,0.035)" : "rgba(16,185,129,0.035)"} 0%, transparent 85%), linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
            background-size: 100% 100%, 100% 4px;
        }

        .preloader-vignette::before {
            background-image: radial-gradient(circle at center, transparent 60%, ${isBlocked ? "rgba(239,68,68,0.03)" : "rgba(15,23,42,0.03)"} 100%);
        }
        .dark .preloader-vignette::before {
            background-image: radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.5) 100%);
        }
        
        .preloader-shadow {
            box-shadow: var(--preloader-accent-glow);
        }

        .preloader-slits {
            background-image: linear-gradient(90deg, transparent 75%, #f1f5f9 75%);
            background-size: 6px 100%;
        }
        .dark .preloader-slits {
            background-image: linear-gradient(90deg, transparent 75%, #09090d 75%);
            background-size: 6px 100%;
        }

        :root {
            --preloader-accent-color: ${isBlocked ? "#ef4444" : "#10b981"};
            --preloader-accent-glow: ${isBlocked ? "0 0 10px rgba(239,68,68,0.85), 0 0 3px rgba(239,68,68,0.4)" : "0 0 8px rgba(16,185,129,0.5)"};
            --spinner-border-color: ${isBlocked ? "rgba(239, 68, 68, 0.1)" : "rgba(5, 150, 105, 0.1)"};
        }
        .dark {
            --preloader-accent-color: ${isBlocked ? "#f87171" : "#34d399"};
            --preloader-accent-glow: ${isBlocked ? "0 0 10px rgba(248,113,113,0.85), 0 0 3px rgba(248,113,113,0.4)" : "0 0 10px rgba(52,211,153,0.85), 0 0 3px rgba(52,211,153,0.4)"};
            --spinner-border-color: ${isBlocked ? "rgba(248, 113, 113, 0.1)" : "rgba(52, 211, 153, 0.1)"};
        }
    `;

    return (
        <AnimatePresence>
            {!complete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.99, filter: "blur(12px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-[#f8fafc] dark:bg-[#050508] preloader-bg preloader-vignette flex items-center justify-center font-mono text-xs select-none touch-none overflow-hidden before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:z-30"
                    style={{ overscrollBehavior: "contain" }}
                >
                    <style dangerouslySetInnerHTML={{ __html: preloaderStyles }} />
                    {/* Glowing screen scanlines overlay */}
                    <div className="absolute inset-0 bg-transparent pointer-events-none z-10 opacity-[0.03] animate-pulse" />

                    <div className="w-full max-w-md md:max-w-2xl p-6 md:p-8 relative z-20 flex flex-col gap-4 md:gap-6">
                        {/* Animated Loading Text */}
                        <div className="flex items-center gap-3 font-mono text-xs sm:text-sm md:text-base lg:text-lg select-none text-slate-600 dark:text-zinc-400">
                            {progress < 100 ? (
                                <div className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center select-none shrink-0 mr-1">
                                    <div
                                        className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 rounded-full border-2 border-transparent border-t-current animate-[spin_0.75s_cubic-bezier(0.4,0.1,0.2,0.9)_infinite]"
                                        style={{
                                            color: "var(--preloader-accent-color)",
                                            borderLeftColor: "var(--spinner-border-color)",
                                            borderBottomColor: "var(--spinner-border-color)",
                                            borderRightColor: "var(--spinner-border-color)",
                                        }}
                                    />
                                </div>
                            ) : (
                                <span 
                                    className="font-bold select-none w-6 h-6 md:w-8 md:h-8 flex items-center justify-center shrink-0 mr-1"
                                    style={{ color: "var(--preloader-accent-color)" }}
                                >
                                    {isBlocked ? "⚠" : "✓"}
                                </span>
                            )}
                            <span className="flex-1 select-none tracking-wide text-slate-900 dark:text-zinc-300 font-semibold">
                                {currentPhrase}
                            </span>
                        </div>

                        {/* Physical segmented neon loader bar */}
                        <div className={`flex items-center p-2.5 md:p-3.5 rounded-lg relative overflow-hidden font-bold border bg-slate-100/90 dark:bg-[#09090d]/80 ${
                            isBlocked 
                                ? "border-red-500/20 text-red-500/30" 
                                : "border-slate-200 dark:border-emerald-500/10 text-emerald-600/40 dark:text-emerald-500/30"
                        }`}>
                            {/* Inner ambient glow */}
                            <div className={`absolute inset-0 pointer-events-none ${
                                isBlocked 
                                    ? "bg-gradient-to-r from-red-500/3 dark:from-red-500/5 via-transparent to-transparent" 
                                    : "bg-gradient-to-r from-emerald-500/3 dark:from-emerald-500/5 via-transparent to-transparent"
                            }`} />
                            
                            <span className="select-none mr-2 font-mono text-xs sm:text-sm md:text-base">[</span>
							<div className="flex-1 bg-slate-200 dark:bg-[#09090d] rounded-[2px] h-4 sm:h-5 md:h-6 relative overflow-hidden">
								{/* Glowing hardware-accelerated bar */}
								<motion.div
									className="h-full rounded-[1px] origin-left preloader-shadow"
									style={{ 
                                        scaleX: progress / 100,
                                        backgroundColor: "var(--preloader-accent-color)"
                                    }}
									transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
								/>
								
								{/* Slits mask for visual segmenting */}
								<div className="absolute inset-0 pointer-events-none preloader-slits" />
							</div>
                            <span className="select-none ml-2 font-mono text-xs sm:text-sm md:text-base">]</span>
                        </div>

                        {/* Clean flat 2-column Unix-style status grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 mt-2 pt-4 border-t border-slate-200 dark:border-emerald-500/5 text-[10px] sm:text-xs md:text-sm font-mono tracking-wider select-none text-slate-500 dark:text-zinc-500">
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className="text-slate-500 dark:text-zinc-500 font-medium shrink-0">IP Address:</span>
                                <span className="text-slate-800 dark:text-zinc-300 font-semibold select-text truncate text-right flex-1 min-w-0" title={ipAddress}>{ipAddress}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className="text-slate-500 dark:text-zinc-500 font-medium shrink-0">System Status:</span>
                                <span className={`font-semibold truncate text-right flex-1 min-w-0 ${
                                    progress < 99 
                                        ? "text-amber-600 dark:text-amber-500/80 animate-pulse" 
                                        : isBlocked 
                                            ? "text-red-500 font-bold animate-pulse" 
                                            : "text-emerald-600 dark:text-emerald-400 font-bold dark:drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]"
                                }`}>
                                    {progress < 99 ? "Connecting..." : isBlocked ? "Access Restricted" : "Access Granted"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className="text-slate-500 dark:text-zinc-500 font-medium shrink-0">Location:</span>
                                <span className="text-slate-800 dark:text-zinc-300 font-semibold select-text truncate text-right flex-1 min-w-0" title={location}>{location}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className="text-slate-500 dark:text-zinc-500 font-medium shrink-0">Progress:</span>
                                <span 
                                    className="font-semibold text-right flex-1 min-w-0"
                                    style={{ color: "var(--preloader-accent-color)" }}
                                >
                                    {progress}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className="text-slate-500 dark:text-zinc-500 font-medium shrink-0">VPN Shield:</span>
                                <span className={`font-semibold text-right flex-1 min-w-0 ${
                                    vpnDetected === null 
                                        ? "text-slate-400 dark:text-zinc-500" 
                                        : vpnDetected 
                                            ? "text-rose-600 dark:text-rose-400 font-bold" 
                                            : "text-emerald-600 dark:text-emerald-400 font-bold"
                                }`}>
                                    {vpnDetected === null 
                                        ? "Evaluating..." 
                                        : vpnDetected 
                                            ? "Active" 
                                            : "Inactive"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className="text-slate-500 dark:text-zinc-500 font-medium shrink-0">Download Rate:</span>
                                <span className="text-slate-600 dark:text-zinc-400 text-right flex-1 min-w-0">{progress < 99 ? (2.4 + Math.sin(progress / 5) * 0.3).toFixed(1) : "0.0"} MB/s</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
