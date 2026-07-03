import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Use a global prisma client in development to prevent too many connections
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const { username, password } = credentials || {};
                    if (!username || !password) return null;

                    // Fetch user from DB
                    const user = await prisma.user.findUnique({
                        where: { username }
                    });

                    if (!user) return null;

                    const isValid = await bcrypt.compare(password, user.password);

                    if (isValid) {
                        return { id: user.id, name: user.username, email: "admin@example.com" };
                    }
                } catch (error) {
                    console.error("Auth Error:", error);
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
