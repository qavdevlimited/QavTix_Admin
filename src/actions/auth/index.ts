"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const logOut = async () => {
    const cookiesStore = await cookies()
    cookiesStore.delete("admin_access_token")
    cookiesStore.delete("admin_refresh_token")
    redirect(process.env.NEXT_PUBLIC_APP_DOMAIN || "/")
}