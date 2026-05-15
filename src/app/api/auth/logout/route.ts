import { accessCookieOptions, refreshCookieOptions } from "@/components-data/cookie-keys"
import { NextResponse } from "next/server"

export async function POST() {
    const response = NextResponse.json({ success: true })

    response.cookies.set("admin_access_token", "", {
        ...accessCookieOptions,
        maxAge: 0,
        expires: new Date(0),
    })
    response.cookies.set("admin_refresh_token", "", {
        ...refreshCookieOptions,
        maxAge: 0,
        expires: new Date(0),
    })

    return response
}
