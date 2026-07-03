"use server";

import { updatePortfolioData, PortfolioData } from "@/lib/data";
import { revalidatePath } from "next/cache";

import fs from "fs/promises";
import path from "path";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function updateAdminCredentials(username?: string, password?: string) {
    try {
        // Find existing admin (assuming 'admin' or first user) or the user to update
        // The previous logic was single-user system via json.
        // We'll update the user 'admin' or create a new one if not exists?
        // Let's assume we are updating the currently logged in user ideally, but for now we target 'admin' username 
        // OR the username passed if it exists.

        // Simplified: We update the user with username 'admin' OR we update the user provided in arguments if we knew the ID.
        // Since we don't have ID here easily without session, let's assume we are updating the 'admin' user or the first user found.

        // Better approach: Update the user where username matches current config? 
        // The UI sends "New Username" and "New Password".
        // Use case: Changing default 'admin' to something else.

        // 1. Find the current admin user (we assume there is only one "admin" concept for now or we grab the first one)
        // Or we rely on session. But this action is server-side.

        // Let's default to finding user 'admin' or just 'luci' if that was set.
        // Limitation: If they renamed 'admin' to 'luci', we need to find 'luci'.
        // BUT we don't know the OLD username here unless we check session.

        // For this iteration, let's assume we are updating the user with id of the first user found in DB?
        // Or we just support updating the user 'admin' for now.
        // If the user changed their username, they must use that new username to login.

        // Hack: Get the first user in DB.
        const users = await prisma.user.findMany({ take: 1 });
        if (users.length === 0) return { success: false, error: "No user found" };

        const user = users[0];

        const updates: any = {};
        if (username && username.trim()) updates.username = username;
        if (password && password.trim()) updates.password = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: updates
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to update credentials:", error);
        return { success: false, error: "Failed to save credentials" };
    }
}

export async function savePortfolioData(formData: PortfolioData) {
    await updatePortfolioData(formData);
    revalidatePath("/");
    return { success: true };
}

export async function uploadImage(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file uploaded");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads
    const filename = "profile.jpg"; // Overwrite for simplicity in this version
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    // Ensure directory exists
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }

    await fs.writeFile(filepath, buffer);

    revalidatePath("/");
    return { success: true, path: `/uploads/${filename}?t=${Date.now()}` };
}
