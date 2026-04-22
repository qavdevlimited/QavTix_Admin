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

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

async function fetchCards<T>(
    endpoint: string,
    params?: Record<string, any>,
): Promise<T | null> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(endpoint, { params })
        return (data?.data ?? null) as T | null
    } catch (err) {
        console.error(`[financials] fetchCards(${endpoint})`, err)
        return null
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
        console.error(`[financials] postMutation(${endpoint})`, err)
        return {
            success: false,
            message: err?.response?.data?.message ?? err?.message ?? "Action failed",
        }
    }
}

// ─── KPI Cards ───────────────────────────────────────────────────────────────

export async function getAdminFinancialCards(
    params?: Record<string, string>,
): Promise<{ cards: AdminFinancialCards | null }> {
    const cards = await fetchCards<AdminFinancialCards>(ADMIN_FINANCIALS_CARDS_ENDPOINT, params)
    return { cards }
}

export async function getAdminResaleCards(): Promise<{ cards: AdminResaleCards | null }> {
    const cards = await fetchCards<AdminResaleCards>(ADMIN_FINANCIALS_RESALE_CARDS_ENDPOINT)
    return { cards }
}

// ─── Tab Data ────────────────────────────────────────────────────────────────

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

// ─── Payout Mutations ────────────────────────────────────────────────────────

export async function approvePayout(payoutId: string) {
    return postMutation(ADMIN_PAYOUT_APPROVE_ENDPOINT(payoutId))
}

export async function declinePayout(payoutId: string) {
    return postMutation(ADMIN_PAYOUT_DECLINE_ENDPOINT(payoutId))
}

export async function forcePayout(payoutId: string) {
    return postMutation(ADMIN_PAYOUT_FORCE_ENDPOINT(payoutId))
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

