import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

// Note: This API route will not work with static export (output: export)
// Deploy this as a separate API service or use serverless functions
// For static export, these exports are commented out
// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

const APP_TOKEN = process.env.SUMSUB_APP_TOKEN!;
const SECRET_KEY = process.env.SUMSUB_SECRET_KEY!;
const BASE_URL = process.env.SUMSUB_BASE_URL!;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const applicantId = searchParams.get("applicantId");

    if (!applicantId) {
        return NextResponse.json({ error: "applicantId is required" }, { status: 400 });
    }

    try {
        const url = `/resources/applicants/${applicantId}/one`;
        const ts = Math.floor(Date.now() / 1000).toString();
        const sig = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(ts + "GET" + url)
            .digest("hex");

        const res = await fetch(BASE_URL + url, {
            method: "GET",
            headers: {
                "X-App-Token": APP_TOKEN,
                "X-App-Access-Sig": sig,
                "X-App-Access-Ts": ts,
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json(errorData, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Sumsub status error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
