"use server"

import {
    ADMIN_EVENTS_ENDPOINT,
    ADMIN_EVENTS_CARDS_ENDPOINT,
    ADMIN_EVENT_DETAIL_ENDPOINT,
    ADMIN_EVENT_ATTENDEES_ENDPOINT
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"


// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

// ─── Internal axios helpers (for non-cached / param-driven calls) ─────────────

async function fetchPage<T>(
    endpoint: string,
    extraParams?: Record<string, any>,
): Promise<TabSlice<T>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${endpoint}`, {
            params: { page: 1, ...extraParams },
        })
        const d = data?.data ?? data
        return {
            results: d?.results ?? [],
            count: d?.count ?? 0,
            next: d?.next ?? null,
            previous: d?.previous ?? null,
            total_pages: d?.total_pages ?? 1,
        }
    } catch {
        return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
    }
}

// ─── Cached event list (page 1, no filters) ───────────────────────────────────

export async function getAdminEvents(status?: string): Promise<TabSlice<AdminEvent>> {
    try {
        const token = await getToken()
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_EVENTS_ENDPOINT}`)
        url.searchParams.set("page", "1")
        if (status) url.searchParams.set("event_state", status)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.ADMIN_EVENTS], revalidate: 120 },
        })
        if (!res.ok) return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
        const json = await res.json()
        const d = json?.data ?? json
        return {
            results: d?.results ?? [],
            count: d?.count ?? 0,
            next: d?.next ?? null,
            previous: d?.previous ?? null,
            total_pages: d?.total_pages ?? 1,
        }
    } catch {
        return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
    }
}

export async function getAdminEventCards(params?: Record<string, any>): Promise<{ cards: AdminEventCards | null }> {
    try {
        const token = await getToken()
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_EVENTS_CARDS_ENDPOINT}`)
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v != null) url.searchParams.set(k, String(v))
            })
        }
        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.ADMIN_EVENT_CARDS], revalidate: 120 },
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminEventCards | null }
    } catch {
        return { cards: null }
    }
}

// ─── Non-cached (per-entity or filter-driven) ────────────────────────────────

export async function getAdminEventDetail(
    eventId: string,
): Promise<{ data: EventDetails | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_EVENT_DETAIL_ENDPOINT(eventId)}`)
        return { data: (data?.data ?? null) as EventDetails | null }
    } catch {
        return { data: null }
    }
}

export async function getAdminEventAttendees(
    eventId: string,
    params?: Record<string, any>,
): Promise<TabSlice<AdminEventAttendee>> {
    return fetchPage<AdminEventAttendee>(
        ADMIN_EVENT_ATTENDEES_ENDPOINT(eventId),
        params,
    )
}