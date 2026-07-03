"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, Download, Terminal, Shield, Cloud } from "lucide-react";
import { motion } from "framer-motion";
import { useSystemStatus } from "@/context/SystemStatusContext";

interface RecruiterVaultProps {
    profile: {
        name: string;
        email: string;
        resumeUrl?: string;
    };
}

const LOG_SEQUENCE = [
    { text: "INITIALIZING SECURE HANDSHAKE...", delay: 500, color: "text-zinc-500" },
    { text: "CONNECTING TO SECURE_VAULT_V4...", delay: 800, color: "text-zinc-400" },
    { text: "VERIFYING PRIVATE KEY SIGNATURE...", delay: 1200, color: "text-amber-500" },
    { text: "CHECKING INTEGRITY CHECKSUMS... [OK]", delay: 600, color: "text-emerald-500" },
    { text: "DECRYPTING PAYLOAD STREAMS...", delay: 1000, color: "text-emerald-500" },
    { text: "ACCESS GRANTED. DATA UNLOCKED.", delay: 800, color: "text-emerald-400 font-bold" }
];

export default function RecruiterVault({ profile }: RecruiterVaultProps) {
    const [isDecrypted, setIsDecrypted] = useState(false);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [logs, setLogs] = useState<{ text: string; color: string }[]>([]);
    const { isVaultOnline: _isVaultOnline } = useSystemStatus();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const startDecryption = async () => {
        setIsDecrypting(true);
        setLogs([]);

        let currentDelay = 0;

        for (const log of LOG_SEQUENCE) {
            currentDelay += log.delay;
            setTimeout(() => {
                setLogs(prev => [...prev, { text: log.text, color: log.color }]);
            }, currentDelay);
        }

        setTimeout(() => {
            setIsDecrypted(true);
            setIsDecrypting(false);
        }, currentDelay + 500);
    };

    const handleReLock = () => {
        setIsDecrypted(false);
        setIsDecrypting(false);
        setLogs([]);
    };

    return (
        <section id="recruiter-vault-section" className="py-20 relative overflow-hidden bg-background text-foreground transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-3xl">

                {/* Vault Container */}
                <div className="relative rounded-2xl bg-card border border-border shadow-2xl overflow-hidden font-sans text-sm min-h-[400px] flex flex-col transition-colors duration-300">

                    {/* Vault Header */}
                    <div className="bg-black/5 dark:bg-black/40 border-b border-border p-4 flex items-center justify-between font-sans text-xs font-semibold transition-colors duration-300">
                        {/* Left: Status */}
                        <div className="flex items-center gap-4 text-[10px]">
                            <div className="flex items-center gap-1.5 text-[#10b981]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></div>
                                <span className="text-zinc-500 font-sans">STATUS:</span>
                                <span className="font-bold text-[#10b981] tracking-wider">SECURE</span>
                            </div>

                            <div className="h-3 w-[1px] bg-border"></div>

                            <div className="flex items-center gap-1.5 text-zinc-500">
                                <Cloud size={11} className="text-zinc-600" />
                                <span>PROTECTED ACCESS</span>
                            </div>
                        </div>

                        {/* Right: Cipher Type */}
                        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/[0.03] px-2.5 py-0.5 rounded border border-border text-[10px]">
                            <Shield size={11} />
                            <span>AES-256</span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 relative bg-transparent overflow-y-auto custom-scrollbar flex flex-col" ref={scrollRef}>
                        {!isDecrypting && !isDecrypted && (
                            <div className="flex flex-col items-center justify-center flex-1 space-y-6 animate-in fade-in zoom-in duration-500 my-auto">
                                <div className="w-20 h-20 rounded-full border border-border flex items-center justify-center relative group">
                                    <div className="absolute inset-0 rounded-full border border-[#10b981]/20 animate-spin-slow"></div>
                                    <Lock className="w-8 h-8 text-zinc-500 group-hover:text-[#10b981] transition-colors" />
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-lg text-zinc-900 dark:text-white font-bold tracking-tight">Secure Archives Vault</h3>
                                    <p className="text-zinc-500 text-xs font-mono">CONTACT_INFO.DAT • COMPLIANT ENCRYPTION</p>
                                </div>
                                <button
                                    onClick={startDecryption}
                                    className="px-6 py-2.5 bg-foreground text-background hover:bg-foreground/90 font-semibold transition-colors rounded-lg flex items-center gap-2 text-xs"
                                >
                                    <Terminal size={14} />
                                    <span>Unlock Archives</span>
                                </button>
                            </div>
                        )}

                        {(isDecrypting || isDecrypted) && (
                            <div className="space-y-2.5 w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center">
                                <div className="text-zinc-500 pb-2 border-b border-border text-xs font-semibold uppercase tracking-wider">
                                    Executing Decryption Pipeline...
                                </div>

                                <div className="space-y-1.5 py-4 font-mono text-xs">
                                    {logs.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`flex items-start gap-2.5 ${log.color}`}
                                        >
                                            <span className="text-zinc-700 select-none">&gt;</span>
                                            <span>{log.text}</span>
                                        </motion.div>
                                    ))}

                                    {isDecrypting && (
                                        <div className="flex items-center gap-2 text-[#10b981] animate-pulse mt-2">
                                            <span className="text-zinc-700">&gt;</span>
                                            <span className="w-1.5 h-3 bg-[#10b981] inline-block"></span>
                                        </div>
                                    )}
                                </div>

                                {/* Final Result Content */}
                                {isDecrypted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 pt-6 border-t border-border"
                                    >
                                        <div className="grid md:grid-cols-2 gap-8 items-start">
                                            <div className="space-y-4">
                                                <div className="space-y-1 font-sans">
                                                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Identity Confirmed</label>
                                                    <div className="text-lg text-zinc-900 dark:text-white font-bold">{profile.name}</div>
                                                </div>
                                                <div className="space-y-1 font-sans">
                                                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Secure Comms</label>
                                                    <div className="text-[#10b981] font-mono text-xs break-all">{profile.email}</div>
                                                </div>
                                                <button
                                                    onClick={handleReLock}
                                                    className="text-[10px] text-zinc-500 hover:text-red-400 flex items-center gap-1.5 mt-4 transition-colors font-semibold"
                                                >
                                                    <Lock size={10} />
                                                    Lock Session
                                                </button>
                                            </div>

                                            <div className="bg-black/5 dark:bg-black/10 border border-border rounded-2xl p-5 flex flex-col gap-4 items-center text-center">
                                                <div className="w-10 h-10 bg-[#10b981]/10 rounded-full flex items-center justify-center">
                                                    <Download className="text-[#10b981] w-5 h-5" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <div className="text-zinc-800 dark:text-zinc-200 text-xs font-bold font-sans uppercase tracking-wider">BIO DATA READY</div>
                                                    <div className="text-[9px] text-zinc-600 font-mono">SIZE: 1.2MB • PDF FORMAT</div>
                                                </div>
                                                <a
                                                    href={profile.resumeUrl || "#"}
                                                    download
                                                    className="w-full py-2 bg-[#10b981] hover:bg-emerald-500 text-black font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <span>Download File</span>
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
