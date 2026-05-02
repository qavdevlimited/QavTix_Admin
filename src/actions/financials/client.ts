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
import { CACHE_TAGS } from "@/cache-tags"
import { revalidateTag } from "next/cache"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"

interface ActionResult {
    success: boolean
    message?: string
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function approvePayout(payoutId: string): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_PAYOUT_APPROVE_ENDPOINT(payoutId)}`)
        revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
        return { success: true, message: "Payout approved." }
    } catch (err: any) {
        return { success: false, message: err?.response?.data?.message ?? "Failed to approve payout." }
    }
}

export async function declinePayout(payoutId: string): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_PAYOUT_DECLINE_ENDPOINT(payoutId)}`)
        revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
        return { success: true, message: "Payout declined." }
    } catch (err: any) {
        return { success: false, message: err?.response?.data?.message ?? "Failed to decline payout." }
    }
}

export async function forcePayout(payoutId: string): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await axios.post(`/${ADMIN_PAYOUT_FORCE_ENDPOINT(payoutId)}`)
        revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
        return { success: true, message: "Payout forced." }
    } catch (err: any) {
        return { success: false, message: err?.response?.data?.message ?? "Failed to force payout." }
    }
}

// ─── Interactive GETs ────────────────────────────────────────────────────────

export async function getAdminFinancialCards(params?: Record<string, string>): Promise<{ cards: AdminFinancialCards | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_FINANCIALS_CARDS_ENDPOINT}`, { params })
        return { cards: data?.data ?? null }
    } catch { return { cards: null } }
}

export async function getAdminResaleCards(): Promise<{ cards: AdminResaleCards | null }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_FINANCIALS_RESALE_CARDS_ENDPOINT}`)
        return { cards: data?.data ?? null }
    } catch { return { cards: null } }
}

export async function getAdminPendingPayouts(params?: Record<string, any>): Promise<TabSlice<AdminPayout>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT}`, { params: { page: 1, ...params } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

export async function getAdminApprovedPayouts(params?: Record<string, any>): Promise<TabSlice<AdminPayout>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_FINANCIALS_APPROVED_PAYOUTS_ENDPOINT}`, { params: { page: 1, ...params } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

export async function getAdminMarketplaceListings(params?: Record<string, any>): Promise<TabSlice<AdminMarketplaceListing>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_FINANCIALS_MARKETPLACE_ENDPOINT}`, { params: { page: 1, ...params } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

export async function getAdminFeaturedPayments(params?: Record<string, any>): Promise<TabSlice<AdminFeaturedPayment>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_FINANCIALS_FEATURED_PAYMENTS_ENDPOINT}`, { params: { page: 1, ...params } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

export async function getAdminSubscriptions(params?: Record<string, any>): Promise<TabSlice<AdminSubscription>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_FINANCIALS_SUBSCRIPTIONS_ENDPOINT}`, { params: { page: 1, ...params } })
        const d = data?.data ?? data
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}
