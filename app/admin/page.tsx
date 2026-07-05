import { getPortfolioData } from "@/lib/data";
import AdminDashboard from "@/components/admin/AdminDashboard";
import Container from "@/components/ui/Container";
import { headers } from "next/headers";
import { checkIpBlock } from "@/lib/security";
import Preloader from "@/components/ui/Preloader";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || headerList.get("x-real-ip") || "127.0.0.1";

    const blockCheck = await checkIpBlock(ip);

    if (blockCheck.blocked) {
        return (
            <main className="min-h-screen bg-[#050508] text-white font-sans relative">
                <Preloader isBlocked={true} blockReason={blockCheck.reason} />
            </main>
        );
    }

    const data = await getPortfolioData();

    return (
        <div className="py-10">
            <Container>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">SYSTEM ADMINISTRATION</h1>
                    <p className="text-gray-400">Manage portfolio content and configurations.</p>
                </div>
                <AdminDashboard initialData={data} />
            </Container>
        </div>
    );
}
