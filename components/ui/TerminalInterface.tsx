"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Terminal, ChevronRight, ShieldAlert, Cpu } from "lucide-react";
import { Profile, Project, Skill } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import TerminalLogs from "./TerminalLogs";
import { getRandomSystemInfo } from "@/lib/terminal-art";
import { useSystemStatus } from "@/context/SystemStatusContext";

interface TerminalInterfaceProps {
    profile: Profile;
    skills: Skill[];
    projects: Project[];
}

type CommandLog = {
    type: "command" | "output";
    content: React.ReactNode;
};

type TerminalMode = "BOOT" | "SELECT_MODE" | "EASY" | "MEDIUM";

const EASY_COMMANDS = ["1", "2", "3", "4", "5", "about", "skills", "lab", "contact", "clear"];
const MEDIUM_COMMANDS = ["help", "terraform plan", "terraform apply skills", "terraform apply profile", "terraform apply projects", "terraform apply contact", "clear"];

export default function TerminalInterface({ profile, skills, projects }: TerminalInterfaceProps) {
    const [mode, setMode] = useState<TerminalMode>("BOOT");
    const [logs, setLogs] = useState<CommandLog[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [placeholder, setPlaceholder] = useState("Initializing...");
    const [_systemInfo, setSystemInfo] = useState<string>("Initializing...");
    const [viewingContent, setViewingContent] = useState(false);
    const { isOnline } = useSystemStatus();
    const hasBooted = useRef(false);

    // Contact Form State
    const [contactStep, setContactStep] = useState<"NONE" | "NAME" | "EMAIL" | "MESSAGE">("NONE");
    const [_contactData, setContactData] = useState({ name: "", email: "", message: "" });

    const bootLogsRef = useRef<CommandLog[]>([]);

    useEffect(() => {
        setSystemInfo(getRandomSystemInfo().split('/')[0]);
    }, []);



    const { register, handleSubmit, reset, watch, setValue } = useForm<{ command: string; honeypot?: string }>({
        defaultValues: { command: "" }
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const currentInput = watch("command") || "";

    // Scroll to bottom on log update
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs]);

    // Boot Sequence
    useEffect(() => {
        if (hasBooted.current) return;
        hasBooted.current = true;

        const bootSequence = async () => {
            setIsProcessing(true);
            setPlaceholder("Booting...");





            // 2.5 Future Features Teaser
            await new Promise(r => setTimeout(r, 600));
            setLogs(prev => [...prev, {
                type: "output",
                content: (
                    <div className="mb-4 text-zinc-400">
                        <p>&gt; <span className="text-amber-400">SYSTEM NOTICE:</span> Advanced modules (Live Ops, Hidden Security CTFs) are currently decrypting...</p>
                        <p>&gt; Status: <span className="text-red-500 font-bold">[LOCKED]</span> - Awaiting future patch v5.0</p>
                    </div>
                )
            }]);

            // 3. Selection Prompt
            await new Promise(r => setTimeout(r, 400));
            setLogs(prev => [...prev, {
                type: "output",
                content: (
                    <div className="mb-2 p-3 border border-dashed border-zinc-700 rounded bg-zinc-900/50">
                        <p className="text-zinc-100 font-bold mb-2">SELECT INTERFACE MODE:</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="text-sm">
                                <span className="text-[#10b981] font-bold">[1] EASY</span>
                                <span className="text-zinc-500 block text-xs">Menu-based navigation</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-amber-400 font-bold">[2] MEDIUM</span>
                                <span className="text-zinc-500 block text-xs">Engineering / IaC Mode</span>
                            </div>
                        </div>
                    </div>
                )
            }]);

            // Capture boot state for clear command
            setLogs(prev => {
                bootLogsRef.current = prev;
                return prev;
            });

            setMode("SELECT_MODE");
            setPlaceholder("Select [1] or [2]...");
            setIsProcessing(false);
            // Focus input automatically
            setTimeout(() => inputRef.current?.focus(), 100);
        };

        bootSequence();
    }, []);

    // Autocomplete Logic
    useEffect(() => {
        if (!currentInput.trim()) {
            setSuggestions([]);
            return;
        }

        let relevantCommands: string[] = [];
        if (mode === "EASY") relevantCommands = EASY_COMMANDS;
        else if (mode === "MEDIUM") relevantCommands = MEDIUM_COMMANDS;
        else if (mode === "SELECT_MODE") relevantCommands = ["1", "2"];

        // Simple "starts with" filter
        const matches = relevantCommands.filter(cmd => cmd.startsWith(currentInput.toLowerCase()));

        // For 'terraform' special handling in Medium mode
        if (mode === "MEDIUM" && currentInput.startsWith("terraform apply")) {
            const resources = ["skills", "profile", "projects", "contact"];
            const typedResource = currentInput.replace("terraform apply", "").trim();
            const resourceMatches = resources.filter(r => r.startsWith(typedResource)).map(r => `terraform apply ${r}`);
            if (resourceMatches.length > 0) setSuggestions(resourceMatches);
            else setSuggestions(matches);
        } else {
            setSuggestions(matches);
        }

    }, [currentInput, mode]);


    // Helper for LCP
    const getLongestCommonPrefix = (strs: string[]) => {
        if (!strs.length) return "";
        let prefix = strs[0];
        for (let i = 1; i < strs.length; i++) {
            while (strs[i].indexOf(prefix) !== 0) {
                prefix = prefix.substring(0, prefix.length - 1);
                if (!prefix) return "";
            }
        }
        return prefix;
    };

    // Input Handling
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setValue("command", commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setValue("command", commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setValue("command", "");
            }
        } else if (e.key === "Tab" && suggestions.length > 0) {
            e.preventDefault();
            const lcp = getLongestCommonPrefix(suggestions);
            if (lcp) {
                setValue("command", lcp);
                // Do NOT clear suggestions here, allow the useEffect to refine them based on the new input
                // setSuggestions([]); 
            }
        } else if (e.key === "Enter") {
            // Explicitly handle Enter to ensure submit works even if implicit submit fails
            if (!e.shiftKey) {
                handleSubmit(onSubmit)(e);
            }
        }
    };

    const renderEasyMenu = () => {
        setLogs(prev => [...prev, {
            type: "output",
            content: (
                <div className="text-zinc-300">
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div><span className="text-cyber-green font-bold">1.</span> About Me</div>
                        <div><span className="text-cyber-green font-bold">2.</span> Skills</div>
                        <div><span className="text-cyber-green font-bold">3.</span> Lab / Projects</div>
                        <div><span className="text-cyber-green font-bold">4.</span> Contact</div>
                        <div><span className="text-cyber-green font-bold">5.</span> Clear</div>
                        <div><span className="text-red-500 font-bold">6.</span> Exit</div>
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">Type '0' inside any option to return here.</div>
                </div>
            )
        }]);
    };

    const renderMediumBanner = () => {
        setLogs(prev => [...prev, {
            type: "output",
            content: (
                <div className="text-zinc-300">
                    <span className="text-amber-400">✔ Medium Mode Activated (Engineer).</span>
                    <br />
                    <span className="text-zinc-500 italic">&gt; Initializing Terraform backend... [OK]</span>
                    <br />
                    <span className="text-zinc-500 italic">&gt; Workspace loaded.</span>
                    <br />
                    <div className="mt-2 text-sm p-2 border-l-2 border-amber-500/50 bg-amber-500/10">
                        Tip: Use <code className="text-amber-400">terraform plan</code> or <code className="text-amber-400">terraform apply &lt;resource&gt;</code>
                        <br />
                        Resources: profile, skills, projects, contact
                    </div>
                </div>
            )
        }]);
    };

    const processCommand = async (rawCmd: string) => {
        const cmd = rawCmd.trim().toLowerCase();
        setIsProcessing(true);
        setCommandHistory(prev => [...prev, rawCmd]);
        setHistoryIndex(-1);



        // Global Clear Handler for Select Mode
        if (cmd === "clear" && mode === "SELECT_MODE") {
            setLogs(bootLogsRef.current);
            setIsProcessing(false);
            return;
        }

        // Echo command
        setLogs(prev => [...prev, {
            type: "command",
            content: <span className="flex items-center gap-2 font-medium text-emerald-600 dark:text-cyber-green"><ChevronRight size={14} /> {rawCmd}</span>
        }]);

        // 1. CONTACT FORM FLOW
        if (contactStep !== "NONE") {
            await new Promise(r => setTimeout(r, 400));

            if (contactStep === "NAME") {
                setContactData(prev => ({ ...prev, name: cmd }));
                setLogs(prev => [...prev, { type: "output", content: <span className="text-zinc-400">Hello {cmd}. Please enter your email:</span> }]);
                setContactStep("EMAIL");
                setPlaceholder("Enter your email...");
            } else if (contactStep === "EMAIL") {
                setContactData(prev => ({ ...prev, email: cmd }));
                setLogs(prev => [...prev, { type: "output", content: <span className="text-zinc-400">Got it. Now, what's your message?</span> }]);
                setContactStep("MESSAGE");
                setPlaceholder("Enter message...");
            } else if (contactStep === "MESSAGE") {
                // Submit logic
                setLogs(prev => [...prev, { type: "output", content: <span className="text-cyber-green">Sending transmission...</span> }]);
                await new Promise(r => setTimeout(r, 1000));
                setLogs(prev => [...prev, { type: "output", content: <span className="text-emerald-400 font-bold">✔ Message received. We will be in touch.</span> }]);
                setContactStep("NONE");
                setPlaceholder(mode === "MEDIUM" ? "root@portfolio:~/infrastructure#" : "Type a command...");
            }
            setIsProcessing(false);
            return;
        }

        // Small delay purely for UX rhythm, can be removed if blocking
        await new Promise(r => setTimeout(r, 100));



        // 1. MODE SELECTION
        if (mode === "SELECT_MODE") {
            if (cmd === "1" || cmd.includes("easy")) {
                setMode("EASY");
                setPlaceholder("Type number (1-5) or command...");
                setLogs(prev => [...prev, {
                    type: "output",
                    content: (
                        <div className="text-zinc-300">
                            <span className="text-[#10b981]">✔ Easy Mode Activated.</span>
                            <br />
                            Loaded Menu Interface.
                        </div>
                    )
                }]);
                // Defer menu render to ensure sequential log
                setTimeout(renderEasyMenu, 50);
            } else if (cmd === "2" || cmd.includes("medium")) {
                setMode("MEDIUM");
                setPlaceholder("root@portfolio:~/infrastructure#");
                renderMediumBanner();
            } else {
                setLogs(prev => [...prev, { type: "output", content: <span className="text-red-400">Invalid selection. Type 1 or 2.</span> }]);
            }
            setIsProcessing(false);
            return;
        }

        // 2. EASY MODE
        if (mode === "EASY") {
            processEasyCommand(cmd);
            setIsProcessing(false);
            return;
        }

        // 3. MEDIUM MODE (IaC)
        if (mode === "MEDIUM") {
            await processMediumCommand(cmd); // await because medium commands might have longer animated delays
            setIsProcessing(false);
            return;
        }
    };

    const handleExit = async () => {
        setLogs(prev => [...prev, { type: "output", content: <span className="text-red-400 font-bold">Terminating session...</span> }]);
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 800));
        setMode("SELECT_MODE");
        setPlaceholder("Select [1] or [2]...");

        // Re-show selection menu
        setLogs(prev => [...prev, {
            type: "output",
            content: (
                <div className="mb-2 mt-4 p-3 border border-dashed border-zinc-700 rounded bg-zinc-900/50">
                    <p className="text-zinc-100 font-bold mb-2">SELECT INTERFACE MODE:</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="text-sm">
                            <span className="text-[#10b981] font-bold">[1] EASY</span>
                            <span className="text-zinc-500 block text-xs">Menu-based navigation</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-amber-400 font-bold">[2] MEDIUM</span>
                            <span className="text-zinc-500 block text-xs">Engineering / IaC Mode</span>
                        </div>
                    </div>
                </div>
            )
        }]);
        setIsProcessing(false);
    };

    // --- EASY MODE HANDLER ---
    const processEasyCommand = (cmd: string) => {
        // If viewing content, STRICTLY only allow 0/back
        if (viewingContent) {
            if (cmd === "0" || cmd === "back") {
                setViewingContent(false);
                setViewingContent(false);
                renderEasyMenu();
                return;
            } else {
                setLogs(prev => [...prev, { type: "output", content: <span className="text-red-400">Restricted. Type <strong className="text-white">0</strong> to go back.</span> }]);
                return;
            }
        }

        // Normal Menu Handling
        switch (cmd) {
            case "1": case "about": setViewingContent(true); return renderAbout();
            case "2": case "skills": setViewingContent(true); return renderSkills();
            case "3": case "lab": case "projects": setViewingContent(true); return renderProjects();
            case "4": case "contact": setViewingContent(true); return renderContact();
            case "5": case "clear":
                setLogs([]);
                renderEasyMenu();
                return;
            case "6": case "exit": return handleExit();
            case "0": case "back": return; // Already at root, do nothing or show invalid
            case "help":
                setLogs(prev => [...prev, { type: "output", content: <span className="text-zinc-400">Enter a number 1-6.</span> }]);
                return;
            default:
                setLogs(prev => [...prev, { type: "output", content: <span className="text-red-400">Invalid command. Type help or 1-6.</span> }]);
        }
    };

    // --- MEDIUM MODE HANDLER (IaC) ---
    const processMediumCommand = async (cmd: string) => {
        if (cmd === "clear") {
            setLogs([]);
            renderMediumBanner();
            return;
        }

        if (cmd === "exit") {
            handleExit();
            return;
        }



        if (cmd === "help") {
            setLogs(prev => [...prev, {
                type: "output",
                content: (
                    <div className="text-zinc-300 text-sm">
                        Available Infrastructure Commands:
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-zinc-400">
                            <li>terraform plan - <span className="text-zinc-500">Preview changes</span></li>
                            <li>terraform apply [resource] - <span className="text-zinc-500">Deploy resource</span></li>
                            <li>clear - <span className="text-zinc-500">Clear console</span></li>
                            <li>exit - <span className="text-zinc-500">Return to mode selection</span></li>
                        </ul>
                    </div>
                )
            }]);
            return;
        }

        if (cmd === "terraform plan") {
            setLogs(prev => [...prev, {
                type: "output",
                content: (
                    <div className="text-emerald-400 font-mono text-xs">
                        Refreshing state...<br />
                        <span className="text-yellow-400">~ update profile_data</span><br />
                        <span className="text-green-400">+ create skills_cluster</span><br />
                        <span className="text-green-400">+ create project_gateway</span><br />
                        <br />
                        Plan: 4 to add, 1 to change, 0 to destroy.
                    </div>
                )
            }]);
            return;
        }

        if (cmd.startsWith("terraform apply")) {
            const resource = cmd.replace("terraform apply", "").trim();

            // Simulation Animation
            const steps = [
                `[aws] acquiring state lock...`,
                `[aws] reading ${resource || 'configuration'}...`,
                `[aws] provisioning ${resource || 'all'}...`,
            ];

            for (const step of steps) {
                setLogs(prev => [...prev, { type: "output", content: <span className="text-zinc-500 text-xs">{step}</span> }]);
                await new Promise(r => setTimeout(r, 400));
            }

            setLogs(prev => [...prev, { type: "output", content: <span className="text-emerald-500 font-bold text-xs">Apply complete! Resources: 1 added, 0 destroyed.</span> }]);
            await new Promise(r => setTimeout(r, 200));

            // Show Content
            switch (resource) {
                case "profile": case "about": renderAbout(); break;
                case "skills": renderSkills(); break;
                case "projects": case "lab": renderProjects(); break;
                case "contact": renderContact(); break;
                default:
                    setLogs(prev => [...prev, { type: "output", content: <span className="text-red-400">Error: Resource '{resource}' not defined in main.tf</span> }]);
            }
            return;
        }

        // Fallback
        setLogs(prev => [...prev, { type: "output", content: <span className="text-red-400">Unknown command: {cmd}</span> }]);
    };


    // --- RENDER HELPERS ---
    const renderAbout = () => {
        setLogs(prev => [...prev, {
            type: "output",
            content: (
                <div className="mt-2 space-y-3 text-sm bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="text-zinc-500 text-xs font-bold tracking-wider uppercase min-w-[60px]">NAME</span>
                        <span className="text-zinc-100 font-bold text-lg">{profile.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="text-zinc-500 text-xs font-bold tracking-wider uppercase min-w-[60px]">ROLE</span>
                        <span className="text-cyber-green font-medium bg-emerald-950/30 px-2 py-0.5 rounded-md inline-block w-fit">{profile.role}</span>
                    </div>
                    <div className="flex flex-col sm:flex-start gap-1 sm:gap-4 mt-3 pt-3 border-t border-zinc-800">
                        <span className="text-zinc-500 text-xs font-bold tracking-wider uppercase min-w-[60px] mt-1">BIO</span>
                        <p className="text-zinc-300 leading-relaxed">{profile.bio}</p>
                    </div>
                    {mode === 'EASY' ? (
                        <div className="mt-4"><span className="text-red-500 font-bold">0.</span> <span className="text-zinc-100 font-bold">Back</span></div>
                    ) : (
                        <div className="mt-4 text-zinc-500 italic text-xs">Ready for next resource. OR <span className="not-italic">Type 'exit' to quit.</span></div>
                    )}
                </div>
            )
        }]);
    };

    const renderSkills = () => {
        setLogs(prev => [...prev, {
            type: "output",
            content: (
                <div className="mt-2 space-y-3">
                    {skills.map(skill => (
                        <div key={skill.id} className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 min-w-[150px] sm:min-w-[200px]">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-cyber-green shadow shadow-emerald-500/50" />
                                <span className="text-zinc-200 font-medium">{skill.name}</span>
                            </div>
                            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-cyber-green to-emerald-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                            <span className="text-cyber-green font-mono font-bold text-xs min-w-[45px] text-right">{skill.level}%</span>
                        </div>
                    ))}
                    {mode === 'EASY' ? (
                        <div className="mt-4"><span className="text-red-500 font-bold">0.</span> <span className="text-zinc-100 font-bold">Back</span></div>
                    ) : (
                        <div className="mt-4 text-zinc-500 italic text-xs">Ready for next resource. OR <span className="not-italic">Type 'exit' to quit.</span></div>
                    )}
                </div>
            )
        }]);
    };

    const renderProjects = () => {
        setLogs(prev => [...prev, {
            type: "output",
            content: (
                <div className="mt-2 grid gap-4 grid-cols-1">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 hover:border-cyber-green/50 transition-all hover:shadow-lg hover:shadow-cyber-green/5"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2">
                                <a href={project.link} target="_blank" className="font-bold text-base text-zinc-100 hover:text-cyber-green transition-colors flex items-center gap-2">
                                    {project.title}
                                    <ChevronRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-500" />
                                </a>
                                <div className="flex gap-1 flex-wrap">
                                    {project.techStack.slice(0, 3).map((tech, i) => (
                                        <span key={i} className="text-[10px] px-2 py-1 bg-zinc-900 text-zinc-400 rounded-md border border-zinc-800 font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-3">{project.description}</p>
                        </motion.div>
                    ))}
                    {mode === 'EASY' ? (
                        <div className="mt-4"><span className="text-red-500 font-bold">0.</span> <span className="text-zinc-100 font-bold">Back</span></div>
                    ) : (
                        <div className="mt-4 text-zinc-500 italic text-xs">Ready for next resource. OR <span className="not-italic">Type 'exit' to quit.</span></div>
                    )}
                </div>
            )
        }]);
    };

    const renderContact = () => {
        setLogs(prev => [...prev, {
            type: "output",
            content: (
                <div className="mt-2 space-y-2 text-sm bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 group">
                        <span className="text-zinc-500 text-xs font-bold tracking-wider uppercase min-w-[70px]">EMAIL</span>
                        <a href={`mailto:${profile.email}`} className="text-zinc-200 font-medium hover:text-cyber-green transition-colors break-all">{profile.email}</a>
                    </div>
                    <div className="w-full h-px bg-zinc-800 my-2" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 group">
                        <span className="text-zinc-500 text-xs font-bold tracking-wider uppercase min-w-[70px]">GITHUB</span>
                        <a href={profile.github} target="_blank" className="text-zinc-200 font-medium hover:text-cyber-green transition-colors break-all">{profile.github}</a>
                    </div>
                    <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 my-2" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 group">
                        <span className="text-zinc-500 text-xs font-bold tracking-wider uppercase min-w-[70px]">LINKEDIN</span>
                        <a href={profile.linkedin} target="_blank" className="text-zinc-200 font-medium hover:text-cyber-green transition-colors break-all">{profile.linkedin}</a>
                    </div>
                    {mode === 'EASY' ? (
                        <div className="mt-4"><span className="text-red-500 font-bold">0.</span> <span className="text-zinc-100 font-bold">Back</span></div>
                    ) : (
                        <div className="mt-4 text-zinc-500 italic text-xs">Ready for next resource. OR <span className="not-italic">Type 'exit' to quit.</span></div>
                    )}
                </div>
            )
        }]);
    };

    const onSubmit = (data: { command: string, honeypot?: string }) => {
        // HONEY POT CHECK
        if (data.honeypot) {
            console.error("BOT DETECTED: Honeypot field filled.");
            setLogs(prev => [...prev,
            { type: "command", content: data.command },
            { type: "output", content: <span className="text-red-500 font-bold bg-red-950/20 p-1 border border-red-500/50 rounded">⛔ IDS ALERT: ANOMALOUS TRAFFIC DETECTED. CONNECTION TERMINATED.</span> }
            ]);
            reset();
            return;
        }

        const cmd = data.command.trim();
        if (!cmd) return;

        // Execute logic FIRST, then clear input
        // This ensures the command is captured before any state resets interfere
        processCommand(cmd);

        // Reset inputs
        setValue("command", "");
        reset({ command: "" });
        setSuggestions([]);

        // Keep focus
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    return (
        <div className="w-full h-[600px] flex flex-col font-mono text-sm bg-zinc-950/80 border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl">
            {/* Window Header */}
            <div className="relative z-20 bg-zinc-900/30 backdrop-blur-md p-4 border-b border-white/[0.04]">
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Terminal size={18} className="text-zinc-400" />
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-100 text-sm tracking-wide">Terminal</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${mode === 'MEDIUM'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20'
                                }`}>
                                {mode === "BOOT" || mode === "SELECT_MODE" ? "v3.2.5" : mode}
                            </span>
                        </div>
                    </div>
                    {mode === 'MEDIUM' ? (
                        <ShieldAlert size={14} className="text-amber-500" />
                    ) : (
                        <Cpu size={14} className="text-zinc-600" />
                    )}
                </div>
            </div>

            {/* Terminal Body */}
            <TerminalLogs logs={logs} isProcessing={isProcessing} />

            {/* Input Area */}
            <div className="relative z-30">
                {/* Suggestions */}
                <AnimatePresence>
                    {suggestions.length > 0 && currentInput && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute bottom-full left-0 right-0 bg-zinc-900 border-x border-t border-white/[0.05] p-2 space-y-1 shadow-lg max-h-40 overflow-y-auto custom-scrollbar"
                        >
                            {suggestions.map((suggestion) => (
                                <div
                                    key={suggestion}
                                    className="px-3 py-1.5 hover:bg-zinc-800 rounded cursor-pointer text-sm flex items-center justify-between group transition-colors"
                                    onClick={() => {
                                        setValue("command", suggestion);
                                        setSuggestions([]);
                                        inputRef.current?.focus();
                                    }}
                                >
                                    <span className="text-[#10b981] font-medium">{suggestion}</span>
                                    <span className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">TAB</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className={`flex items-center gap-2 p-3 relative border-t border-white/[0.04] bg-zinc-950/50 ${!isOnline ? 'opacity-50 pointer-events-none' : ''}`}>
                    <ChevronRight size={14} className={mode === "MEDIUM" ? "text-amber-500" : "text-[#10b981]"} />

                    {/* HONEY POT FIELD - Hidden from humans, visible to bots */}
                    <input
                        {...register("honeypot")}
                        type="text"
                        className="opacity-0 absolute w-0 h-0 pointer-events-none"
                        tabIndex={-1}
                        autoComplete="off"
                    />

                    <input
                        {...register("command")}
                        ref={(e) => {
                            register("command").ref(e);
                            // @ts-ignore
                            inputRef.current = e;
                        }}
                        className="bg-transparent border-none outline-none text-zinc-100 w-full placeholder:text-zinc-700 text-sm font-medium"
                        placeholder={placeholder}
                        autoComplete="off"
                        autoFocus
                        onKeyDown={handleKeyDown}
                        disabled={!isOnline}
                    />
                </form>

                {/* Status Bar */}
                <div className="relative z-20 grid grid-cols-3 gap-px bg-white/[0.04] border-t border-white/[0.04] text-[10px] sm:text-xs font-mono select-none">
                    {/* Segment 1: System Status */}
                    <div className="bg-zinc-950 px-3 py-1.5 flex items-center gap-2 group hover:bg-zinc-900 transition-colors">
                        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#10b981]' : 'bg-red-500 animate-pulse'} shadow-sm`} />
                        <span className={`${isOnline ? 'text-zinc-400' : 'text-red-400'} uppercase font-bold tracking-tight truncate`}>
                            {isOnline ? "ONLINE" : "OFFLINE"}
                        </span>
                    </div>

                    {/* Segment 2: Network / Latency */}
                    <div className="bg-zinc-950 px-3 py-1.5 flex items-center justify-center gap-3 border-x border-white/[0.04] overflow-hidden">
                        <div className="flex gap-0.5 items-end h-3">
                            <div className="w-0.5 h-1 bg-[#10b981]/30" />
                            <div className="w-0.5 h-2 bg-[#10b981]/50" />
                            <div className="w-0.5 h-3 bg-[#10b981]/80" />
                        </div>
                        <span className="text-zinc-500 font-medium">
                            <span className="text-[#10b981]">NET:</span> SECURE
                        </span>
                        <div className="hidden sm:flex items-center gap-1 text-zinc-600">
                            <span>⚡</span>
                            <span>12ms</span>
                        </div>
                    </div>

                    {/* Segment 3: Session / Mode */}
                    <div className="bg-zinc-950 px-3 py-1.5 flex items-center justify-end gap-2 text-right">
                        <span className="text-zinc-500 uppercase font-bold hidden sm:inline">MODE:</span>
                        <span className={`font-bold px-1.5 rounded ${mode === 'MEDIUM' ? 'text-amber-400 bg-amber-500/10' :
                            mode === 'EASY' ? 'text-[#10b981] bg-[#10b981]/10' :
                                'text-zinc-400'
                            }`}>
                            {mode}
                        </span>
                    </div>
                </div>
            </div>
            {/* Offline Overlay - Full Terminal Coverage */}
            {!isOnline && (
                <div className="absolute inset-0 top-14 bottom-10 bg-black/95 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-8 border-y border-red-900/30">
                    <div className="text-red-500 font-bold text-xl sm:text-2xl mb-2 tracking-widest animate-pulse">SYSTEM OFFLINE</div>
                    <div className="text-zinc-500 text-xs sm:text-sm font-mono mb-4">MAINTENANCE MODE</div>
                    <div className="text-red-500/50 text-[10px] font-mono border border-red-900/50 p-2 rounded bg-red-950/10">
                        Access Restricted
                    </div>
                </div>
            )}
        </div>
    );
}
