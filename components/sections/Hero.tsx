"use client";

import { useState, useEffect } from "react";
import { Profile, Skill, Project } from "@/lib/data";
import Container from "@/components/ui/Container";
import ThemeToggle from "@/components/ui/ThemeToggle";
import dynamic from "next/dynamic";

const InteractiveGlobe = dynamic(() => import("@/components/ui/InteractiveGlobe"), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-[300px] aspect-square flex items-center justify-center font-mono text-[8px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            Initializing telemetry globe...
        </div>
    )
});
import { 
    Terminal, 
    ArrowRight, 
    Cpu, 
    Database, 
    Server, 
    Layers, 
    CheckCircle,
    Activity,
    Lock,
    ExternalLink,
    Check,
    Clock,
    Package,
    HardDrive,
    MoreHorizontal,
    Pencil,
    Trash2,
    Settings
} from "lucide-react";
import Image from "next/image";

type ViewType = "dashboard" | "clusters" | "deployments" | "telemetry" | "compute" | "storage" | "firewall";

// ─── Per-view content panels ───────────────────────────────────────────────

function DashboardPanel({ cpu, ram, uptime }: { cpu: number; ram: number; uptime: { days: number; hours: number; minutes: number; seconds: number } }) {
    return (
        <>
            <div className="space-y-4 relative z-20 w-full">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight font-sans">
                    Infrastructure Control Center
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    <div className="bg-background/80 dark:bg-black/30 border border-zinc-200/60 dark:border-white/[0.05] rounded-xl p-3 flex flex-col justify-between gap-1 shadow-sm">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">COMPLIANCE STACK</span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">SOC2 &amp; PCI-DSS Gateway</span>
                        <div className="flex items-center gap-1.5 text-[9px] text-[#10b981] font-mono font-semibold">
                            <span className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
                            <span>ZERO-TRUST BOUNDARY</span>
                        </div>
                    </div>
                    <div className="bg-background/80 dark:bg-black/30 border border-zinc-200/60 dark:border-white/[0.05] rounded-xl p-3 flex flex-col justify-between gap-1 shadow-sm">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">HYPERVISORS</span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">Hybrid Cloud Hypervisors</span>
                        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-mono">3 Active Servers</span>
                    </div>
                    <div className="bg-background/80 dark:bg-black/30 border border-zinc-200/60 dark:border-white/[0.05] rounded-xl p-3 flex flex-col justify-between gap-1 shadow-sm">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">CLOUD LINK</span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">AWS Transit Gateway</span>
                        <div className="flex items-center gap-1.5 text-[9px] text-amber-500 font-mono font-semibold">
                            <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                            <span>TUNNEL_1 ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative w-full h-[240px] flex items-center justify-center pointer-events-auto">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[240px] h-[240px] bg-emerald-500/5 rounded-full blur-[50px]" />
                </div>
                <InteractiveGlobe />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-zinc-200/80 dark:border-white/[0.08] relative z-20 bg-background/95 dark:bg-black/60 backdrop-blur-md rounded-2xl shadow-md">
                <div>
                    <span className="block text-[8px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">CPU CORE LOAD</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">{cpu}%</span>
                </div>
                <div>
                    <span className="block text-[8px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">MEMORY BLOCK</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">{ram} GB</span>
                </div>
                <div>
                    <span className="block text-[8px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">HEALTH CHECKS</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span> 100% OK
                    </span>
                </div>
                <div>
                    <span className="block text-[8px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">NODE UPTIME</span>
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 font-mono">
                        {uptime.days}d {uptime.hours}h {uptime.minutes}m
                    </span>
                </div>
            </div>
        </>
    );
}

