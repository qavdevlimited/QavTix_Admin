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
import { CACHE_TAGS } from "@/cache-tags"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

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
    try {
        const token = await getToken()
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_USERS_ENDPOINT}?page=1`
        const res = await fetch(url, {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            next: { tags: [CACHE_TAGS.ADMIN_USERS], revalidate: 120 },
        })
        if (!res.ok) return { data: { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
        const json = await res.json()
        const d = json?.data ?? json
        return { data: { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 } }
    } catch { return { data: { results: [], count: 0, next: null, previous: null, total_pages: 1 } } }
}

export async function getAdminUsersCards(params?: Record<string, any>): Promise<{ cards: AdminUserCards | null }> {
    try {
        const token = await getToken()
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_USERS_CARDS_ENDPOINT}`)
        if (params) Object.entries(params).forEach(([k, v]) => { if (v != null) url.searchParams.set(k, String(v)) })
        const res = await fetch(url.toString(), {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            next: { tags: [CACHE_TAGS.ADMIN_USER_CARDS], revalidate: 120 },
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminUserCards | null }
    } catch { return { cards: null } }
}

export async function getAdminAffiliates(): Promise<{ data: TabSlice<AdminAffiliate> }> {
    try {
        const token = await getToken()
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_AFFILIATES_ENDPOINT}?page=1`
        const res = await fetch(url, {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            next: { tags: [CACHE_TAGS.ADMIN_AFFILIATES], revalidate: 120 },
        })
        if (!res.ok) return { data: { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
        const json = await res.json()
        const d = json?.data ?? json
        return { data: { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 } }
    } catch { return { data: { results: [], count: 0, next: null, previous: null, total_pages: 1 } } }
}

export async function getAdminAffiliatesCards(params?: Record<string, any>): Promise<{ cards: AdminAffiliateCards | null }> {
    try {
        const token = await getToken()
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_AFFILIATES_CARDS_ENDPOINT}`)
        if (params) Object.entries(params).forEach(([k, v]) => { if (v != null) url.searchParams.set(k, String(v)) })
        const res = await fetch(url.toString(), {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            next: { tags: [CACHE_TAGS.ADMIN_AFFILIATE_CARDS], revalidate: 120 },
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminAffiliateCards | null }
    } catch { return { cards: null } }
}

export async function getAdminWithdrawals(): Promise<TabSlice<AdminWithdrawal>> {
    return fetchPage<AdminWithdrawal>(ADMIN_WITHDRAWALS_ENDPOINT)
}

export async function toggleUserSuspension(userId: string | number): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/administrator/admin/users/${userId}/suspend/`)
        revalidateTag(CACHE_TAGS.ADMIN_USERS, 'max')
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
