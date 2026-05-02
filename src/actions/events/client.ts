"use server"

import {
    ADMIN_EVENTS_ENDPOINT,
    ADMIN_EVENTS_CARDS_ENDPOINT,
    ADMIN_EVENT_DETAIL_ENDPOINT,
    ADMIN_EVENT_ATTENDEES_ENDPOINT,
    ADMIN_HOST_EVENT_FEATURE_ENDPOINT,
    ADMIN_HOST_EVENT_SUSPEND_ENDPOINT,
    ADMIN_HOST_EVENT_DELETE_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { handleApiError } from "@/helper-fns/handleApiErrors"

interface ActionResult {
    success: boolean
    message?: string
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function suspendEvent(eventId: string): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_HOST_EVENT_SUSPEND_ENDPOINT(eventId)}`)
        revalidateTag(CACHE_TAGS.ADMIN_EVENTS, 'max')
        return { success: true, message: "Event suspended successfully." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function deleteEvent(eventId: string): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.delete(`/${ADMIN_HOST_EVENT_DELETE_ENDPOINT(eventId)}`)
        revalidateTag(CACHE_TAGS.ADMIN_EVENTS, 'max')
        return { success: true, message: "Event deleted successfully." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function featureEvent(eventId: string): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_HOST_EVENT_FEATURE_ENDPOINT(eventId)}`)
        revalidateTag(CACHE_TAGS.ADMIN_EVENTS, 'max')
        return { success: true, message: "Event featured successfully." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

// ─── Interactive GETs (for client-side refreshes) ────────────────────────────

export async function getAdminEvents(status?: string): Promise<TabSlice<AdminEvent>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_EVENTS_ENDPOINT}`, {
            params: { page: 1, ...(status && { event_state: status }) }
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

export async function getAdminEventCards(params?: Record<string, any>): Promise<{ cards: AdminEventCards | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_EVENTS_CARDS_ENDPOINT}`, { params })
        return { cards: (data?.data ?? null) as AdminEventCards | null }
    } catch {
        return { cards: null }
    }
}

export async function getAdminEventDetail(eventId: string): Promise<{ data: EventDetails | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_EVENT_DETAIL_ENDPOINT(eventId)}`)
        return { data: (data?.data ?? null) as EventDetails | null }
    } catch {
        return { data: null }
    }
}

export async function getAdminEventAttendees(eventId: string, params?: Record<string, any>): Promise<TabSlice<AdminEventAttendee>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(ADMIN_EVENT_ATTENDEES_ENDPOINT(eventId), {
            params: { page: 1, ...params }
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
