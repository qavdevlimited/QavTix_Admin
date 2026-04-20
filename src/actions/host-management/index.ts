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
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"

async function fetchPage<T>(endpoint: string): Promise<TabSlice<T>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${endpoint}`, { params: { page: 1 } })
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

async function fetchCards<T>(endpoint: string, params?: Record<string, any>): Promise<T | null> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${endpoint}`, { params })
        return (data?.data ?? null) as T | null
    } catch {
        return null
    }
}

async function postAction(endpoint: string): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${endpoint}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Action failed" }
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

export async function approveHostVerification(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    return postAction(ADMIN_HOST_APPROVE_ENDPOINT(hostId))
}

export async function declineHostVerification(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    return postAction(ADMIN_HOST_DECLINE_ENDPOINT(hostId))
}
