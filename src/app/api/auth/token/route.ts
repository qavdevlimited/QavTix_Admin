import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_access_token")?.value

        return NextResponse.json({ token })
    } catch (error) {
        console.error("[api/auth/token] Error:", error)
        return NextResponse.json({ error: "Failed to retrieve token" }, { status: 500 })
    }
}
