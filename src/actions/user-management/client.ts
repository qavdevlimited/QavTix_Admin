"use server"

import { getServerAxios } from "@/lib/axios"
import { CACHE_TAGS } from "@/cache-tags"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

export async function toggleUserSuspension(userId: string | number): Promise<{ success: boolean; message?: string }> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
        await axios.post(`/administrator/admin/users/${userId}/suspend/`)
        revalidateTag(CACHE_TAGS.ADMIN_USERS, 'max')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to toggle user suspension" }
    }
}
