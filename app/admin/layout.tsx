import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white font-mono relative">
            {/* View Site Button (Fixed Top Right) */}
            <Link
                href="/"
                target="_blank"
                className="fixed top-6 right-6 p-3 bg-[#1a1a1a] border border-white/10 rounded-full text-gray-400 hover:text-[#22c55e] hover:border-[#22c55e] transition-all z-50 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                title="View Live Site"
            >
                <ExternalLink size={20} />
            </Link>

            {children}
        </div>
    );
}
