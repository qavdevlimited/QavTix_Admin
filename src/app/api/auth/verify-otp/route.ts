import { accessCookieOptions, refreshCookieOptions } from "@/components-data/cookie-keys"
import { ADMIN_VERIFY_OTP_ENDPOINT, ADMIN_PROFILE_ENDPOINT } from "@/endpoints"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_VERIFY_OTP_ENDPOINT}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[admin verify otp] status:", res.status)
            console.log("[admin verify otp] raw json:", JSON.stringify(json, null, 2))

            return NextResponse.json({ message: json?.message || "Verification failed." }, { status: res.status })
        }

        const { tokens } = json.data || {}
        let user = json.data?.user;

        // Fetch profile if not returned in verification response
        if (!user && tokens?.access) {
            const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_PROFILE_ENDPOINT}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens.access}`
                }
            });
            if (profileRes.ok) {
                const profileJson = await profileRes.json();
                user = profileJson.data?.user || profileJson.data;
            }
        }

        const response = NextResponse.json(
            { message: json.message, user },
            { status: 200 }
        )

        if (tokens?.access) {
            response.cookies.set("admin_access_token", tokens.access, accessCookieOptions)
        }

        if (tokens?.refresh) {
            response.cookies.set("admin_refresh_token", tokens.refresh, refreshCookieOptions)
        }

        return response

    } catch (err) {
        console.log("[admin verify otp] caught error:", err)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
