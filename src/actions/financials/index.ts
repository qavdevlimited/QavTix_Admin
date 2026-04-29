"use server"

import {
    ADMIN_FINANCIALS_CARDS_ENDPOINT,
    ADMIN_FINANCIALS_RESALE_CARDS_ENDPOINT,
    ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT,
    ADMIN_FINANCIALS_APPROVED_PAYOUTS_ENDPOINT,
    ADMIN_FINANCIALS_MARKETPLACE_ENDPOINT,
    ADMIN_FINANCIALS_FEATURED_PAYMENTS_ENDPOINT,
    ADMIN_FINANCIALS_SUBSCRIPTIONS_ENDPOINT,
    ADMIN_PAYOUT_APPROVE_ENDPOINT,
    ADMIN_PAYOUT_DECLINE_ENDPOINT,
    ADMIN_PAYOUT_FORCE_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import { CACHE_TAGS } from "@/cache-tags"
import { revalidateTag } from "next/cache"
import { cacheTag } from "next/cache"
import { cookies } from "next/headers"

// ─── Internal: get token for mutations (cookies() safe outside cache) ─────────

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

// ─── Internal: paginated list via axios (cached callers pass token in) ─────────

async function fetchPage<T>(
    token: string | undefined,
    endpoint: string,
    params?: Record<string, any>,
): Promise<TabSlice<T>> {
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(endpoint, { params: { page: 1, ...params } })
        const d = data?.data ?? data
        return {
            results: d?.results ?? [],
            count: d?.count ?? 0,
            next: d?.next ?? null,
            previous: d?.previous ?? null,
            total_pages: d?.total_pages ?? 1,
        }
    } catch (err) {
        console.error(`[financials] fetchPage(${endpoint})`, err)
        return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
    }
}

// ─── Internal: mutation via axios (uses own cookies() call) ───────────────────

async function postMutation(
    endpoint: string,
    body?: Record<string, any>,
): Promise<{ success: boolean; message?: string }> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
        await axios.post(endpoint, body)
        return { success: true }
    } catch (err: any) {
        return {
            success: false,
            message: err?.response?.data?.message ?? err?.message ?? "Action failed",
        }
    }
}

// ─── Cached KPI Cards — token accepted as arg, 'use cache' inside ─────────────

async function fetchFinancialCards(
    token: string | undefined,
    url: string,
): Promise<{ cards: AdminFinancialCards | null }> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS)
    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminFinancialCards | null }
    } catch {
        return { cards: null }
    }
}

async function fetchResaleCards(
    token: string | undefined,
): Promise<{ cards: AdminResaleCards | null }> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_RESALE_CARDS)
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_FINANCIALS_RESALE_CARDS_ENDPOINT}`
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminResaleCards | null }
    } catch {
        return { cards: null }
    }
}

// ─── Exported GETs (token passed from server pages via client.ts) ─────────────

export async function getAdminFinancialCards(
    token: string | undefined,
    params?: Record<string, string>,
): Promise<{ cards: AdminFinancialCards | null }> {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_FINANCIALS_CARDS_ENDPOINT}`)
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v != null) url.searchParams.set(k, v)
        })
    }
    return fetchFinancialCards(token, url.toString())
}

export async function getAdminResaleCards(token: string | undefined): Promise<{ cards: AdminResaleCards | null }> {
    return fetchResaleCards(token)
}

export async function getAdminPendingPayouts(
    token: string | undefined,
    params?: Record<string, any>,
): Promise<TabSlice<AdminPayout>> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS)
    return fetchPage<AdminPayout>(token, ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT, params)
}

export async function getAdminApprovedPayouts(
    token: string | undefined,
    params?: Record<string, any>,
): Promise<TabSlice<AdminPayout>> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS)
    return fetchPage<AdminPayout>(token, ADMIN_FINANCIALS_APPROVED_PAYOUTS_ENDPOINT, params)
}

export async function getAdminMarketplaceListings(
    token: string | undefined,
    params?: Record<string, any>,
): Promise<TabSlice<AdminMarketplaceListing>> {
    'use cache'
    return fetchPage<AdminMarketplaceListing>(token, ADMIN_FINANCIALS_MARKETPLACE_ENDPOINT, params)
}

export async function getAdminFeaturedPayments(
    token: string | undefined,
    params?: Record<string, any>,
): Promise<TabSlice<AdminFeaturedPayment>> {
    'use cache'
    return fetchPage<AdminFeaturedPayment>(token, ADMIN_FINANCIALS_FEATURED_PAYMENTS_ENDPOINT, params)
}

export async function getAdminSubscriptions(
    token: string | undefined,
    params?: Record<string, any>,
): Promise<TabSlice<AdminSubscription>> {
    'use cache'
    return fetchPage<AdminSubscription>(token, ADMIN_FINANCIALS_SUBSCRIPTIONS_ENDPOINT, params)
}

// ─── Mutations — uses own cookies(), revalidates on success ───────────────────

export async function approvePayout(payoutId: string) {
    const result = await postMutation(ADMIN_PAYOUT_APPROVE_ENDPOINT(payoutId))
    if (result.success) revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
    return result
}

export async function declinePayout(payoutId: string) {
    const result = await postMutation(ADMIN_PAYOUT_DECLINE_ENDPOINT(payoutId))
    if (result.success) revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
    return result
}

export async function forcePayout(payoutId: string) {
    const result = await postMutation(ADMIN_PAYOUT_FORCE_ENDPOINT(payoutId))
    if (result.success) revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
    return result
}
