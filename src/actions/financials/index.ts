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
import { cookies } from "next/headers"

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

// ─── Internal axios helpers ───────────────────────────────────────────────────

async function fetchPage<T>(
    endpoint: string,
    params?: Record<string, any>,
): Promise<TabSlice<T>> {
    try {
        const axios = await getServerAxios()
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

async function postMutation(
    endpoint: string,
    body?: Record<string, any>,
): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.post(endpoint, body)
        return { success: true }
    } catch (err: any) {
        return {
            success: false,
            message: err?.response?.data?.message ?? err?.message ?? "Action failed",
        }
    }
}

// ─── Cached KPI Cards (native fetch + next: { tags }) ─────────────────────────

export async function getAdminFinancialCards(
    params?: Record<string, string>,
): Promise<{ cards: AdminFinancialCards | null }> {
    try {
        const token = await getToken()
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_FINANCIALS_CARDS_ENDPOINT}`)
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v != null) url.searchParams.set(k, v)
            })
        }
        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.ADMIN_FINANCIAL_CARDS], revalidate: 300 },
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminFinancialCards | null }
    } catch {
        return { cards: null }
    }
}

export async function getAdminResaleCards(): Promise<{ cards: AdminResaleCards | null }> {
    try {
        const token = await getToken()
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_FINANCIALS_RESALE_CARDS_ENDPOINT}`
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.ADMIN_RESALE_CARDS], revalidate: 300 },
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminResaleCards | null }
    } catch {
        return { cards: null }
    }
}

// ─── Tab Data (axios — filter-driven, not pre-cached) ────────────────────────

export async function getAdminPendingPayouts(
    params?: Record<string, any>,
): Promise<TabSlice<AdminPayout>> {
    return fetchPage<AdminPayout>(ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT, params)
}

export async function getAdminApprovedPayouts(
    params?: Record<string, any>,
): Promise<TabSlice<AdminPayout>> {
    return fetchPage<AdminPayout>(ADMIN_FINANCIALS_APPROVED_PAYOUTS_ENDPOINT, params)
}

export async function getAdminMarketplaceListings(
    params?: Record<string, any>,
): Promise<TabSlice<AdminMarketplaceListing>> {
    return fetchPage<AdminMarketplaceListing>(ADMIN_FINANCIALS_MARKETPLACE_ENDPOINT, params)
}

export async function getAdminFeaturedPayments(
    params?: Record<string, any>,
): Promise<TabSlice<AdminFeaturedPayment>> {
    return fetchPage<AdminFeaturedPayment>(ADMIN_FINANCIALS_FEATURED_PAYMENTS_ENDPOINT, params)
}

export async function getAdminSubscriptions(
    params?: Record<string, any>,
): Promise<TabSlice<AdminSubscription>> {
    return fetchPage<AdminSubscription>(ADMIN_FINANCIALS_SUBSCRIPTIONS_ENDPOINT, params)
}

// ─── Payout Mutations (bust card caches on success) ───────────────────────────

export async function approvePayout(payoutId: string) {
    const result = await postMutation(ADMIN_PAYOUT_APPROVE_ENDPOINT(payoutId))
    if (result.success) {
        revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
    }
    return result
}

export async function declinePayout(payoutId: string) {
    const result = await postMutation(ADMIN_PAYOUT_DECLINE_ENDPOINT(payoutId))
    if (result.success) {
        revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
    }
    return result
}

export async function forcePayout(payoutId: string) {
    const result = await postMutation(ADMIN_PAYOUT_FORCE_ENDPOINT(payoutId))
    if (result.success) {
        revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
    }
    return result
}


export async function getFinancials(params?: { date_range?: string | null; page?: number }) {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT, {
            params: { page: params?.page ?? 1, ...(params?.date_range ? { date_range: params.date_range } : {}) }
        })
        return {
            success: true,
            data: {
                cards: null,
                withdrawal_history: data?.data ?? { results: [], count: 0, total_pages: 1, page: 1, next: null, previous: null }
            }
        }
    } catch {
        return { success: false, data: null }
    }
}
