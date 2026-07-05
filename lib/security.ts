import { PrismaClient } from "@/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = (globalForPrisma.prisma && "blockedIp" in globalForPrisma.prisma)
    ? globalForPrisma.prisma
    : new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function checkIpBlock(ip: string) {
    if (!ip) return { blocked: false };

    try {
        const record = await prisma.blockedIp.findUnique({
            where: { ip }
        });

        if (!record) return { blocked: false };

        // Check if block has expired
        if (record.expiresAt && new Date() > record.expiresAt) {
            // Expired block: delete it from the database
            await prisma.blockedIp.delete({
                where: { ip }
            });
            return { blocked: false };
        }

        return { blocked: true, reason: record.reason };
    } catch (error) {
        console.error("Database check failed for IP", ip, error);
        // Fallback to unblocked on database error so site stays operational
        return { blocked: false };
    }
}

export async function logFailedAttempt(ip: string, username: string) {
    if (!ip) return false;

    try {
        // 1. Log the failed attempt
        await prisma.loginAttempt.create({
            data: {
                ip,
                username: username || "unknown",
                success: false
            }
        });

        // 2. Count failed attempts from this IP in the last 15 minutes
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const failedCount = await prisma.loginAttempt.count({
            where: {
                ip,
                success: false,
                timestamp: { gte: fifteenMinutesAgo }
            }
        });

        // 3. Lockout if >= 5 attempts
        if (failedCount >= 5) {
            const blockReason = `Brute-force lockout (5 failed attempts within 15 mins)`;
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour block

            await prisma.blockedIp.upsert({
                where: { ip },
                update: {
                    reason: blockReason,
                    expiresAt
                },
                create: {
                    ip,
                    reason: blockReason,
                    expiresAt
                }
            });

            return true; // Lockout executed
        }
    } catch (error) {
        console.error("Failed to log login attempt for IP", ip, error);
    }
    return false;
}

export async function logSuccessfulAttempt(ip: string) {
    if (!ip) return;

    try {
        // Clear failed attempt logs for this IP on successful login
        await prisma.loginAttempt.deleteMany({
            where: { ip, success: false }
        });
    } catch (error) {
        console.error("Failed to clear login attempts for IP", ip, error);
    }
}
