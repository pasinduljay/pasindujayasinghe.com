import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@/prisma/client";
import bcrypt from "bcryptjs";

// Use a global prisma client in development to prevent too many connections
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = (globalForPrisma.prisma && "blockedIp" in globalForPrisma.prisma)
    ? globalForPrisma.prisma
    : new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    const headers = req?.headers || {};
                    const ip = headers["x-forwarded-for"]?.split(",")[0] || headers["x-real-ip"] || "127.0.0.1";

                    // 1. Check block status
                    const { checkIpBlock } = await import("@/lib/security");
                    const blockStatus = await checkIpBlock(ip);
                    if (blockStatus.blocked) {
                        throw new Error(`IP_LOCKED_OUT: ${blockStatus.reason}`);
                    }

                    const { username, password } = credentials || {};
                    if (!username || !password) return null;

                    // Fetch user from DB
                    const user = await prisma.user.findUnique({
                        where: { username }
                    });

                    const { logFailedAttempt, logSuccessfulAttempt } = await import("@/lib/security");

                    if (!user) {
                        await logFailedAttempt(ip, username);
                        return null;
                    }

                    const isValid = await bcrypt.compare(password, user.password);

                    if (isValid) {
                        await logSuccessfulAttempt(ip);
                        return { id: user.id, name: user.username, email: "admin@example.com" };
                    } else {
                        const blocked = await logFailedAttempt(ip, username);
                        if (blocked) {
                            throw new Error("IP_LOCKED_OUT: Brute-force lockout (5 failed attempts within 15 mins)");
                        }
                    }
                } catch (error: any) {
                    console.error("Auth Error:", error);
                    if (error.message && error.message.startsWith("IP_LOCKED_OUT")) {
                        throw new Error(error.message);
                    }
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async session({ session, token: _token }) {
            return session;
        },
        async jwt({ token, user: _user }) {
            return token;
        }
    }
};
