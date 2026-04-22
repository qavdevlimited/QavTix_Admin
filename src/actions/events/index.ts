"use server"

import {
    ADMIN_EVENTS_ENDPOINT,
    ADMIN_EVENTS_CARDS_ENDPOINT,
    ADMIN_EVENT_DETAIL_ENDPOINT,
    ADMIN_EVENT_ATTENDEES_ENDPOINT
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"


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

async function fetchCards<T>(
    endpoint: string,
    params?: Record<string, any>,
): Promise<T | null> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${endpoint}`, { params })
        return (data?.data ?? null) as T | null
    } catch {
        return null
    }
}


export async function getAdminEvents(
    status?: string,
): Promise<TabSlice<AdminEvent>> {
    return fetchPage<AdminEvent>(
        ADMIN_EVENTS_ENDPOINT,
        status ? { event_state: status } : undefined,
    )
}

export async function getAdminEventCards(
    params?: Record<string, any>,
): Promise<{ cards: AdminEventCards | null }> {
    const cards = await fetchCards<AdminEventCards>(ADMIN_EVENTS_CARDS_ENDPOINT, params)
    return { cards }
}

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