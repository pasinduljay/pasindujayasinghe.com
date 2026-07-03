"use client";

import { PortfolioData } from "@/lib/data";
import { savePortfolioData } from "@/lib/actions";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Loader2 } from "lucide-react";
import React, { useCallback } from "react";
import SkillItem from "./SkillItem";
import ProjectItem from "./ProjectItem";
import { toast } from "sonner";


import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useSystemStatus } from "@/context/SystemStatusContext";

export default function AdminDashboard({ initialData }: { initialData: PortfolioData }) {
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"profile" | "skills" | "projects" | "settings">("profile");

    const { register, control, handleSubmit, reset, formState: { isDirty, errors } } = useForm<PortfolioData>({
        defaultValues: initialData,
    });

    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
        control,
        name: "skills",
    });

    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
        control,
        name: "projects",
    });

    // Memoized callbacks
    const memoRemoveSkill = useCallback((i: number) => removeSkill(i), [removeSkill]);
    const memoRemoveProject = useCallback((i: number) => removeProject(i), [removeProject]);
    const memoAppendSkill = useCallback(() => appendSkill({ id: Date.now().toString(), name: "", category: "DevOps", level: 50 }), [appendSkill]);
    const memoAppendProject = useCallback(() => appendProject({ id: Date.now().toString(), title: "", description: "", techStack: [], link: "" }), [appendProject]);

    const onSubmit = async (data: PortfolioData) => {
        setSaving(true);
        await savePortfolioData(data);
        reset(data); // Reset form with new data to clear isDirty state
        setSaving(false);
        toast.success("System Saved", {
            description: "Configuration updated successfully.",
            duration: 2000,
        });
    };

    return (
        <div className="bg-[#262626] p-5 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 pb-2 border-b border-white/5 items-center justify-between">
                <div className="flex gap-2">
                    {["profile", "skills", "projects", "settings"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2.5 rounded-full font-bold text-xs tracking-widest transition-all duration-300 uppercase ${activeTab === tab
                                ? "bg-white text-black shadow-lg shadow-white/10"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all"
                >
                    <LogOut size={16} className="text-red-500 group-hover:text-red-400 transition-colors" />
                    <span className="text-[10px] font-bold tracking-widest text-red-500 group-hover:text-red-400 transition-colors uppercase">Logout</span>
                </button>
            </div>

            {activeTab !== "settings" && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {activeTab === "profile" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-6 bg-cyber-green rounded-full"></div>
                                <h3 className="text-xl font-black text-white tracking-tight">IDENTITY_CORE</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-cyber-green uppercase tracking-wider ml-1">Full Name</label>
                                    <input {...register("profile.name")} className="w-full bg-black/40 border border-white/10 text-white p-3 rounded-xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none text-sm" placeholder="Name" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-cyber-green uppercase tracking-wider ml-1">Role Title</label>
                                    <input {...register("profile.role")} className="w-full bg-black/40 border border-white/10 text-white p-3 rounded-xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none text-sm" placeholder="Role" />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-mono text-cyber-green uppercase tracking-wider ml-1">Professional Bio</label>
                                    <textarea {...register("profile.bio")} className="w-full bg-black/40 border border-white/10 text-white p-3 rounded-xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none min-h-[80px] text-sm" placeholder="Bio" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-cyber-green uppercase tracking-wider ml-1">Base Location</label>
                                    <input {...register("profile.location")} className="w-full bg-black/40 border border-white/10 text-white p-3 rounded-xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none text-sm" placeholder="Location" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-cyber-green uppercase tracking-wider ml-1">Contact Email</label>
                                    <input {...register("profile.email")} className="w-full bg-black/40 border border-white/10 text-white p-3 rounded-xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none text-sm" placeholder="Email" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-cyber-green uppercase tracking-wider ml-1">GitHub URL</label>
                                    <input {...register("profile.github")} className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-2xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none" placeholder="GitHub URL" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-cyber-green uppercase tracking-wider ml-1">LinkedIn URL</label>
                                <input {...register("profile.linkedin")} className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-2xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none" placeholder="LinkedIn URL" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-cyber-green uppercase tracking-wider ml-1">Twitter URL</label>
                                    <input {...register("profile.twitterUrl")} className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-2xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none" placeholder="Twitter URL" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-cyber-green uppercase tracking-wider ml-1">Reddit URL</label>
                                    <input {...register("profile.redditUrl")} className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-2xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none" placeholder="Reddit URL" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-cyber-green uppercase tracking-wider ml-1">Facebook URL</label>
                                    <input {...register("profile.facebookUrl")} className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-2xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none" placeholder="Facebook URL" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-cyber-green uppercase tracking-wider ml-1">Book Call URL</label>
                                <input {...register("profile.bookCallUrl")} className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-2xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none" placeholder="Booking Page URL" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-cyber-green uppercase tracking-wider ml-1">WhatsApp URL</label>
                                <input {...register("profile.whatsappUrl")} className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-2xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none" placeholder="https://wa.me/..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-cyber-green uppercase tracking-wider ml-1">Resume / Bio Data URL</label>
                                <input
                                    {...register("profile.resumeUrl", {
                                        pattern: {
                                            value: /^https?:\/\/.+/,
                                            message: "Must be a valid HTTP/HTTPS URL"
                                        }
                                    })}
                                    className={`w-full bg-black/40 border ${errors.profile?.resumeUrl ? 'border-red-500' : 'border-white/10'} text-white p-4 rounded-2xl focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all outline-none`}
                                    placeholder="https://pub-xxxxxxxx.r2.dev/resume.pdf"
                                />
                                <p className="text-[10px] text-gray-500 font-mono ml-1">* Official External URL required (e.g. Cloudflare R2). Local paths not supported.</p>
                                {errors.profile?.resumeUrl && <p className="text-[10px] text-red-400 font-mono ml-1">{errors.profile.resumeUrl.message}</p>}
                            </div>

                            {/* Site Identity Section (Isolated) */}
                            <div className="pt-6 border-t border-white/10 mt-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-6 bg-cyber-cyan rounded-full"></div>
                                    <h3 className="text-xl font-black text-white tracking-tight">SITE_METADATA (BROWSER TAB)</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-cyber-cyan/5 p-4 rounded-2xl border border-cyber-cyan/10">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-mono text-cyber-cyan uppercase tracking-wider ml-1">Site Title Name</label>
                                        <input {...register("siteIdentity.siteName")} className="w-full bg-black/40 border border-white/10 text-white p-3 rounded-xl focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all outline-none text-sm" placeholder="Browser Tab Name" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-mono text-cyber-cyan uppercase tracking-wider ml-1">Site Title Role</label>
                                        <input {...register("siteIdentity.siteRole")} className="w-full bg-black/40 border border-white/10 text-white p-3 rounded-xl focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all outline-none text-sm" placeholder="Browser Tab Role" />
                                    </div>
                                    <p className="text-[10px] text-gray-500 md:col-span-2 font-mono">* These values update the Browser Tab Title only. They do not affect the main page hero section.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "skills" && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1 h-8 bg-cyber-green rounded-full"></div>
                                <h3 className="text-2xl font-black text-white tracking-tight">CAPABILITY_MATRIX</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {skillFields.map((field, index) => (
                                    <SkillItem key={field.id} index={index} removeSkill={memoRemoveSkill} />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={memoAppendSkill}
                                className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 text-gray-400 hover:border-cyber-green hover:text-cyber-green hover:bg-cyber-green/5 transition-all font-mono text-sm uppercase tracking-wider"
                            >
                                + Add New Vector
                            </button>
                        </div>
                    )}

                    {activeTab === "projects" && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1 h-8 bg-cyber-green rounded-full"></div>
                                <h3 className="text-2xl font-black text-white tracking-tight">SYSTEM_DEPLOYMENTS</h3>
                            </div>

                            <div className="space-y-6">
                                {projectFields.map((field, index) => (
                                    <ProjectItem key={field.id} index={index} removeProject={memoRemoveProject} />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={memoAppendProject}
                                className="w-full py-3 rounded-xl bg-cyber-green/5 border border-dashed border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10 transition-all font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <span>+ Deploy New Interface</span>
                            </button>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end border-t border-white/5 mt-4">
                        <button
                            type="submit"
                            disabled={saving || !isDirty}
                            className="bg-white text-black font-bold px-6 py-2.5 rounded-full text-sm hover:bg-cyber-green transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving && <Loader2 className="animate-spin" size={16} />}
                            <span>SAVE CHANGES</span>
                        </button>
                    </div>
                </form>
            )}

            {activeTab === "settings" && <SettingsTab />}
        </div>
    );
}

function SettingsTab() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { isOnline, toggleOnline, isVaultOnline, toggleVaultOnline } = useSystemStatus();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { updateAdminCredentials } = await import("@/lib/actions");

        const res = await updateAdminCredentials(username, password);
        setLoading(false);

        if (res.success) {
            toast.success("Credentials Updated", { description: "Please log in with new details next time." });
            setUsername("");
            setPassword("");
        } else {
            toast.error("Update Failed", { description: res.error });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-cyber-orange rounded-full"></div>
                <h3 className="text-2xl font-black text-white tracking-tight">SECURITY_CONFIG</h3>
            </div>

            {/* Terminal System Status Toggle */}
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                <div>
                    <h4 className="text-white font-bold text-lg">Terminal System Status</h4>
                    <p className="text-zinc-400 text-xs mt-1">Enable/Disable the public terminal interface.</p>
                </div>
                <button
                    onClick={toggleOnline}
                    className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 relative ${isOnline ? 'bg-white' : 'bg-zinc-800'}`}
                    aria-label="Toggle System Status"
                >
                    <div
                        className={`w-5 h-5 rounded-full shadow-lg transform transition-transform duration-300 ease-out flex items-center justify-center ${isOnline ? 'translate-x-7 bg-black' : 'translate-x-0 bg-zinc-400'}`}
                    >
                    </div>
                </button>
            </div>

            {/* Vault System Status Toggle */}
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                <div>
                    <h4 className="text-white font-bold text-lg">Credentials Vault Status</h4>
                    <p className="text-zinc-400 text-xs mt-1">Enable/Disable the credentials vault feature.</p>
                </div>
                <button
                    onClick={toggleVaultOnline}
                    className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 relative ${isVaultOnline ? 'bg-white' : 'bg-zinc-800'}`}
                    aria-label="Toggle Vault Status"
                >
                    <div
                        className={`w-5 h-5 rounded-full shadow-lg transform transition-transform duration-300 ease-out flex items-center justify-center ${isVaultOnline ? 'translate-x-7 bg-black' : 'translate-x-0 bg-zinc-400'}`}
                    >
                    </div>
                </button>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider ml-1">New Username</label>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-2xl focus:border-cyber-orange focus:ring-1 focus:ring-cyber-orange transition-all outline-none"
                        placeholder="Leave blank to keep current"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-2xl focus:border-cyber-orange focus:ring-1 focus:ring-cyber-orange transition-all outline-none"
                        placeholder="Leave blank to keep current"
                    />
                </div>
                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || (!username && !password)}
                        className="bg-white text-black font-bold px-8 py-3 rounded-xl text-sm hover:bg-gray-200 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>}
                        <span>UPDATE SYSTEM CREDENTIALS</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
