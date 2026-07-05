import { NextRequest, NextResponse } from "next/server";
import { checkIpBlock } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "127.0.0.1";
    
    const check = await checkIpBlock(ip);
    
    return NextResponse.json({
        ip,
        blocked: check.blocked,
        reason: check.reason || null
    });
}
