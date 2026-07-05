"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const loadingPhrases = [
    { pct: 0, text: "Initializing secure terminal session..." },
    { pct: 15, text: "Scanning route pathways..." },
    { pct: 35, text: "Loading environment variables..." },
    { pct: 55, text: "Optimizing layout parameters..." },
    { pct: 75, text: "Establishing connection nodes..." },
    { pct: 90, text: "Finalizing system boot..." },
    { pct: 100, text: "Verification complete. Access granted." }
];

export default function Preloader() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
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
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (complete) return null;

    // Get current loading phrase based on progress percentage
    const currentPhrase = [...loadingPhrases]
        .reverse()
        .find(phrase => progress >= phrase.pct)?.text || "Loading...";

    // Spinner characters for the retro terminal load
    const spinnerChars = ["/", "-", "\\", "|"];
    const currentSpinner = spinnerChars[Math.floor(progress / 3) % spinnerChars.length];

    const isDark = mounted ? resolvedTheme === "dark" : false;
    const bgClass = isDark ? "bg-[#050508]" : "bg-[#f8fafc]";
    const beforeBg = isDark 
        ? "before:bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" 
        : "before:bg-[radial-gradient(circle_at_center,transparent_60%,rgba(15,23,42,0.03)_100%)]";
    const styleBg = isDark
        ? "radial-gradient(circle at center, rgba(16,185,129,0.035) 0%, transparent 85%), linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)"
        : "radial-gradient(circle at center, rgba(5,150,105,0.015) 0%, transparent 85%), linear-gradient(rgba(248, 250, 252, 0) 50%, rgba(15, 23, 42, 0.02) 50%)";

    return (
        <AnimatePresence>
            {!complete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.99, filter: "blur(12px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`fixed inset-0 z-[100] ${bgClass} ${beforeBg} flex items-center justify-center font-mono text-xs select-none touch-none overflow-hidden before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:z-30`}
                    style={{
                        overscrollBehavior: "contain",
                        backgroundImage: styleBg,
                        backgroundSize: "100% 100%, 100% 4px"
                    }}
                >
                    {/* Glowing screen scanlines overlay */}
                    <div className="absolute inset-0 bg-transparent pointer-events-none z-10 opacity-[0.03] animate-pulse" />

                    <div className="w-full max-w-md md:max-w-2xl p-6 md:p-8 relative z-20 flex flex-col gap-4 md:gap-6">
                        {/* Animated Loading Text */}
                        <div className={`flex items-center gap-3 font-mono text-xs sm:text-sm md:text-base lg:text-lg select-none ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                            <span className={`font-bold select-none w-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                                {progress < 100 ? currentSpinner : "✓"}
                            </span>
                            <span className={`flex-1 select-none tracking-wide ${isDark ? "text-zinc-300" : "text-slate-900 font-semibold"}`}>
                                {currentPhrase}
                            </span>
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6 }}
                                className={`w-1.5 h-3.5 sm:w-2 sm:h-4 md:h-5 inline-block align-middle ${isDark ? "bg-emerald-500" : "bg-emerald-600"}`}
                            />
                        </div>

                        {/* Physical segmented neon loader bar */}
                        <div className={`flex items-center p-2.5 md:p-3.5 rounded-lg relative overflow-hidden font-bold border ${
                            isDark 
                                ? "bg-[#09090d]/80 border-emerald-500/10 text-emerald-500/30" 
                                : "bg-slate-100/90 border-slate-200 text-emerald-600/40"
                        }`}>
                            {/* Inner ambient glow */}
                            <div className={`absolute inset-0 pointer-events-none ${
                                isDark 
                                    ? "bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent" 
                                    : "bg-gradient-to-r from-emerald-500/3 via-transparent to-transparent"
                            }`} />
                            
                            <span className="select-none mr-2 font-mono text-xs sm:text-sm md:text-base">[</span>
							<div className={`flex-1 rounded-[2px] h-4 sm:h-5 md:h-6 relative overflow-hidden ${
								isDark ? "bg-[#09090d]" : "bg-slate-200"
							}`}>
								{/* Glowing hardware-accelerated bar */}
								<motion.div
									className={`h-full rounded-[1px] origin-left ${isDark ? "bg-emerald-400" : "bg-emerald-500"}`}
									style={{
										scaleX: progress / 100,
										boxShadow: isDark 
											? "0 0 10px rgba(52,211,153,0.85), 0 0 3px rgba(52,211,153,0.4)" 
											: "0 0 8px rgba(16,185,129,0.5)"
									}}
									transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
								/>
								
								{/* Slits mask for visual segmenting */}
								<div 
									className="absolute inset-0 pointer-events-none"
									style={{
										backgroundImage: isDark
											? "linear-gradient(90deg, transparent 75%, #09090d 75%)"
											: "linear-gradient(90deg, transparent 75%, #f1f5f9 75%)",
										backgroundSize: "6px 100%"
									}}
								/>
							</div>
                            <span className="select-none ml-2 font-mono text-xs sm:text-sm md:text-base">]</span>
                        </div>

                        {/* Clean flat 2-column Unix-style status grid */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 mt-2 pt-4 border-t text-[10px] sm:text-xs md:text-sm font-mono tracking-wider select-none ${
                            isDark 
                                ? "border-emerald-500/5 text-zinc-500" 
                                : "border-slate-200 text-slate-500"
                        }`}>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className={`${isDark ? "text-zinc-500" : "text-slate-500"} font-medium shrink-0`}>IP Address:</span>
                                <span className={`${isDark ? "text-zinc-300" : "text-slate-800"} font-semibold select-text truncate text-right flex-1 min-w-0`} title={ipAddress}>{ipAddress}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className={`${isDark ? "text-zinc-500" : "text-slate-500"} font-medium shrink-0`}>System Status:</span>
                                <span className={`font-semibold truncate text-right flex-1 min-w-0 ${
                                    progress < 100 
                                        ? (isDark ? "text-amber-500/80 animate-pulse" : "text-amber-600 animate-pulse") 
                                        : (isDark ? "text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]" : "text-emerald-600 font-bold")
                                }`}>
                                    {progress < 100 ? "Connecting..." : "Access Granted"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className={`${isDark ? "text-zinc-500" : "text-slate-500"} font-medium shrink-0`}>Location:</span>
                                <span className={`${isDark ? "text-zinc-300" : "text-slate-800"} font-semibold select-text truncate text-right flex-1 min-w-0`} title={location}>{location}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className={`${isDark ? "text-zinc-500" : "text-slate-500"} font-medium shrink-0`}>Progress:</span>
                                <span className={`${isDark ? "text-emerald-400" : "text-emerald-600"} font-semibold text-right flex-1 min-w-0`}>{progress}%</span>
                            </div>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className={`${isDark ? "text-zinc-500" : "text-slate-500"} font-medium shrink-0`}>VPN Shield:</span>
                                <span className={`font-semibold text-right flex-1 min-w-0 ${
                                    vpnDetected === null 
                                        ? (isDark ? "text-zinc-500" : "text-slate-400") 
                                        : vpnDetected 
                                            ? (isDark ? "text-rose-400 font-bold" : "text-rose-600 font-bold") 
                                            : (isDark ? "text-emerald-400 font-bold" : "text-emerald-600 font-bold")
                                }`}>
                                    {vpnDetected === null 
                                        ? "Evaluating..." 
                                        : vpnDetected 
                                            ? "Active" 
                                            : "Inactive"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-2 min-w-0">
                                <span className={`${isDark ? "text-zinc-500" : "text-slate-500"} font-medium shrink-0`}>Download Rate:</span>
                                <span className={`${isDark ? "text-zinc-400" : "text-slate-600"} text-right flex-1 min-w-0`}>{progress < 100 ? (2.4 + Math.sin(progress / 5) * 0.3).toFixed(1) : "0.0"} MB/s</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
