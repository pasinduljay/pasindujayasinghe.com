import { NextRequest, NextResponse } from "next/server";
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

// GET: Retrieve all blocked IPs
export async function GET() {
    try {
        if (!(await checkAuth())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const blockedList = await prisma.blockedIp.findMany({
            orderBy: { blockedAt: "desc" }
        });

        return NextResponse.json({ success: true, data: blockedList });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Manually block an IP
export async function POST(request: NextRequest) {
    try {
        if (!(await checkAuth())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { ip, reason, durationHours } = body;

        if (!ip || !reason) {
            return NextResponse.json({ error: "IP and Reason are required" }, { status: 400 });
        }

        let expiresAt = null;
        if (durationHours && !isNaN(Number(durationHours))) {
            expiresAt = new Date(Date.now() + Number(durationHours) * 60 * 60 * 1000);
        }

        const record = await prisma.blockedIp.upsert({
            where: { ip },
            update: {
                reason,
                expiresAt,
                blockedAt: new Date()
            },
            create: {
                ip,
                reason,
                expiresAt
            }
        });

        return NextResponse.json({ success: true, data: record });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE: Manually unblock an IP
export async function DELETE(request: NextRequest) {
    try {
        if (!(await checkAuth())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { ip } = body;

        if (!ip) {
            return NextResponse.json({ error: "IP address is required" }, { status: 400 });
        }

        await prisma.blockedIp.delete({
            where: { ip }
        });

        // Also clean up failed login attempts for this IP to prevent immediate re-lockout
        await prisma.loginAttempt.deleteMany({
            where: { ip, success: false }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