function ClustersPanel() {
    const [selected, setSelected] = useState<string | null>(null);
    const clusters = [
        {
            name: "k8s-ap-prod-01",
            provider: "Oracle Cloud",
            region: "ap-singapore-1",
            endpoint: "10.0.1.14",
            port: "6443",
            k8sVersion: "v1.29.4",
            nodes: 6,
            status: "Healthy",
            cpu: 72,
            mem: 61,
            created: "May 11, 2025, 6:15 PM",
        },
        {
            name: "k8s-eu-prod-01",
            provider: "AWS EC2",
            region: "eu-central-1",
            endpoint: "18.184.22.107",
            port: "6443",
            k8sVersion: "v1.28.9",
            nodes: 4,
            status: "Healthy",
            cpu: 48,
            mem: 55,
            created: "May 5, 2025, 9:04 PM",
        },
        {
            name: "k8s-us-dev-01",
            provider: "Self-Hosted",
            region: "us-east-2",
            endpoint: "192.168.10.5",
            port: "6443",
            k8sVersion: "v1.27.14",
            nodes: 2,
            status: "Degraded",
            cpu: 31,
            mem: 40,
            created: "Apr 28, 2025, 3:20 PM",
        },
    ];

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/[0.05] pb-4">
                <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight font-sans flex items-center gap-2">
                        <Server size={16} className="text-zinc-600 dark:text-zinc-400" />
                        Servers
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-sans">
                        Add servers to deploy your applications remotely.
                    </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 px-2 py-0.5 rounded-lg">
                    {clusters.filter(c => c.status === "Healthy").length}/{clusters.length} ONLINE
                </span>
            </div>

            {/* Server Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {clusters.map(c => (
                    <div
                        key={c.name}
                        onClick={() => setSelected(selected === c.name ? null : c.name)}
                        className={`group bg-background/90 dark:bg-black/35 border rounded-2xl shadow-sm cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between
                            ${selected === c.name
                                ? "border-zinc-900 dark:border-white/30 shadow-md bg-zinc-50/50 dark:bg-white/[0.01]"
                                : "border-zinc-200/60 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.12] hover:shadow-md"
                            }`}
                    >
                        {/* Card Content */}
                        <div className="p-4 flex flex-col gap-3.5">
                            {/* Title Row */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400">
                                        <Server size={13} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wide truncate">
                                            {c.name}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={e => { e.stopPropagation(); }}
                                    className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
                                >
                                    <MoreHorizontal size={14} />
                                </button>
                            </div>

                            {/* Deploy status and Health indicator */}
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200/50 dark:border-white/[0.05] text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                                    deploy
                                </span>
                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-1
                                    ${c.status === "Healthy"
                                        ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                                        : "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
                                    }`}>
                                    <span className={`w-1 h-1 rounded-full ${c.status === "Healthy" ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
                                    {c.status.toUpperCase()}
                                </span>
                            </div>

                            {/* Info Rows */}
                            <div className="space-y-2 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-white/[0.04] pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-400 dark:text-zinc-500">IP / Port</span>
                                    <span className="text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                                        <span className="bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200/50 dark:border-white/[0.05] px-1.5 py-0.5 rounded font-bold blur-[4px] hover:blur-none select-none transition-all duration-300 cursor-help" title="Hover to reveal IP">{c.endpoint}</span>
                                        <span className="text-zinc-400 dark:text-zinc-500">Port: <span className="font-semibold text-zinc-700 dark:text-zinc-300 blur-[3px] hover:blur-none select-none transition-all duration-300 cursor-help" title="Hover to reveal port">{c.port}</span></span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-400 dark:text-zinc-500">Provider</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 font-semibold">{c.provider}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-400 dark:text-zinc-500">Nodes / Version</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 font-semibold">{c.nodes} nodes · {c.k8sVersion}</span>
                                </div>
                            </div>

                            {/* CPU & Memory Mini Progress Tracker */}
                            <div className="grid grid-cols-2 gap-3 bg-zinc-50/50 dark:bg-black/20 border border-zinc-100 dark:border-white/[0.03] rounded-xl p-2.5 mt-0.5">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[9px] font-mono">
                                        <span className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold">CPU</span>
                                        <span className={`font-bold ${c.cpu > 70 ? "text-amber-500" : "text-emerald-500"}`}>{c.cpu}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${c.cpu > 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${c.cpu}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[9px] font-mono">
                                        <span className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold">MEM</span>
                                        <span className="font-bold text-blue-500 dark:text-blue-400">{c.mem}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${c.mem}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Setup Server Button Container */}
                        <div className="px-4 pb-3">
                            <button
                                onClick={e => { e.stopPropagation(); }}
                                className="w-full py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-100 border border-zinc-900 dark:border-transparent transition-all shadow-sm"
                            >
                                <span>Setup Server</span>
                                <Settings size={12} className="text-zinc-400 dark:text-zinc-650 group-hover:rotate-45 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Card Divider */}
                        <div className="border-t border-zinc-100 dark:border-white/[0.04]" />

                        {/* Card Footer */}
                        <div className="px-4 py-2.5 flex items-center justify-between bg-zinc-50/20 dark:bg-black/10">
                            <span className="flex items-center gap-1 text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                                <Clock size={10} />
                                Created {c.created}
                            </span>
                            <div className="flex items-center gap-0.5">
                                {[
                                    { icon: <Terminal size={11} />, label: "Terminal" },
                                    { icon: <Pencil size={11} />, label: "Edit" },
                                    { icon: <Activity size={11} />, label: "Metrics" },
                                ].map(action => (
                                    <button
                                        key={action.label}
                                        title={action.label}
                                        onClick={e => e.stopPropagation()}
                                        className="p-1.5 rounded text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
                                    >
                                        {action.icon}
                                    </button>
                                ))}
                                <div className="w-[1px] h-3.5 bg-zinc-200 dark:bg-white/[0.06] mx-1" />
                                <button
                                    title="Delete"
                                    onClick={e => e.stopPropagation()}
                                    className="p-1.5 rounded text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 size={11} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Server Button Footer Row */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={() => alert("Server provision request initiated...")}
                    className="py-2 px-4 text-xs font-bold rounded-xl bg-zinc-950 text-white dark:bg-white/[0.04] dark:text-white border border-zinc-800 dark:border-white/[0.08] hover:bg-zinc-900 dark:hover:bg-white/[0.08] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
                >
                    <span className="text-sm font-semibold">+</span>
                    <span>Create Server</span>
                </button>
            </div>
        </div>
    );
}

function DeploymentsPanel() {
    const deployments = [
        { name: "api-gateway",       version: "v2.4.1", env: "prod",    status: "Running",  ago: "2m" },
        { name: "auth-service",      version: "v1.9.0", env: "prod",    status: "Running",  ago: "15m" },
        { name: "frontend-app",      version: "v3.1.2", env: "prod",    status: "Running",  ago: "1h" },
        { name: "worker-queue",      version: "v1.2.5", env: "staging", status: "Pending",  ago: "5m" },
        { name: "analytics-service", version: "v0.8.3", env: "staging", status: "Stopped",   ago: "32m" },
    ];
    const statusColors: Record<string, string> = {
        Running: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
        Pending:  "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
        Failed:   "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20",
        Stopped:  "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700",
    };
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight font-sans">Deployments</h3>
                <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/[0.04] border border-border px-2 py-0.5 rounded">12 total</span>
            </div>
            <div className="space-y-2">
                {deployments.map(d => (
                    <div key={d.name} className="bg-background/80 dark:bg-black/30 border border-zinc-200/60 dark:border-white/[0.06] rounded-xl px-4 py-3 flex items-center justify-between shadow-sm gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                            <Package size={12} className="text-zinc-400 flex-shrink-0" />
                            <div className="min-w-0">
                                <div className="text-[11px] font-bold text-zinc-900 dark:text-white font-mono truncate">{d.name}</div>
                                <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400">{d.version} · {d.env}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1"><Clock size={8} />{d.ago} ago</span>
                            <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${statusColors[d.status]}`}>{d.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TelemetryPanel({ cpu, ram }: { cpu: number; ram: number }) {
    // Real-time CloudWatch streaming histories (pre-filled with mock baseline data)
    const [cpuHistory, setCpuHistory] = useState<number[]>([12, 14, 15, 11, 13, 16, 14, 15, 17, 13, 14, 12, 15, 16, Math.round(cpu)]);
    const [ramHistory, setRamHistory] = useState<number[]>([]);
    const [diskHistory, setDiskHistory] = useState<number[]>([11.23, 11.24, 11.23, 11.24, 11.24, 11.23, 11.24, 11.24, 11.24, 11.24, 11.24, 11.24, 11.24, 11.24, 11.24]);
    
    // Initialize Memory Usage history centered around 1.74 GiB
    useEffect(() => {
        if (ramHistory.length === 0) {
            const initial = Array.from({ length: 15 }, () => parseFloat((1.70 + Math.random() * 0.08).toFixed(2)));
            setRamHistory(initial);
        }
    }, [ramHistory.length]);

    // Sync with live parent node metrics
    useEffect(() => {
        setCpuHistory(prev => [...prev.slice(1), Math.round(cpu)]);
    }, [cpu]);

    useEffect(() => {
        if (ramHistory.length > 0) {
            // Map parent RAM (4.10 to 4.35) into the visual range around 1.74 GiB
            const scaled = parseFloat((1.70 + (ram - 4.10) * 0.16).toFixed(2));
            setRamHistory(prev => [...prev.slice(1), scaled]);
        }
    }, [ram, ramHistory.length]);

    useEffect(() => {
        setDiskHistory(prev => [...prev.slice(1), parseFloat((11.24 + (Math.random() - 0.5) * 0.02).toFixed(2))]);
    }, [cpu]);

    // Tooltip tracking states
    const [cpuHoverIdx, setCpuHoverIdx] = useState<number | null>(null);
    const [ramHoverIdx, setRamHoverIdx] = useState<number | null>(null);
    const [diskHoverIdx, setDiskHoverIdx] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/[0.05] pb-4">
                <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight font-sans">Telemetry</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-sans">
                        Real-time CloudWatch monitors and Docker engine disk usage.
                    </p>
                </div>
            </div>

            {/* 2x2 Grid of Telemetry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                
                {/* 1. CPU Usage Card */}
                <div className="bg-background/90 dark:bg-black/35 border border-zinc-200/60 dark:border-white/[0.06] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                    <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-white font-sans">CPU Usage</div>
                        <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">Used: {cpuHistory[cpuHistory.length - 1]}%</div>
                    </div>
                    {/* Progress track */}
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${cpuHistory[cpuHistory.length - 1]}%` }} />
                    </div>
                    {/* CloudWatch Line Chart */}
                    <div className="relative h-[120px] w-full mt-1">
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 320 120"
                            onMouseMove={e => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const pct = (e.clientX - rect.left - 35) / (rect.width - 45);
                                const idx = Math.max(0, Math.min(cpuHistory.length - 1, Math.round(pct * (cpuHistory.length - 1))));
                                setCpuHoverIdx(idx);
                            }}
                            onMouseLeave={() => setCpuHoverIdx(null)}
                        >
                            <defs>
                                <linearGradient id="cpuAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Horizontal grid lines */}
                            {[20, 40, 60, 80, 100].map((y, i) => (
                                <line key={i} x1="35" y1={y} x2="310" y2={y} stroke="currentColor" className="text-zinc-200 dark:text-white/[0.05]" strokeWidth="0.5" strokeDasharray="2 2" />
                            ))}
                            {/* Y-Axis scale labels */}
                            <text x="30" y="23" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">100%</text>
                            <text x="30" y="43" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">75%</text>
                            <text x="30" y="63" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">50%</text>
                            <text x="30" y="83" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">25%</text>
                            <text x="30" y="103" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">0%</text>
                            
                            {/* SVG Line and gradient area */}
                            {(() => {
                                const points = cpuHistory.map((v, i) => {
                                    const x = 35 + (i / (cpuHistory.length - 1)) * 275;
                                    const y = 100 - (v / 100) * 80;
                                    return { x, y };
                                });
                                const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                const areaD = `${pathD} L ${points[points.length - 1].x} 100 L 35 100 Z`;
                                return (
                                    <>
                                        <path d={areaD} fill="url(#cpuAreaGrad)" />
                                        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                                        {/* AWS CloudWatch style hover pointer and vertical rule */}
                                        {cpuHoverIdx !== null && points[cpuHoverIdx] && (
                                            <>
                                                <line x1={points[cpuHoverIdx].x} y1="20" x2={points[cpuHoverIdx].x} y2="100" stroke="#3b82f6" strokeWidth="0.75" strokeDasharray="1 1" />
                                                <circle cx={points[cpuHoverIdx].x} cy={points[cpuHoverIdx].y} r="3" fill="#3b82f6" stroke="white" strokeWidth="1" />
                                                <rect x={Math.max(35, Math.min(240, points[cpuHoverIdx].x - 35))} y="4" width="70" height="15" rx="3" fill="black" opacity="0.8" />
                                                <text x={Math.max(35, Math.min(240, points[cpuHoverIdx].x - 35)) + 35} y="14" textAnchor="middle" fill="white" className="text-[7.5px] font-mono font-bold">
                                                    CPU: {cpuHistory[cpuHoverIdx]}%
                                                </text>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </svg>
                        {/* Legend */}
                        <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[8.5px] font-mono text-zinc-400 dark:text-zinc-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>CPU Usage</span>
                        </div>
                    </div>
                </div>

                {/* 2. Memory Usage Card */}
                <div className="bg-background/90 dark:bg-black/35 border border-zinc-200/60 dark:border-white/[0.06] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                    <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-white font-sans">Memory Usage</div>
                        <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">Used: {ramHistory[ramHistory.length - 1] || 1.74}GiB / Limit: 23.42GiB</div>
                    </div>
                    {/* Progress track */}
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full transition-all duration-500" style={{ width: `${((ramHistory[ramHistory.length - 1] || 1.74) / 23.42) * 100}%` }} />
                    </div>
                    {/* CloudWatch Line Chart */}
                    <div className="relative h-[120px] w-full mt-1">
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 320 120"
                            onMouseMove={e => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const pct = (e.clientX - rect.left - 35) / (rect.width - 45);
                                const idx = Math.max(0, Math.min(ramHistory.length - 1, Math.round(pct * (ramHistory.length - 1))));
                                setRamHoverIdx(idx);
                            }}
                            onMouseLeave={() => setRamHoverIdx(null)}
                        >
                            <defs>
                                <linearGradient id="memAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Horizontal grid lines */}
                            {[20, 46, 73, 100].map((y, i) => (
                                <line key={i} x1="35" y1={y} x2="310" y2={y} stroke="currentColor" className="text-zinc-200 dark:text-white/[0.05]" strokeWidth="0.5" strokeDasharray="2 2" />
                            ))}
                            {/* Y-Axis scale labels */}
                            <text x="30" y="23" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">23.42 GB</text>
                            <text x="30" y="49" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">12 GB</text>
                            <text x="30" y="76" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">6 GB</text>
                            <text x="30" y="103" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">0 GB</text>

                            {/* SVG Line and gradient area */}
                            {ramHistory.length > 0 && (() => {
                                const points = ramHistory.map((v, i) => {
                                    const x = 35 + (i / (ramHistory.length - 1)) * 275;
                                    const y = 100 - (v / 23.42) * 80;
                                    return { x, y };
                                });
                                const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                const areaD = `${pathD} L ${points[points.length - 1].x} 100 L 35 100 Z`;
                                return (
                                    <>
                                        <path d={areaD} fill="url(#memAreaGrad)" />
                                        <path d={pathD} fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" />
                                        {/* CloudWatch hover pointer */}
                                        {ramHoverIdx !== null && points[ramHoverIdx] && (
                                            <>
                                                <line x1={points[ramHoverIdx].x} y1="20" x2={points[ramHoverIdx].x} y2="100" stroke="#ec4899" strokeWidth="0.75" strokeDasharray="1 1" />
                                                <circle cx={points[ramHoverIdx].x} cy={points[ramHoverIdx].y} r="3" fill="#ec4899" stroke="white" strokeWidth="1" />
                                                <rect x={Math.max(35, Math.min(240, points[ramHoverIdx].x - 35))} y="4" width="70" height="15" rx="3" fill="black" opacity="0.8" />
                                                <text x={Math.max(35, Math.min(240, points[ramHoverIdx].x - 35)) + 35} y="14" textAnchor="middle" fill="white" className="text-[7.5px] font-mono font-bold">
                                                    MEM: {ramHistory[ramHoverIdx]} GB
                                                </text>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </svg>
                        {/* Legend */}
                        <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[8.5px] font-mono text-zinc-400 dark:text-zinc-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                            <span>Memory (GB)</span>
                        </div>
                    </div>
                </div>

                {/* 3. Disk Space Card */}
                <div className="bg-background/90 dark:bg-black/35 border border-zinc-200/60 dark:border-white/[0.06] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                    <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-white font-sans">Disk Space</div>
                        <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">Used: {diskHistory[diskHistory.length - 1]} GB / Limit: 173.32 GB</div>
                    </div>
                    {/* Progress track */}
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(diskHistory[diskHistory.length - 1] / 173.32) * 100}%` }} />
                    </div>
                    {/* CloudWatch Line Chart */}
                    <div className="relative h-[120px] w-full mt-1">
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 320 120"
                            onMouseMove={e => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const pct = (e.clientX - rect.left - 35) / (rect.width - 45);
                                const idx = Math.max(0, Math.min(diskHistory.length - 1, Math.round(pct * (diskHistory.length - 1))));
                                setDiskHoverIdx(idx);
                            }}
                            onMouseLeave={() => setDiskHoverIdx(null)}
                        >
                            <defs>
                                <linearGradient id="diskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Horizontal grid lines */}
                            {[20, 44, 68, 100].map((y, i) => (
                                <line key={i} x1="35" y1={y} x2="310" y2={y} stroke="currentColor" className="text-zinc-200 dark:text-white/[0.05]" strokeWidth="0.5" strokeDasharray="2 2" />
                            ))}
                            {/* Y-Axis scale labels */}
                            <text x="30" y="23" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">173.32 GB</text>
                            <text x="30" y="47" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">90 GB</text>
                            <text x="30" y="71" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">45 GB</text>
                            <text x="30" y="103" textAnchor="end" className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500">0 GB</text>

                            {/* SVG Line and gradient area */}
                            {(() => {
                                const points = diskHistory.map((v, i) => {
                                    const x = 35 + (i / (diskHistory.length - 1)) * 275;
                                    const y = 100 - (v / 173.32) * 80;
                                    return { x, y };
                                });
                                const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                const areaD = `${pathD} L ${points[points.length - 1].x} 100 L 35 100 Z`;
                                return (
                                    <>
                                        <path d={areaD} fill="url(#diskAreaGrad)" />
                                        <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                                        {/* CloudWatch hover pointer */}
                                        {diskHoverIdx !== null && points[diskHoverIdx] && (
                                            <>
                                                <line x1={points[diskHoverIdx].x} y1="20" x2={points[diskHoverIdx].x} y2="100" stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="1 1" />
                                                <circle cx={points[diskHoverIdx].x} cy={points[diskHoverIdx].y} r="3" fill="#f59e0b" stroke="white" strokeWidth="1" />
                                                <rect x={Math.max(35, Math.min(240, points[diskHoverIdx].x - 35))} y="4" width="70" height="15" rx="3" fill="black" opacity="0.8" />
                                                <text x={Math.max(35, Math.min(240, points[diskHoverIdx].x - 35)) + 35} y="14" textAnchor="middle" fill="white" className="text-[7.5px] font-mono font-bold">
                                                    Disk: {diskHistory[diskHoverIdx]} GB
                                                </text>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </svg>
                        {/* Legend */}
                        <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[8.5px] font-mono text-zinc-400 dark:text-zinc-550">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Disk Usage</span>
                        </div>
                    </div>
                </div>

                {/* 4. Docker Disk Usage Card */}
                <div className="bg-background/90 dark:bg-black/35 border border-zinc-200/60 dark:border-white/[0.06] rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[190px]">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-900 dark:text-white font-sans">Docker Disk Usage</span>
                            <span className="text-[10px] font-mono text-zinc-550 dark:text-zinc-400 mt-0.5">Total: 3.79 GB</span>
                        </div>
                        <button
                            title="Refresh Docker Metrics"
                            onClick={() => alert("Refreshed Docker filesystem data.")}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                    </div>

                    {/* Circular Donut Diagram */}
                    <div className="flex items-center justify-center gap-6 my-2">
                        <div className="relative w-[80px] h-[80px] flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-zinc-150 dark:text-zinc-800/80" strokeWidth="10" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="10" strokeDasharray="198.54 251.32" strokeDashoffset="0" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ec4899" strokeWidth="10" strokeDasharray="30.15 251.32" strokeDashoffset="-198.54" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="10" strokeDasharray="22.61 251.32" strokeDashoffset="-228.69" />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center leading-none">
                                <span className="text-[10px] font-mono font-bold text-zinc-900 dark:text-white">3.79 GB</span>
                                <span className="text-[6px] uppercase tracking-wider text-zinc-400 dark:text-zinc-550 mt-0.5">Docker</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col gap-1.5 text-[9px] font-mono">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-blue-500 flex-shrink-0" />
                                <span className="text-zinc-600 dark:text-zinc-350">Images (3.00 GB)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-pink-500 flex-shrink-0" />
                                <span className="text-zinc-600 dark:text-zinc-350">Containers (0.45 GB)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-amber-500 flex-shrink-0" />
                                <span className="text-zinc-600 dark:text-zinc-350">Volumes (0.34 GB)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ComputePoolsPanel() {
    const pools = [
        { name: "pool-general",  type: "General Purpose", vcpu: 64,  ram: "256 GB", nodes: 8,  util: 58 },
        { name: "pool-compute",  type: "Compute Optimized", vcpu: 128, ram: "128 GB", nodes: 4,  util: 74 },
        { name: "pool-memory",   type: "Memory Optimized", vcpu: 32,  ram: "512 GB", nodes: 2,  util: 43 },
    ];
    return (
        <div className="flex flex-col gap-4 w-full">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight font-sans">Compute Pools</h3>
            <div className="space-y-3">
                {pools.map(p => (
                    <div key={p.name} className="bg-background/80 dark:bg-black/30 border border-zinc-200/60 dark:border-white/[0.06] rounded-xl p-4 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="text-[11px] font-bold text-zinc-900 dark:text-white font-mono">{p.name}</div>
                                <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">{p.type}</div>
                            </div>
                            <Cpu size={13} className="text-zinc-400 mt-0.5 flex-shrink-0" />
                        </div>
                        <div className="flex gap-4 text-[9px] font-mono text-zinc-500 dark:text-zinc-400">
                            <span>{p.vcpu} vCPU</span>
                            <span>{p.ram}</span>
                            <span>{p.nodes} nodes</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-zinc-500 dark:text-zinc-400">
                                <span>Utilization</span><span className="font-semibold text-zinc-700 dark:text-zinc-300">{p.util}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${p.util > 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${p.util}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StorageVolumesPanel() {
    const volumes = [
        { name: "vol-db-primary",   size: "500 GB", type: "SSD Block",    used: 71, status: "Mounted" },
        { name: "vol-media-assets", size: "2 TB",   type: "Object Store",  used: 38, status: "Mounted" },
        { name: "vol-backups",      size: "4 TB",   type: "HDD Archive",   used: 55, status: "Mounted" },
        { name: "vol-logs",         size: "200 GB", type: "SSD Block",     used: 89, status: "Warning" },
    ];
    return (
        <div className="flex flex-col gap-4 w-full">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight font-sans">Storage Volumes</h3>
            <div className="space-y-2">
                {volumes.map(v => (
                    <div key={v.name} className="bg-background/80 dark:bg-black/30 border border-zinc-200/60 dark:border-white/[0.06] rounded-xl px-4 py-3 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <HardDrive size={12} className="text-zinc-400 flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-[11px] font-bold text-zinc-900 dark:text-white font-mono truncate">{v.name}</div>
                                    <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400">{v.size} · {v.type}</div>
                                </div>
                            </div>
                            <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${v.status === "Mounted" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"}`}>{v.status}</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-zinc-500 dark:text-zinc-400">
                                <span>Used</span><span className={`font-semibold ${v.used > 80 ? "text-amber-600 dark:text-amber-400" : "text-zinc-700 dark:text-zinc-300"}`}>{v.used}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${v.used > 80 ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${v.used}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FirewallPanel() {
    const rules = [
        { name: "allow-https-ingress",  action: "ALLOW", proto: "TCP",  port: "443", hits: "14.2K", active: true },
        { name: "allow-ssh-bastion",    action: "ALLOW", proto: "TCP",  port: "22",  hits: "891",   active: true },
        { name: "deny-all-inbound",     action: "DENY",  proto: "ANY",  port: "*",   hits: "3.7K",  active: true },
        { name: "allow-metrics-scrape", action: "ALLOW", proto: "TCP",  port: "9090", hits: "206K",  active: true },
    ];
    const certs = [
        { domain: "api.pasindu.dev",    expiry: "189 days", status: "Valid" },
        { domain: "cdn.pasindu.dev",    expiry: "62 days",  status: "Valid" },
        { domain: "auth.pasindu.dev",   expiry: "14 days",  status: "Renewing" },
    ];
    return (
        <div className="flex flex-col gap-4 w-full">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight font-sans">Firewall &amp; SSL</h3>
            <div className="bg-background/80 dark:bg-black/30 border border-zinc-200/60 dark:border-white/[0.06] rounded-xl p-4 shadow-sm space-y-2">
                <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-2">ACTIVE RULES</div>
                {rules.map(r => (
                    <div key={r.name} className="flex items-center justify-between gap-2 text-[10px] font-mono py-1 border-b border-zinc-100 dark:border-white/[0.04] last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className={`font-bold px-1 rounded text-[8px] ${r.action === "ALLOW" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{r.action}</span>
                            <span className="text-zinc-700 dark:text-zinc-300 truncate">{r.name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 text-zinc-500 dark:text-zinc-400 text-[9px]">
                            <span>{r.proto}:{r.port}</span>
                            <span className="text-zinc-400">{r.hits} hits</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-background/80 dark:bg-black/30 border border-zinc-200/60 dark:border-white/[0.06] rounded-xl p-4 shadow-sm space-y-2">
                <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-2">SSL CERTIFICATES</div>
                {certs.map(c => (
                    <div key={c.domain} className="flex items-center justify-between text-[10px] font-mono py-1 border-b border-zinc-100 dark:border-white/[0.04] last:border-0">
                        <div className="flex items-center gap-2">
                            <Lock size={9} className="text-zinc-400" />
                                                       <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${c.status === "Valid" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"}`}>{c.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Right sidebar per-view content ──────────────────────────────────────────

function RightSidebarContent({ view, cpu, ram }: { view: ViewType; cpu: number; ram: number }) {
    if (view === "dashboard") return (
        <>
            <div className="space-y-6">
                <div className="bg-background border border-border rounded-xl p-4 space-y-3 transition-colors duration-300 shadow-sm">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Cluster namespace status</span>
                    <div className="grid grid-cols-4 gap-1.5">
                        {['core', 'api', 'db', 'auth', 'web', 'cdn', 'sec', 'mon', 'dns', 'dns2', 'log', 'sync'].map((pod, idx) => (
                            <div key={pod} className="flex flex-col items-center justify-center p-1 bg-zinc-50 dark:bg-black/40 border border-border rounded text-[8px] font-mono transition-colors">
                                <span className="text-[7px] text-zinc-500 dark:text-zinc-400 truncate max-w-full select-none">{pod}</span>
                                <span className={`w-1 h-1 rounded-full mt-1 ${idx % 5 === 0 ? 'bg-zinc-300 dark:bg-zinc-700' : 'bg-emerald-500/80'}`} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-background border border-border rounded-xl p-4 space-y-3 transition-colors duration-300 shadow-sm">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Provisioned Allocations</span>
                    <div className="space-y-3 text-[10px]">
                        {[{ label: "hypervisor-ap-01", val: 72, unit: "CPU" }, { label: "hypervisor-eu-02", val: 48, unit: "RAM" }].map(a => (
                            <div key={a.label} className="space-y-1">
                                <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                                    <span>{a.label}</span>
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-300">{a.val}% {a.unit}</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full" style={{ width: `${a.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="pt-6 border-t border-border font-mono text-[9px] text-zinc-550 dark:text-zinc-400 flex items-center justify-between font-bold">
                <span>TELEMETRY SYNCED</span>
                <span className="text-zinc-500 dark:text-zinc-400">SECURE</span>
            </div>
        </>
    );

    if (view === "clusters") return (
        <div className="space-y-4">
            <div className="bg-background border border-border rounded-xl p-4 space-y-3 shadow-sm">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Server Health Summary</span>
                <div className="space-y-2">
                    {[
                        { label: "Total Servers", value: "3" },
                        { label: "Online Servers", value: "3 / 3" },
                        { label: "Active Services", value: "12" },
                        { label: "Avg CPU Load", value: `${Math.round(cpu)}%` }
                    ].map(s => (
                        <div key={s.label} className="flex justify-between text-[10px] font-mono border-b border-zinc-100 dark:border-white/[0.04] pb-1.5 font-sans">
                            <span className="text-zinc-500 dark:text-zinc-400">{s.label}</span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{s.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block mb-3">Events</span>
                <div className="space-y-2 text-[9px] font-mono">
                    <div className="flex gap-2 items-start"><span className="text-emerald-500 mt-0.5">●</span><span className="text-zinc-600 dark:text-zinc-400">Server k8s-ap-prod-01 connected successfully</span></div>
                    <div className="flex gap-2 items-start"><span className="text-emerald-500 mt-0.5">●</span><span className="text-zinc-600 dark:text-zinc-400">Server k8s-us-dev-01 CPU load stable at {Math.round(cpu)}%</span></div>
                    <div className="flex gap-2 items-start"><span className="text-emerald-500 mt-0.5">●</span><span className="text-zinc-600 dark:text-zinc-400">Cron backup completed on k8s-eu-prod-01</span></div>
                </div>
            </div>
        </div>
    );

    if (view === "deployments") return (
        <div className="space-y-4">
            <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block mb-3">Pipeline Status</span>
                <div className="space-y-2.5">
                    {[
                        { step: "Source checkout", done: true },
                        { step: "Unit tests",       done: true },
                        { step: "Docker build",     done: true },
                        { step: "Security scan",    done: true },
                        { step: "Deploy to prod",   done: false, active: true },
                    ].map(s => (
                        <div key={s.step} className="flex items-center gap-2 text-[10px] font-mono">
                            <span className={`w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-emerald-500/20 border border-emerald-500" : s.active ? "bg-amber-500/20 border border-amber-400 animate-pulse" : "bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"}`}>
                                {s.done && <Check size={6} className="text-emerald-500" />}
                            </span>
                            <span className={s.done ? "text-zinc-700 dark:text-zinc-300" : s.active ? "text-amber-600 dark:text-amber-400 font-semibold" : "text-zinc-400 dark:text-zinc-600"}>{s.step}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (view === "telemetry") {
        const memUsed = (1.70 + (ram - 4.10) * 0.16).toFixed(2);
        return (
            <div className="space-y-4">
                <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
                    <span className="text-[9px] font-mono text-zinc-555 uppercase tracking-widest font-bold block mb-3">Alert Manager</span>
                    <div className="space-y-2 text-[9px] font-mono">
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg">
                            <CheckCircle size={10} className="text-emerald-500 flex-shrink-0" />
                            <span className="text-emerald-750 dark:text-emerald-400 font-sans">CPU load optimal: k8s-us-dev-01 running at {Math.round(cpu)}%</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg">
                            <CheckCircle size={10} className="text-emerald-500 flex-shrink-0" />
                            <span className="text-emerald-750 dark:text-emerald-400 font-sans">Docker storage volume healthy: 3.79 GB utilized</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg">
                            <CheckCircle size={10} className="text-emerald-500 flex-shrink-0" />
                            <span className="text-emerald-750 dark:text-emerald-400 font-sans">System memory utilization within normal bounds ({memUsed} GiB / 23.42 GiB)</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // compute / storage / firewall — minimal right panel
    return (
        <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block mb-3">Quick Actions</span>
            <div className="space-y-2 text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                <div className="p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/[0.02] border border-zinc-100 dark:border-white/[0.04] cursor-pointer transition-colors">Refresh metrics</div>
                <div className="p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/[0.02] border border-zinc-100 dark:border-white/[0.04] cursor-pointer transition-colors">Export report</div>
                <div className="p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/[0.02] border border-zinc-100 dark:border-white/[0.04] cursor-pointer transition-colors">View audit log</div>
            </div>
        </div>
    );
}

// ─── Main Hero Component ──────────────────────────────────────────────────────

export default function Hero({ profile }: { profile: Profile; skills?: Skill[]; projects?: Project[] }) {
    const [activeView, setActiveView] = useState<ViewType>("dashboard");
    const [cpu, setCpu] = useState(12.4);
    const [ram, setRam] = useState(4.25);
    const [uptime, setUptime] = useState({ days: 2, hours: 4, minutes: 12, seconds: 40 });

    useEffect(() => {
        let isMounted = true;
        let isVisible = true;

        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        }, { threshold: 0 });

        const element = document.getElementById("hero-section");
        if (element) observer.observe(element);

        const uptimeInterval = setInterval(() => {
            if (!isMounted || !isVisible) return;
            setUptime(prev => {
                let s = prev.seconds + 1;
                let m = prev.minutes;
                let h = prev.hours;
                let d = prev.days;
                if (s >= 60) { s = 0; m += 1; }
                if (m >= 60) { m = 0; h += 1; }
                if (h >= 24) { h = 0; d += 1; }
                return { days: d, hours: h, minutes: m, seconds: s };
            });
        }, 1000);

        const metricsInterval = setInterval(() => {
            if (!isMounted || !isVisible) return;
            setCpu(prev => Math.max(5, Math.min(25, parseFloat((prev + (Math.random() - 0.5) * 2).toFixed(1)))));
            setRam(prev => Math.max(4.10, Math.min(4.35, parseFloat((prev + (Math.random() - 0.5) * 0.05).toFixed(2)))));
        }, 3000);

        return () => {
            isMounted = false;
            clearInterval(uptimeInterval);
            clearInterval(metricsInterval);
            observer.disconnect();
        };
    }, []);

    const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: string }[] = [
        { id: "clusters",     label: "Remote Servers", icon: <Server size={12} />,   badge: "3" },
        { id: "deployments",  label: "Deployments",  icon: <Layers size={12} />,   badge: "12" },
        { id: "telemetry",    label: "Telemetry",    icon: <Activity size={12} /> },
    ];
    const resourceItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
        { id: "compute",  label: "Compute Pools",   icon: <Cpu size={12} /> },
        { id: "storage",  label: "Storage Volumes", icon: <Database size={12} /> },
        { id: "firewall", label: "Firewall & SSL",  icon: <Lock size={12} /> },
    ];

    return (
        <section id="hero-section" className="relative min-h-screen bg-background text-foreground pt-12 pb-24 flex flex-col justify-start transition-colors duration-300">
            
            {/* 1. Header Navigation Bar */}
            <div className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
                <div className="max-w-[98%] 2xl:max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image 
                            src="/logo.jpeg" 
                            alt="Pasindu Jayasinghe Logo" 
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full border border-border object-cover shadow-sm select-none pointer-events-none" 
                        />
                        <span className="font-sans font-bold text-zinc-900 dark:text-white text-base tracking-tight select-none">
                            Pasindu Jayasinghe
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a 
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-border hover:bg-zinc-200 dark:hover:bg-white/[0.05] transition-all"
                        >
                            <span>GitHub</span>
                            <ExternalLink size={12} />
                        </a>
                        <a 
                            href={profile.bookCallUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-background bg-foreground hover:bg-foreground/90 font-semibold px-4 py-2 rounded-lg transition-colors mr-1"
                        >
                            Book Call
                        </a>
                        <div className="h-4 w-[1px] bg-border hidden sm:block mx-1"></div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* 2. Hero Content Section */}
            <Container className="mt-16 md:mt-24 w-full flex flex-col gap-16">
                
                {/* Hero Title & Description */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.08] font-sans">
                            Architecting Secure, High-Availability Cloud &amp; Virtual Systems
                        </h1>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <a 
                                href="#systems"
                                className="text-xs text-background bg-foreground hover:bg-foreground/90 font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 border border-transparent"
                            >
                                View Architectures
                                <ArrowRight size={14} />
                            </a>
                            <a 
                                href={profile.bookCallUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 font-semibold px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-white/10 transition-all bg-zinc-50/50 dark:bg-white/[0.02]"
                            >
                                Schedule Consultation
                            </a>
                        </div>
                    </div>
                    <div className="lg:col-span-5 pt-2 flex flex-col gap-4">
                        <p className="text-zinc-800 dark:text-zinc-300 text-sm md:text-base leading-relaxed font-normal font-sans select-text">
                            Deploy and optimize production workloads across Kubernetes clusters and serverless environments. Architecting high-availability infrastructure layouts with automated Trivy scans, Jenkins pipelines, and real-time observability telemetry.
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-mono leading-relaxed select-text border-l border-zinc-200 dark:border-white/10 pl-3">
                            Current Stack: Kubernetes, Docker, AWS, GCP, Terraform, GitHub Actions, Jenkins, SonarQube, Prometheus, Grafana.
                        </p>
                    </div>
                </div>

                {/* 3. Cloud Control Console — Interactive */}
                <div className="w-full bg-card/95 border border-border rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md transition-colors duration-300">
                    {/* Window Title Bar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-black/5 dark:bg-black/40 transition-colors duration-300">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
                            <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 ml-4 font-bold select-none">Cloud Console</span>
                        </div>

                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
                        
                        {/* Left Sidebar — 2 cols */}
                        <div className="lg:col-span-2 border-r border-border p-5 space-y-6 bg-black/[0.02] dark:bg-black/15 font-sans transition-colors duration-300">
                            <div className="space-y-2">
                                <span className="block text-[9px] font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-widest font-bold">DEVOPS PLATFORM</span>
                                <div className="space-y-0.5">
                                    {/* Dashboard shortcut */}
                                    <button
                                        onClick={() => setActiveView("dashboard")}
                                        className={`w-full text-left px-2 py-1.5 text-xs font-semibold rounded flex items-center gap-2 transition-colors ${activeView === "dashboard" ? "text-zinc-900 dark:text-white bg-zinc-200/50 dark:bg-white/[0.04]" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/30 dark:hover:bg-white/[0.02]"}`}
                                    >
                                        <Activity size={12} className="text-zinc-500 dark:text-zinc-400" />
                                        <span>Dashboard</span>
                                    </button>
                                    {navItems.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveView(item.id)}
                                            className={`w-full text-left px-2 py-1.5 text-xs font-semibold rounded flex items-center justify-between transition-colors ${activeView === item.id ? "text-zinc-900 dark:text-white bg-zinc-200/50 dark:bg-white/[0.04]" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/30 dark:hover:bg-white/[0.02]"}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="text-zinc-500 dark:text-zinc-400">{item.icon}</span>
                                                <span>{item.label}</span>
                                            </span>
                                            {item.badge && (
                                                <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-white/[0.05] px-1 rounded">{item.badge}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-[9px] font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-widest font-bold">RESOURCES</span>
                                <div className="space-y-0.5">
                                    {resourceItems.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveView(item.id)}
                                            className={`w-full text-left px-2 py-1.5 text-xs font-semibold rounded flex items-center gap-2 transition-colors ${activeView === item.id ? "text-zinc-900 dark:text-white bg-zinc-200/50 dark:bg-white/[0.04]" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/30 dark:hover:bg-white/[0.02]"}`}
                                        >
                                            <span className="text-zinc-500 dark:text-zinc-400">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Center Panel — 7 cols */}
                        <div className="lg:col-span-7 p-6 relative flex flex-col gap-4 min-h-[350px] lg:min-h-0 bg-black/[0.01] dark:bg-black/5 transition-colors duration-300 overflow-y-auto">
                            {activeView === "dashboard"   && <DashboardPanel cpu={cpu} ram={ram} uptime={uptime} />}
                            {activeView === "clusters"    && <ClustersPanel />}
                            {activeView === "deployments" && <DeploymentsPanel />}
                            {activeView === "telemetry"   && <TelemetryPanel cpu={cpu} ram={ram} />}
                            {activeView === "compute"     && <ComputePoolsPanel />}
                            {activeView === "storage"     && <StorageVolumesPanel />}
                            {activeView === "firewall"    && <FirewallPanel />}
                        </div>

                        {/* Right Sidebar — 3 cols */}
                        <div className="lg:col-span-3 border-l border-border p-6 flex flex-col justify-between bg-black/[0.01] dark:bg-black/15 font-sans transition-colors duration-300 overflow-y-auto">
                            <RightSidebarContent view={activeView} cpu={cpu} ram={ram} />
                        </div>

                    </div>
                </div>

                {/* 4. Brand Technology Badges Bar */}
                <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-8 md:gap-x-12 pt-4 border-t border-border select-none">
                    {["DOCKER", "KUBERNETES", "AWS", "TERRAFORM", "GCP", "GITHUB"].map(brand => (
                        <div key={brand} className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
                            <span className="font-bold text-xs uppercase tracking-wider font-mono">{brand}</span>
                        </div>
                    ))}
                </div>

                {/* 5. Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-4">
                    <div className="bg-card border border-border rounded-3xl p-8 hover:border-zinc-300 dark:hover:border-white/[0.08] transition-all duration-300">
                        <div className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3 font-sans">99.98%</div>
                        <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2 font-sans">Compliance-Ready Uptime</div>
                        <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed font-sans font-normal select-text">
                            Guaranteed operational continuity for production-scale workloads within Canadian regulatory compliance boundaries. Secured via high-availability replication nodes.
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-3xl p-8 hover:border-zinc-300 dark:hover:border-white/[0.08] transition-all duration-300">
                        <div className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3 font-sans">70%</div>
                        <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2 font-sans">CI/CD Cycle Reduction</div>
                        <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed font-sans font-normal select-text">
                            Accelerated build and deployment cycles by optimizing container image layer caching, parallel pipeline stages, and automated test gates.
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-3xl p-8 hover:border-zinc-300 dark:hover:border-white/[0.08] transition-all duration-300">
                        <div className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3 font-sans">40%</div>
                        <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2 font-sans">Workload Consolidation</div>
                        <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed font-sans font-normal select-text">
                            Achieved substantial hardware savings through hypervisor virtualization sizing, thin provisioning, and container allocation pruning.
                        </p>
                    </div>
                </div>

            </Container>
        </section>
    );
}
