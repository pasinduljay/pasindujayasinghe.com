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

export default function Preloader() {
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
            // Query geolocation APIs first to gather location and timezone parameters
            const geoUrls = [
                "https://ipapi.co/json/",
                "https://ipinfo.io/json"
            ];

            for (const url of geoUrls) {
                try {
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        const ip = data.ip || data.query;
                        if (isMounted && ip) {
                            setIpAddress(ip);
                            
                            // 1. Resolve Location
                            const city = data.city || "";
                            const country = data.country_name || data.country || "";
                            const locStr = city && country ? `${city}, ${country}` : country || "Unknown Location";
                            setLocation(locStr);

                            // 2. Evaluate VPN Heuristics
                            const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                            const ipTimezone = data.timezone;
                            const isTimezoneMismatch = ipTimezone && systemTimezone !== ipTimezone;

                            const org = (data.org || data.org_name || data.asn || "").toLowerCase();
                            const vpnKeywords = [
                                "vpn", "hosting", "mullvad", "nord", "express", "surfshark", "proton", 
                                "tunnelbear", "datacenter", "digitalocean", "amazon", "google", "linode", 
                                "ovh", "hetzner", "cloudflare", "server", "private", "proxy"
                            ];
                            const isVpnOrg = vpnKeywords.some(keyword => org.includes(keyword));

                            setVpnDetected(!!(isTimezoneMismatch || isVpnOrg));
                            return;
                        }
                    }
                } catch (_e) {
                    console.warn(`Failed to resolve geolocation from ${url}, trying next...`);
                }
            }

            // Fallback: If geolocation endpoints are blocked, query raw IP endpoints
            const ipUrls = [
                "https://api64.ipify.org?format=json",
                "https://api.ipify.org?format=json"
            ];
            for (const url of ipUrls) {
                try {
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        const ip = data.ip;
                        if (isMounted && ip) {
                            setIpAddress(ip);
                            setLocation("Public Network");
                            setVpnDetected(false);
                            return;
                        }
                    }
                } catch (_e) {
                    console.warn(`Failed to resolve raw IP from ${url}`);
                }
            }

            // Final loopback fallback
            if (isMounted) {
                setIpAddress("127.0.0.1 (LOCAL)");
                setLocation("Loopback Interface");
                setVpnDetected(false);
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

    if (complete) return null;

    // Get current loading phrase based on progress percentage
    const currentPhrase = [...loadingPhrases]
        .reverse()
        .find(phrase => progress >= phrase.pct)?.text || "Loading...";

    // Spinner characters for the retro terminal load
    const spinnerChars = ["/", "-", "\\", "|"];
    const currentSpinner = spinnerChars[Math.floor(progress / 3) % spinnerChars.length];

    return (
        <AnimatePresence>
            {!complete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.99, filter: "blur(12px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-[#050508] flex items-center justify-center font-mono text-xs select-none touch-none overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)] before:pointer-events-none before:z-30"
                    style={{
                        overscrollBehavior: "contain",
                        backgroundImage: "radial-gradient(circle at center, rgba(16,185,129,0.035) 0%, transparent 85%), linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
                        backgroundSize: "100% 100%, 100% 4px"
                    }}
                >
                    {/* Glowing screen scanlines overlay */}
                    <div className="absolute inset-0 bg-transparent pointer-events-none z-10 pointer-events-none opacity-[0.03] animate-pulse" />

                    <div className="w-full max-w-lg p-6 relative z-20 flex flex-col gap-4">
                        {/* Animated Loading Text */}
                        <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs md:text-sm select-none">
                            <span className="text-emerald-400 font-bold select-none w-4">
                                {progress < 100 ? currentSpinner : "✓"}
                            </span>
                            <span className="flex-1 select-none tracking-wide text-zinc-300">
                                {currentPhrase}
                            </span>
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6 }}
                                className="w-1.5 h-3.5 bg-emerald-500 inline-block align-middle"
                            />
                        </div>

                        {/* Physical segmented neon loader bar */}
                        <div className="flex items-center bg-[#09090d]/80 border border-emerald-500/10 p-2.5 rounded-lg relative overflow-hidden font-bold">
                            {/* Inner ambient glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
                            
                            <span className="text-emerald-500/30 select-none mr-2 font-mono text-xs">[</span>
                            <div className="flex-1 bg-[#09090d] rounded-[2px] h-4 relative overflow-hidden">
                                {/* Glowing hardware-accelerated bar */}
                                <motion.div
                                    className="h-full bg-emerald-400 rounded-[1px] origin-left"
                                    style={{
                                        scaleX: progress / 100,
                                        boxShadow: "0 0 10px rgba(52,211,153,0.85), 0 0 3px rgba(52,211,153,0.4)"
                                    }}
                                    transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
                                />
                                
                                {/* Slits mask for visual segmenting */}
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_75%,#09090d_75%)] bg-[length:6px_100%] pointer-events-none" />
                            </div>
                            <span className="text-emerald-500/30 select-none ml-2 font-mono text-xs">]</span>
                        </div>

                        {/* Clean flat 2-column Unix-style status grid */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 pt-4 border-t border-emerald-500/5 text-[10px] font-mono tracking-wider select-none text-zinc-500">
                            <div className="flex justify-between">
                                <span className="text-zinc-500 font-medium">IP Address:</span>
                                <span className="text-zinc-300 font-semibold select-text">{ipAddress}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500 font-medium">System Status:</span>
                                <span className={`font-semibold ${
                                    progress < 100 
                                        ? "text-amber-500/80 animate-pulse" 
                                        : "text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]"
                                }`}>
                                    {progress < 100 ? "Connecting..." : "Access Granted"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500 font-medium">Location:</span>
                                <span className="text-zinc-300 font-semibold select-text truncate max-w-[120px] text-right">{location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500 font-medium">Progress:</span>
                                <span className="text-emerald-400 font-semibold">{progress}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500 font-medium">VPN Shield:</span>
                                <span className={`font-semibold ${
                                    vpnDetected === null 
                                        ? "text-zinc-500" 
                                        : vpnDetected 
                                            ? "text-rose-400 font-bold" 
                                            : "text-emerald-400 font-bold"
                                }`}>
                                    {vpnDetected === null 
                                        ? "Evaluating..." 
                                        : vpnDetected 
                                            ? "Active" 
                                            : "Inactive"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500 font-medium">Download Rate:</span>
                                <span className="text-zinc-400">{progress < 100 ? (2.4 + Math.sin(progress / 5) * 0.3).toFixed(1) : "0.0"} MB/s</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
