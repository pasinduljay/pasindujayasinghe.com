"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(true);
            setLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#22c55e] font-mono relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>

            <Container className="max-w-md w-full relative z-10">
                <div className="bg-[#111]/90 p-8 border border-[#22c55e]/30 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.1)] backdrop-blur-sm">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 flex items-center justify-center border border-[#22c55e]/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#22c55e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </div>
                    </div>

                    <h1 className="text-2xl font-black mb-1 text-center tracking-tighter text-white">SYSTEM ACCESS</h1>
                    <p className="text-center text-xs text-gray-500 mb-8 uppercase tracking-widest">Identify Yourself</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-[#22c55e] uppercase tracking-wider pl-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all outline-none text-sm placeholder-gray-700"
                                placeholder="root"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-[#22c55e] uppercase tracking-wider pl-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all outline-none text-sm placeholder-gray-700"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-xs font-bold text-center flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                                INVALID CREDENTIALS
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#22c55e] text-black font-black py-3 rounded-lg hover:bg-[#1ea34d] transition-all text-sm tracking-widest uppercase hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? "AUTHENTICATING..." : "INITIALIZE SESSION"}
                        </button>
                    </form>
                </div>
            </Container>
        </div>
    );
}
