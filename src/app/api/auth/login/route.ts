import { ADMIN_LOGIN_ENDPOINT } from "@/endpoints"
import { NextRequest, NextResponse } from "next/server"

const STATUS_MESSAGES: Record<number, string> = {
    400: "Invalid credentials. Please check your email and password.",
    401: "Unauthorized. Please check your credentials.",
    403: "Access denied. You do not have permission to perform this action.",
    404: "Account not found. Please check your email address.",
    422: "Invalid input. Please check the information you entered.",
    429: "Too many attempts. Please wait a moment and try again.",
    500: "Server error. Please try again later.",
    502: "Service temporarily unavailable. Please try again later.",
    503: "Service temporarily unavailable. Please try again later.",
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_LOGIN_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[admin login] status:", res.status)
            console.log("[admin login] raw json:", JSON.stringify(json, null, 2))

            const message =
                STATUS_MESSAGES[res.status] ??
                json?.message ??
                `Something went wrong (${res.status}). Please try again.`

            return NextResponse.json({ message }, { status: res.status })
        }

        return NextResponse.json(
            { 
                message: json.message, 
                temp_token: json.data?.temp_token 
            },
            { status: 200 }
        )

    } catch (err) {
        console.log("[admin login] caught error:", err)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
