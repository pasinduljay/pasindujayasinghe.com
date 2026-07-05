import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const dynamic = "force-dynamic";

// Helper to check admin auth session
async function checkAuth() {
    const session = await getServerSession(authOptions);
    return !!session;
}

// GET: Retrieve last 30 login attempts
export async function GET() {
    try {
        if (!(await checkAuth())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const attemptsList = await prisma.loginAttempt.findMany({
            orderBy: { timestamp: "desc" },
            take: 30
        });

        return NextResponse.json({ success: true, data: attemptsList });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
