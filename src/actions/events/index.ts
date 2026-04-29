"use server"

import {
    ADMIN_EVENTS_ENDPOINT,
    ADMIN_EVENTS_CARDS_ENDPOINT,
    ADMIN_EVENT_DETAIL_ENDPOINT,
    ADMIN_EVENT_ATTENDEES_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import { CACHE_TAGS } from "@/cache-tags"
import { cacheTag } from "next/cache"

// ─── Cached GETs — token as arg, 'use cache' scoped inside ───────────────────

async function _getAdminEvents(token: string | undefined, status?: string): Promise<TabSlice<AdminEvent>> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_EVENTS)
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_EVENTS_ENDPOINT}`)
        url.searchParams.set("page", "1")
        if (status) url.searchParams.set("event_state", status)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
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

async function _getAdminEventCards(token: string | undefined, params?: Record<string, any>): Promise<{ cards: AdminEventCards | null }> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_EVENT_CARDS)
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
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminEventCards | null }
    } catch {
        return { cards: null }
    }
}

async function _getAdminEventDetail(token: string | undefined, eventId: string): Promise<{ data: EventDetails | null }> {
    'use cache'
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(`/${ADMIN_EVENT_DETAIL_ENDPOINT(eventId)}`)
        return { data: (data?.data ?? null) as EventDetails | null }
    } catch {
        return { data: null }
    }
}

async function _getAdminEventAttendees(token: string | undefined, eventId: string, params?: Record<string, any>): Promise<TabSlice<AdminEventAttendee>> {
    'use cache'
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(ADMIN_EVENT_ATTENDEES_ENDPOINT(eventId), { params: { page: 1, ...params } })
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

// ─── Public exports ───────────────────────────────────────────────────────────

export async function getAdminEvents(token: string | undefined, status?: string) {
    return _getAdminEvents(token, status)
}

export async function getAdminEventCards(token: string | undefined, params?: Record<string, any>) {
    return _getAdminEventCards(token, params)
}

export async function getAdminEventDetail(token: string | undefined, eventId: string) {
    return _getAdminEventDetail(token, eventId)
}

export async function getAdminEventAttendees(token: string | undefined, eventId: string, params?: Record<string, any>) {
    return _getAdminEventAttendees(token, eventId, params)
}