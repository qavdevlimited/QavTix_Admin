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
import { cacheTag } from "next/cache"

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function fetchPage<T>(
    token: string | undefined,
    endpoint: string,
): Promise<TabSlice<T>> {
    try {
        const axios = await getServerAxios(token)
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

// ─── Cached GETs — token as arg, 'use cache' scoped inside ───────────────────

async function _getAdminUsers(token: string | undefined): Promise<{ data: TabSlice<AdminCustomer> }> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_USERS)
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_USERS_ENDPOINT}?page=1`
        const res = await fetch(url, {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })
        if (!res.ok) return { data: { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
        const json = await res.json()
        const d = json?.data ?? json
        return { data: { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 } }
    } catch {
        return { data: { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
    }
}

async function _getAdminUsersCards(token: string | undefined, params?: Record<string, any>): Promise<{ cards: AdminUserCards | null }> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_USER_CARDS)
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_USERS_CARDS_ENDPOINT}`)
        if (params) Object.entries(params).forEach(([k, v]) => { if (v != null) url.searchParams.set(k, String(v)) })
        const res = await fetch(url.toString(), {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminUserCards | null }
    } catch {
        return { cards: null }
    }
}

async function _getAdminAffiliates(token: string | undefined): Promise<{ data: TabSlice<AdminAffiliate> }> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_AFFILIATES)
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_AFFILIATES_ENDPOINT}?page=1`
        const res = await fetch(url, {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })
        if (!res.ok) return { data: { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
        const json = await res.json()
        const d = json?.data ?? json
        return { data: { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 } }
    } catch {
        return { data: { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
    }
}

async function _getAdminAffiliatesCards(token: string | undefined, params?: Record<string, any>): Promise<{ cards: AdminAffiliateCards | null }> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_AFFILIATE_CARDS)
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_AFFILIATES_CARDS_ENDPOINT}`)
        if (params) Object.entries(params).forEach(([k, v]) => { if (v != null) url.searchParams.set(k, String(v)) })
        const res = await fetch(url.toString(), {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminAffiliateCards | null }
    } catch {
        return { cards: null }
    }
}

async function _getAdminUserProfile(token: string | undefined, userId: string | number): Promise<{ data: UserProfileDetails | null }> {
    'use cache'
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(`/${ADMIN_USER_PROFILE_ENDPOINT(userId)}`)
        return { data: data?.data ?? null }
    } catch {
        return { data: null }
    }
}

async function _getAdminUserCards(token: string | undefined, userId: string | number, dateRange?: DatePreset): Promise<{ cards: UserKPICards | null }> {
    'use cache'
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(`/${ADMIN_USER_CARDS_ENDPOINT(userId)}`, {
            params: dateRange ? { date_range: dateRange } : {},
        })
        return { cards: data?.data ?? null }
    } catch {
        return { cards: null }
    }
}

async function _getAdminUserChart(token: string | undefined, userId: string | number, dateRange?: DatePreset): Promise<{ chart: UserChartDataPoint[] }> {
    'use cache'
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(`/${ADMIN_USER_CHART_ENDPOINT(userId)}`, {
            params: dateRange ? { date_range: dateRange } : {},
        })
        return { chart: data?.data && Object.keys(data.data).length > 0 ? data.data : {} }
    } catch {
        return { chart: [] }
    }
}

async function _getAdminWithdrawals(token: string | undefined): Promise<TabSlice<AdminWithdrawal>> {
    'use cache'
    return fetchPage<AdminWithdrawal>(token, ADMIN_WITHDRAWALS_ENDPOINT)
}

async function _getAdminUserOrders(token: string | undefined, userId: string | number): Promise<TabSlice<UserPurchaseOrder>> {
    'use cache'
    return fetchPage<UserPurchaseOrder>(token, ADMIN_USER_PURCHASE_HISTORY_ENDPOINT(userId))
}

// ─── Public exports — accept token for server page callers ───────────────────

export async function getAdminUsers(token: string | undefined) {
    return _getAdminUsers(token)
}

export async function getAdminUsersCards(token: string | undefined, params?: Record<string, any>) {
    return _getAdminUsersCards(token, params)
}

export async function getAdminAffiliates(token: string | undefined) {
    return _getAdminAffiliates(token)
}

export async function getAdminAffiliatesCards(token: string | undefined, params?: Record<string, any>) {
    return _getAdminAffiliatesCards(token, params)
}

export async function getAdminWithdrawals(token: string | undefined) {
    return _getAdminWithdrawals(token)
}

export async function getAdminUserProfile(token: string | undefined, userId: string | number) {
    return _getAdminUserProfile(token, userId)
}

export async function getAdminUserCards(token: string | undefined, userId: string | number, dateRange?: DatePreset) {
    return _getAdminUserCards(token, userId, dateRange)
}

export async function getAdminUserChart(token: string | undefined, userId: string | number, dateRange?: DatePreset) {
    return _getAdminUserChart(token, userId, dateRange)
}

export async function getAdminUserOrders(token: string | undefined, userId: string | number) {
    return _getAdminUserOrders(token, userId)
}
