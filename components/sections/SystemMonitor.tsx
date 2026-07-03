"use client";

import { useState, useRef, useEffect } from "react";
import { Server, Volume2 } from "lucide-react";
import Container from "@/components/ui/Container";
import MetricsPanel from "@/components/ui/MetricsPanel";
import ArchitectureDiagram from "@/components/ui/ArchitectureDiagram";

export default function SystemMonitor() {
    const [isAmbientMode, setIsAmbientMode] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Load audio as Blob to bypass IDM/Download Managers
    useEffect(() => {
        let objectUrl: string | null = null;

        const loadAudio = async () => {
            try {
                // Fetch renamed file to bypass IDM interception
                const response = await fetch('/sounds/server-hum.dat');
                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);
                if (audioRef.current) {
                    audioRef.current.src = objectUrl;
                }
            } catch (error) {
                console.error("Audio preload failed:", error);
            }
        };

        loadAudio();

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, []);

    const toggleAmbientMode = () => {
        if (!audioRef.current) return;

        if (isAmbientMode) {
            audioRef.current.pause();
            setIsAmbientMode(false);
        } else {
            audioRef.current.volume = 0.3; // Low hum
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            setIsAmbientMode(true);
        }
    };
    return (
        <section className="py-20 relative border-t border-border bg-background transition-colors duration-300">
            <Container>
                <div className="mb-12">
                    <h2 className="text-2xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white mb-2 flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 bg-[#10b981] rounded-full animate-pulse" />
                        Real-Time Systems Telemetry
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-sm font-sans font-light">
                        Active multi-cluster routing and serverless resource utilization metrics synced from live production nodes.
                    </p>
                </div>

                {/* Ambient Toggle */}
                <div className="hidden sm:flex absolute top-20 right-0 sm:right-10 items-center gap-2">
                    <button
                        onClick={toggleAmbientMode}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans font-bold border transition-all ${isAmbientMode
                            ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                            : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}
                    >
                        {isAmbientMode ? <Volume2 size={14} className="animate-pulse" /> : <Server size={14} />}
                        {isAmbientMode ? "SERVER RACK: ON" : "AMBIENT MODE"}
                    </button>
                    {/* Source set via Blob in useEffect */}
                    <audio ref={audioRef} loop />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[400px]">
                    {/* Left Panel: Architecture Map (Takes 2/3 width on large screens) */}
                    <div className="lg:col-span-2 h-full min-h-[300px]">
                        <ArchitectureDiagram />
                    </div>

                    {/* Right Panel: Metrics (Takes 1/3 width) */}
                    <div className="h-full min-h-[300px]">
                        <MetricsPanel isAmbientMode={isAmbientMode} onToggleAmbient={toggleAmbientMode} />
                    </div>
                </div>
            </Container>
        </section>
    );
}
