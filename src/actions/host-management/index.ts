"use server"

import {
    ADMIN_HOSTS_ENDPOINT,
    ADMIN_HOSTS_CARDS_ENDPOINT,
    ADMIN_HOST_VERIFICATIONS_ENDPOINT,
    ADMIN_HOST_SUSPEND_ENDPOINT,
    ADMIN_HOST_BADGE_ENDPOINT,
    ADMIN_HOST_APPROVE_ENDPOINT,
    ADMIN_HOST_DECLINE_ENDPOINT,
    ADMIN_HOST_PAYOUT_ENDPOINT,
    ADMIN_HOST_AUTOPAYOUT_ENDPOINT,
    ADMIN_HOST_PROFILE_ENDPOINT,
    ADMIN_HOST_CARDS_ENDPOINT,
    ADMIN_HOST_CHART_ENDPOINT,
    ADMIN_HOST_EVENTS_ENDPOINT,
    ADMIN_HOST_EVENT_FEATURE_ENDPOINT,
    ADMIN_HOST_EVENT_SUSPEND_ENDPOINT,
    ADMIN_HOST_EVENT_DELETE_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import { handleApiError } from "@/helper-fns/handleApiErrors"


function logError(context: string, error: unknown) {
    const err = error as any
    const status = err?.response?.status
    const url = err?.config?.url
    const data = err?.response?.data
    console.error(`[host-management] ${context}`, {
        ...(status && { status }),
        ...(url && { url }),
        ...(data && { response: data }),
        message: err?.message ?? String(error),
    })
}


async function fetchPage<T>(endpoint: string, extraParams?: Record<string, any>): Promise<TabSlice<T>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`${endpoint}`, { params: { page: 1, ...extraParams } })
        const d = data?.data ?? data
        return {
            results: d?.results ?? [],
            count: d?.count ?? 0,
            next: d?.next ?? null,
            previous: d?.previous ?? null,
            total_pages: d?.total_pages ?? 1,
        }
    } catch (error) {
        logError(`fetchPage(${endpoint})`, error)
        return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
    }
}

async function fetchCards<T>(endpoint: string, params?: Record<string, any>): Promise<T | null> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${endpoint}`, { params })
        return (data?.data ?? null) as T | null
    } catch (error) {
        logError(`fetchCards(${endpoint})`, error)
        return null
    }
}

async function postAction(endpoint: string): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.post(endpoint)
        return { success: true }
    } catch (error) {
        logError(`postAction(${endpoint})`, error)
        const errorData = (error as any)?.response?.data
        return { success: false, message: handleApiError(errorData) }
    }
}

async function deleteAction(endpoint: string): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.delete(endpoint)
        return { success: true }
    } catch (error) {
        logError(`postAction(${endpoint})`, error)
        const errorData = (error as any)?.response?.data
        return { success: false, message: handleApiError(errorData) }
    }
}

async function putAction(endpoint: string, body: Record<string, any>): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.put(`/${endpoint}`, body)
        return { success: true }
    } catch (error) {
        logError(`putAction(${endpoint})`, error)
        const errorData = (error as any)?.response?.data
        return { success: false, message: handleApiError(errorData) }
    }
}


export async function getAdminHosts(): Promise<TabSlice<AdminHost>> {
    return fetchPage<AdminHost>(ADMIN_HOSTS_ENDPOINT)
}

export async function getAdminHostCards(params?: Record<string, any>): Promise<{ cards: AdminHostCards | null }> {
    const cards = await fetchCards<AdminHostCards>(ADMIN_HOSTS_CARDS_ENDPOINT, params)
    return { cards }
}

export async function getAdminPendingHosts(): Promise<TabSlice<AdminPendingHost>> {
    return fetchPage<AdminPendingHost>(ADMIN_HOST_VERIFICATIONS_ENDPOINT)
}

export async function toggleHostSuspension(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    return postAction(ADMIN_HOST_SUSPEND_ENDPOINT(hostId))
}

export async function giftHostBadge(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    return postAction(ADMIN_HOST_BADGE_ENDPOINT(hostId))
}

export async function forceHostPayout(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    return postAction(ADMIN_HOST_PAYOUT_ENDPOINT(hostId))
}

export async function toggleHostAutoPayout(hostId: string | number, is_enabled: boolean): Promise<{ success: boolean; message?: string }> {
    return putAction(ADMIN_HOST_AUTOPAYOUT_ENDPOINT(hostId), { is_enabled })
}

export async function approveHostVerification(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    return postAction(ADMIN_HOST_APPROVE_ENDPOINT(hostId))
}

export async function declineHostVerification(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    return postAction(ADMIN_HOST_DECLINE_ENDPOINT(hostId))
}


export async function getHostProfile(hostId: string | number): Promise<{ data: HostProfileDetails | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_HOST_PROFILE_ENDPOINT(hostId)}`)
        return { data: (data?.data ?? null) as HostProfileDetails | null }
    } catch (error) {
        logError(`getHostProfile(${hostId})`, error)
        return { data: null }
    }
}

export async function getHostEarningsCards(
    hostId: string | number,
    params?: Record<string, any>,
): Promise<{ cards: HostEarningsCards | null }> {
    const cards = await fetchCards<HostEarningsCards>(ADMIN_HOST_CARDS_ENDPOINT(hostId), params)
    return { cards }
}

export async function getHostChart(
    hostId: string | number,
    params?: Record<string, any>,
): Promise<{ chart: HostChartPoint[] }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_HOST_CHART_ENDPOINT(hostId)}`, { params })
        const results: HostChartPoint[] = Array.isArray(data?.data) ? data.data : []
        return { chart: results }
    } catch (error) {
        logError(`getHostChart(${hostId})`, error)
        return { chart: [] }
    }
}

export async function getHostEvents(hostId: string | number, status?: string): Promise<TabSlice<HostEvent>> {
    return fetchPage<HostEvent>(ADMIN_HOST_EVENTS_ENDPOINT(hostId), status ? { status } : undefined)
}


export async function featureHostEvent(
    eventId: string,
    planSlug: string,
): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_HOST_EVENT_FEATURE_ENDPOINT(eventId)}`, { plan_slug: planSlug })
        return { success: true }
    } catch (error) {
        logError(`featureHostEvent(${eventId})`, error)
        const errorData = (error as any)?.response?.data
        return { success: false, message: handleApiError(errorData) }
    }
}

export async function suspendHostEvent(eventId: string): Promise<{ success: boolean; message?: string }> {
    return postAction(ADMIN_HOST_EVENT_SUSPEND_ENDPOINT(eventId))
}

export async function deleteHostEvent(eventId: string): Promise<{ success: boolean; message?: string }> {
    return deleteAction(ADMIN_HOST_EVENT_DELETE_ENDPOINT(eventId))
}


export interface HostSearchResult {
    id: string
    name: string
}

export async function searchHosts(search?: string): Promise<HostSearchResult[]> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_HOSTS_ENDPOINT}`, {
            params: { page: 1, ...(search ? { search } : {}) },
        })
        const results = data?.data?.results ?? data?.results ?? []
        return results.map((h: any) => ({
            id: String(h.host_id),
            name: h.business_name ?? h.owner_name ?? h.full_name ?? "Unknown Host",
        }))
    } catch (error) {
        logError(`searchHosts(search="${search ?? ""}")`, error)
        return []
    }
}