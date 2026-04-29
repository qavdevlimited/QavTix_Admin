"use server"

import { CATEGORIES_ENDPOINT, EVENT_TICKET_TYPES_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { CACHE_TAGS } from "@/cache-tags"
import { cacheTag } from "next/cache"
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

export interface TicketType {
    id: number
    ticket_type: string
    price: string
    quantity: number
    sold_count: number
}

// ─── Cached GETs — token passed as arg ───────────────────────────────────────

async function _getCategories(token: string | undefined): Promise<GetCategoriesResult> {
    'use cache'
    cacheTag(CACHE_TAGS.CATEGORIES)
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CATEGORIES_ENDPOINT}`
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
        if (!res.ok) return { success: false, data: [] }
        const json = await res.json()
        return { success: true, data: json.data ?? [] }
    } catch {
        return { success: false, data: [] }
    }
}

// ─── fetchTicketTypes — reads own token (client component calls this directly) ─

export async function getCategories(token: string | undefined): Promise<GetCategoriesResult> {
    return _getCategories(token)
}

export async function fetchTicketTypes(eventId: string): Promise<TicketType[]> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_access_token")?.value
        const axios = await getServerAxios(token)
        const { data } = await axios.get(EVENT_TICKET_TYPES_ENDPOINT(eventId))
        return data?.data ?? []
    } catch {
        return []
    }
}
