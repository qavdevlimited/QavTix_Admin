"use server"

import {
    ADMIN_USERS_ENDPOINT,
    ADMIN_USERS_CARDS_ENDPOINT,
    ADMIN_AFFILIATES_ENDPOINT,
    ADMIN_AFFILIATES_CARDS_ENDPOINT,
    ADMIN_WITHDRAWALS_ENDPOINT,
    ADMIN_USER_PROFILE_ENDPOINT,
    ADMIN_USER_CARDS_ENDPOINT,
    ADMIN_USER_CHART_ENDPOINT,
    ADMIN_USER_PURCHASE_HISTORY_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { CACHE_TAGS } from "@/cache-tags"
import { revalidateTag } from "next/cache"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"

interface ActionResult {
    success: boolean
    message?: string
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function toggleUserSuspension(userId: string | number): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/administrator/admin/users/${userId}/suspend/`)
        revalidateTag(CACHE_TAGS.ADMIN_USERS, 'max')
        return { success: true, message: "User suspension toggled." }
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to toggle user suspension" }
    }
}

// ─── Interactive GETs ────────────────────────────────────────────────────────

export async function getAdminUsers(): Promise<TabSlice<AdminCustomer>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_USERS_ENDPOINT}`, { params: { page: 1 } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

export async function getAdminUsersCards(params?: Record<string, any>): Promise<{ cards: AdminUserCards | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_USERS_CARDS_ENDPOINT}`, { params })
        return { cards: data?.data ?? null }
    } catch { return { cards: null } }
}

export async function getAdminAffiliates(): Promise<TabSlice<AdminAffiliate>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_AFFILIATES_ENDPOINT}`, { params: { page: 1 } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

export async function getAdminAffiliatesCards(params?: Record<string, any>): Promise<{ cards: AdminAffiliateCards | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_AFFILIATES_CARDS_ENDPOINT}`, { params })
        return { cards: data?.data ?? null }
    } catch { return { cards: null } }
}

export async function getAdminUserProfile(userId: string | number): Promise<{ data: UserProfileDetails | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_USER_PROFILE_ENDPOINT(userId)}`)
        return { data: data?.data ?? null }
    } catch { return { data: null } }
}

export async function getAdminUserCards(userId: string | number, dateRange?: DatePreset): Promise<{ cards: UserKPICards | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_USER_CARDS_ENDPOINT(userId)}`, { params: dateRange ? { date_range: dateRange } : {} })
        return { cards: data?.data ?? null }
    } catch { return { cards: null } }
}

export async function getAdminUserChart(userId: string | number, dateRange?: DatePreset): Promise<{ chart: UserChartDataPoint[] }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_USER_CHART_ENDPOINT(userId)}`, { params: dateRange ? { date_range: dateRange } : {} })
        return { chart: data?.data ?? {} }
    } catch { return { chart: [] } }
}

export async function getAdminWithdrawals(): Promise<TabSlice<AdminWithdrawal>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_WITHDRAWALS_ENDPOINT}`, { params: { page: 1 } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

export async function getAdminUserOrders(userId: string | number): Promise<TabSlice<UserPurchaseOrder>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_USER_PURCHASE_HISTORY_ENDPOINT(userId)}`, { params: { page: 1 } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}
