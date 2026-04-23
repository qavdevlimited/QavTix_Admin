"use server"

import { CATEGORIES_ENDPOINT, EVENT_TICKET_TYPES_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

export interface ApiCategory {
    id: number
    name: string
}

export interface GetCategoriesResult {
    success: boolean
    data: ApiCategory[]
    message?: string
}

// Categories are near-static — 24 h cache is appropriate
export async function getCategories(): Promise<GetCategoriesResult> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_access_token")?.value
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CATEGORIES_ENDPOINT}`
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.CATEGORIES], revalidate: 86400 },
        })
        if (!res.ok) return { success: false, data: [] }
        const json = await res.json()
        return { success: true, data: json.data ?? [] }
    } catch {
        return { success: false, data: [] }
    }
}


export async function fetchTicketTypes(eventId: string): Promise<TicketType[]> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(EVENT_TICKET_TYPES_ENDPOINT(eventId))
        return data?.data ?? []
    } catch {
        return []
    }
}
