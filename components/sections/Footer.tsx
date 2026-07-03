import { Profile } from "@/lib/data";
import { ArrowUpRight, Github, Linkedin, Mail, MessageCircle, Twitter, Facebook, MessageSquare } from "lucide-react";

export default function Footer({ profile }: { profile: Profile }) {
    return (
        <footer id="contact" className="bg-zinc-50 dark:bg-background pt-16 pb-8 md:pt-20 md:pb-10 font-sans border-t border-border transition-colors duration-300">
            <div className="w-full mx-auto px-6 md:px-12 max-w-[98%] 2xl:max-w-[1800px]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4">

                    {/* Main CTA */}
                    <div className="md:col-span-8 bg-card p-6 md:p-10 rounded-3xl border border-border flex flex-col justify-between min-h-[250px] md:min-h-[320px] hover:border-zinc-300 dark:hover:border-white/10 transition-colors group shadow-sm dark:shadow-none">
                        <div>
                            <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-100 dark:bg-white text-black flex items-center justify-center mb-6 shadow-sm dark:shadow-white/10 group-hover:scale-110 transition-transform duration-300">
                                <Mail className="w-4 h-4 md:w-6 md:h-6" />
                            </span>
                            <h3 className="text-2xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">Have a project<br />in mind?</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-sm md:text-lg leading-relaxed font-light">I'm currently available for freelance work and open collaborations.</p>
                        </div>
                        <a
                            href={profile.bookCallUrl || `mailto:${profile.email}`}
                            target={profile.bookCallUrl ? "_blank" : undefined}
                            className="inline-flex items-center gap-2 text-zinc-900 dark:text-white hover:text-[#10b981] dark:hover:text-[#10b981] transition-colors mt-8 font-bold text-base md:text-xl"
                        >
                            Start a conversation <span className="text-xl">→</span>
                        </a>
                    </div>

                    {/* Social Block */}
                    <div className="md:col-span-4 bg-card p-6 md:p-8 rounded-3xl border border-border flex flex-col justify-center gap-0 hover:border-zinc-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
                        <a href={profile.github} target="_blank" className="flex items-center justify-between group py-4 md:py-5 border-b border-border last:border-0 hover:pl-2 transition-all duration-300">
                            <span className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors text-base md:text-lg font-medium">
                                <Github className="w-5 h-5" /> <span>GitHub</span>
                            </span>
                            <ArrowUpRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                        </a>

                        <a href={profile.linkedin} target="_blank" className="flex items-center justify-between group py-4 md:py-5 border-b border-border last:border-0 hover:pl-2 transition-all duration-300">
                            <span className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-white transition-colors text-base md:text-lg font-medium">
                                <Linkedin className="w-5 h-5" /> <span>LinkedIn</span>
                            </span>
                            <ArrowUpRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                        </a>

                        {profile.twitterUrl && (
                            <a href={profile.twitterUrl} target="_blank" className="flex items-center justify-between group py-4 md:py-5 border-b border-border last:border-0 hover:pl-2 transition-all duration-300">
                                <span className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-white transition-colors text-base md:text-lg font-medium">
                                    <Twitter className="w-5 h-5" /> <span>Twitter</span>
                                </span>
                                <ArrowUpRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                            </a>
                        )}

                        {profile.redditUrl && (
                            <a href={profile.redditUrl} target="_blank" className="flex items-center justify-between group py-4 md:py-5 border-b border-border last:border-0 hover:pl-2 transition-all duration-300">
                                <span className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-white transition-colors text-base md:text-lg font-medium">
                                    <MessageSquare className="w-5 h-5" /> <span>Reddit</span>
                                </span>
                                <ArrowUpRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                            </a>
                        )}

                        {profile.facebookUrl && (
                            <a href={profile.facebookUrl} target="_blank" className="flex items-center justify-between group py-4 md:py-5 border-b border-border last:border-0 hover:pl-2 transition-all duration-300">
                                <span className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-white transition-colors text-base md:text-lg font-medium">
                                    <Facebook className="w-5 h-5" /> <span>Facebook</span>
                                </span>
                                <ArrowUpRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                            </a>
                        )}

                        {profile.whatsappUrl && (
                            <a href={profile.whatsappUrl} target="_blank" className="flex items-center justify-between group py-4 md:py-5 border-b border-border last:border-0 hover:pl-2 transition-all duration-300">
                                <span className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-white transition-colors text-base md:text-lg font-medium">
                                    <MessageCircle className="w-5 h-5" /> <span>WhatsApp</span>
                                </span>
                                <ArrowUpRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                            </a>
                        )}

                        <a href={`mailto:${profile.email}`} className="flex items-center justify-between group py-4 md:py-5 border-b border-border last:border-0 hover:pl-2 transition-all duration-300 md:hidden">
                            <span className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors text-base md:text-lg font-medium">
                                <Mail className="w-5 h-5" /> <span>Email</span>
                            </span>
                            <ArrowUpRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                        </a>
                    </div>

                    {/* Status Block */}
                    <div className="md:col-span-12 bg-card p-5 md:p-6 rounded-3xl border border-border flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 font-sans gap-4 shadow-sm dark:shadow-none">
                        <p className="uppercase tracking-wider font-semibold">DESIGNED & BUILT BY {profile.name}</p>
                        <div className="flex items-center gap-3 font-mono text-[10px]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                            </span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-400">VERSION <span className="text-[#10b981] font-bold">1.2.9-BETA</span></span>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
