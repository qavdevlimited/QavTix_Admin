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
import { TabSlice } from "@/custom-hooks/UseDataDisplay"

// Fetches a paginated list endpoint
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

// Fetches a flat (non-paginated) cards endpoint
async function fetchCards<T>(endpoint: string, params?: Record<string, any>): Promise<T | null> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${endpoint}`, { params })
        return (data?.data ?? null) as T | null
    } catch {
        return null
    }
}

export async function getAdminUsers(): Promise<{ data: TabSlice<AdminCustomer> }> {
    const data = await fetchPage<AdminCustomer>(ADMIN_USERS_ENDPOINT)
    return { data }
}

export async function getAdminUsersCards(params?: Record<string, any>): Promise<{ cards: AdminUserCards | null }> {
    const cards = await fetchCards<AdminUserCards>(ADMIN_USERS_CARDS_ENDPOINT, params)
    return { cards }
}

export async function getAdminAffiliates(): Promise<{ data: TabSlice<AdminAffiliate> }> {
    const data = await fetchPage<AdminAffiliate>(ADMIN_AFFILIATES_ENDPOINT)
    return { data }
}

export async function getAdminAffiliatesCards(params?: Record<string, any>): Promise<{ cards: AdminAffiliateCards | null }> {
    const cards = await fetchCards<AdminAffiliateCards>(ADMIN_AFFILIATES_CARDS_ENDPOINT, params)
    return { cards }
}

export async function getAdminWithdrawals(): Promise<TabSlice<AdminWithdrawal>> {
    return fetchPage<AdminWithdrawal>(ADMIN_WITHDRAWALS_ENDPOINT)
}

export async function toggleUserSuspension(userId: string | number): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/administrator/admin/users/${userId}/suspend/`)
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to toggle user suspension" }
    }
}

export async function getAdminUserProfile(userId: string | number): Promise<{ data: UserProfileDetails | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_USER_PROFILE_ENDPOINT(userId)}`)
        return { data: data?.data ?? null }
    } catch {
        return { data: null }
    }
}

export async function getAdminUserCards(userId: string | number, dateRange?: DatePreset): Promise<{ cards: UserKPICards | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_USER_CARDS_ENDPOINT(userId)}`, { params: dateRange ? { date_range: dateRange } : {} })
        return { cards: data?.data ?? null }
    } catch {
        return { cards: null }
    }
}

export async function getAdminUserChart(userId: string | number, dateRange?: DatePreset): Promise<{ chart: UserChartDataPoint[] }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_USER_CHART_ENDPOINT(userId)}`, { params: dateRange ? { date_range: dateRange } : {} })
        return { chart: data?.data && Object.keys(data.data).length > 0 ? data.data : {} }
    } catch {
        return { chart: [] }
    }
}

export async function getAdminUserOrders(userId: string | number): Promise<TabSlice<UserPurchaseOrder>> {
    return fetchPage<UserPurchaseOrder>(ADMIN_USER_PURCHASE_HISTORY_ENDPOINT(userId))
}
