"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandLog {
    type: "command" | "output";
    content: React.ReactNode;
}

interface TerminalLogsProps {
    logs: CommandLog[];
    isProcessing: boolean;
}

const TerminalLogs = React.memo(({ logs, isProcessing }: TerminalLogsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs, isProcessing]);

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/50 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:!bg-zinc-950 [&::-webkit-scrollbar-thumb]:!bg-zinc-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:!bg-zinc-500"
            style={{ scrollbarColor: '#52525b #09090b', scrollbarWidth: 'thin' }}
        >
            <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                    <motion.div
                        key={i} // Using index as key is acceptable here as logs are append-only mostly
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {log.content}
                    </motion.div>
                ))}
            </AnimatePresence>

            {isProcessing && (
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs">
                    <div className="flex gap-1" aria-hidden="true">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-cyber-green animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-cyber-green animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-cyber-green animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    Processing...
                </div>
            )}
        </div>
    );
});

TerminalLogs.displayName = "TerminalLogs";

export default TerminalLogs;
