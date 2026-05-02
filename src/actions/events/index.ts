

import { CACHE_TAGS } from "@/cache-tags"
import {
    ADMIN_EVENTS_ENDPOINT,
    ADMIN_EVENTS_CARDS_ENDPOINT,
    ADMIN_EVENT_DETAIL_ENDPOINT,
    ADMIN_EVENT_ATTENDEES_ENDPOINT,
} from "@/endpoints"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"

// ─── Pure GETs — token as arg, no directives ─────────────────────────────────

export async function getAdminEvents(token: string | undefined, status?: string): Promise<TabSlice<AdminEvent>> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_EVENTS_ENDPOINT}`)
        url.searchParams.set("page", "1")
        if (status) url.searchParams.set("event_state", status)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.ADMIN_EVENTS], revalidate: 300 }
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

export async function getAdminEventCards(token: string | undefined, params?: Record<string, any>): Promise<{ cards: AdminEventCards | null }> {
    try {
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
            next: { tags: [CACHE_TAGS.ADMIN_EVENT_CARDS], revalidate: 300 }
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminEventCards | null }
    } catch {
        return { cards: null }
    }
}

export async function getAdminEventDetail(token: string | undefined, eventId: string): Promise<{ data: EventDetails | null }> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_EVENT_DETAIL_ENDPOINT(eventId)}`
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.ADMIN_EVENTS], revalidate: 300 }
        })
        if (!res.ok) return { data: null }
        const json = await res.json()
        return { data: (json?.data ?? null) as EventDetails | null }
    } catch {
        return { data: null }
    }
}

export async function getAdminEventAttendees(token: string | undefined, eventId: string, params?: Record<string, any>): Promise<TabSlice<AdminEventAttendee>> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_EVENT_ATTENDEES_ENDPOINT(eventId)}`)
        url.searchParams.set("page", "1")
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
            next: { tags: [CACHE_TAGS.ADMIN_EVENTS], revalidate: 300 }
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