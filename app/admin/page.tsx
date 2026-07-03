import { getPortfolioData } from "@/lib/data";
import AdminDashboard from "@/components/admin/AdminDashboard";
import Container from "@/components/ui/Container";

export default async function AdminPage() {
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
