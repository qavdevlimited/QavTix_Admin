"use server"

import {
    ADMIN_HOSTS_ENDPOINT,
    ADMIN_HOSTS_CARDS_ENDPOINT,
    ADMIN_HOST_VERIFICATIONS_ENDPOINT,
    ADMIN_HOST_PROFILE_ENDPOINT,
    ADMIN_HOST_CARDS_ENDPOINT,
    ADMIN_HOST_CHART_ENDPOINT,
    ADMIN_HOST_EVENTS_ENDPOINT,
    ADMIN_HOST_SUSPEND_ENDPOINT,
    ADMIN_HOST_BADGE_ENDPOINT,
    ADMIN_HOST_APPROVE_ENDPOINT,
    ADMIN_HOST_DECLINE_ENDPOINT,
    ADMIN_HOST_PAYOUT_ENDPOINT,
    ADMIN_HOST_AUTOPAYOUT_ENDPOINT,
    ADMIN_HOST_EVENT_FEATURE_ENDPOINT,
    ADMIN_HOST_EVENT_SUSPEND_ENDPOINT,
    ADMIN_HOST_EVENT_DELETE_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { CACHE_TAGS } from "@/cache-tags"
import { revalidateTag } from "next/cache"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"

interface ActionResult {
    success: boolean
    message?: string
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function toggleHostSuspension(hostId: string | number): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_HOST_SUSPEND_ENDPOINT(hostId)}`)
        revalidateTag(CACHE_TAGS.ADMIN_HOSTS, 'max')
        return { success: true, message: "Host suspension toggled." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function giftHostBadge(hostId: string | number): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_HOST_BADGE_ENDPOINT(hostId)}`)
        return { success: true, message: "Badge gifted." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function forceHostPayout(hostId: string | number): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_HOST_PAYOUT_ENDPOINT()}`, { host_id: hostId })
        revalidateTag(CACHE_TAGS.ADMIN_HOST_CARDS, 'max')
        return { success: true, message: "Payout forced." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function toggleHostAutoPayout(hostId: string | number, is_enabled: boolean): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.put(`/${ADMIN_HOST_AUTOPAYOUT_ENDPOINT(hostId)}`, { is_enabled })
        return { success: true, message: "Auto-payout updated." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function approveHostVerification(hostId: string | number): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_HOST_APPROVE_ENDPOINT(hostId)}`)
        revalidateTag(CACHE_TAGS.ADMIN_PENDING_HOSTS, 'max')
        return { success: true, message: "Host approved." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function declineHostVerification(hostId: string | number): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_HOST_DECLINE_ENDPOINT(hostId)}`)
        revalidateTag(CACHE_TAGS.ADMIN_PENDING_HOSTS, 'max')
        return { success: true, message: "Host declined." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function featureHostEvent(eventId: string, planSlug: string): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_HOST_EVENT_FEATURE_ENDPOINT(eventId)}`, { plan_slug: planSlug })
        return { success: true, message: "Event featured." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function suspendHostEvent(eventId: string): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_HOST_EVENT_SUSPEND_ENDPOINT(eventId)}`)
        return { success: true, message: "Event suspended." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function deleteHostEvent(eventId: string): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.delete(`/${ADMIN_HOST_EVENT_DELETE_ENDPOINT(eventId)}`)
        return { success: true, message: "Event deleted." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

// ─── Interactive GETs ────────────────────────────────────────────────────────

export async function getAdminHosts(): Promise<TabSlice<AdminHost>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_HOSTS_ENDPOINT}`, { params: { page: 1 } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

export async function getAdminHostCards(params?: Record<string, any>): Promise<{ cards: AdminHostCards | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_HOSTS_CARDS_ENDPOINT}`, { params })
        return { cards: (data?.data ?? null) as AdminHostCards | null }
    } catch { return { cards: null } }
}

export async function getAdminPendingHosts(): Promise<TabSlice<AdminPendingHost>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_HOST_VERIFICATIONS_ENDPOINT}`, { params: { page: 1 } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

export async function getHostProfile(hostId: string | number): Promise<{ data: HostProfileDetails | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_HOST_PROFILE_ENDPOINT(hostId)}`)
        return { data: (data?.data ?? null) as HostProfileDetails | null }
    } catch { return { data: null } }
}

export async function getHostEarningsCards(hostId: string | number, params?: Record<string, any>): Promise<{ cards: HostEarningsCards | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_HOST_CARDS_ENDPOINT(hostId)}`, { params })
        return { cards: (data?.data ?? null) as HostEarningsCards | null }
    } catch { return { cards: null } }
}

export async function getHostChart(hostId: string | number, params?: Record<string, any>): Promise<{ chart: HostChartPoint[] }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_HOST_CHART_ENDPOINT(hostId)}`, { params })
        return { chart: Array.isArray(data?.data) ? data.data : [] }
    } catch { return { chart: [] } }
}

export async function getHostEvents(hostId: string | number, status?: string): Promise<TabSlice<HostEvent>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_HOST_EVENTS_ENDPOINT(hostId)}`, { params: { page: 1, ...(status && { status }) } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}
