import { CACHE_TAGS } from "@/cache-tags"
import {
    ADMIN_FINANCIALS_CARDS_ENDPOINT,
    ADMIN_FINANCIALS_RESALE_CARDS_ENDPOINT,
    ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT,
    ADMIN_FINANCIALS_APPROVED_PAYOUTS_ENDPOINT,
    ADMIN_FINANCIALS_MARKETPLACE_ENDPOINT,
    ADMIN_FINANCIALS_FEATURED_PAYMENTS_ENDPOINT,
    ADMIN_FINANCIALS_SUBSCRIPTIONS_ENDPOINT,
} from "@/endpoints"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(
    token: string | undefined,
    path: string,
    params?: Record<string, any>,
    tags?: string[],
): Promise<{ success: boolean; data?: T }> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`)
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v != null) url.searchParams.set(k, String(v))
            })
        }
        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [...(tags ?? [])], revalidate: 300 }
        })
        if (!res.ok) return { success: false }
        const json = await res.json()
        return { success: true, data: json.data as T }
    } catch {
        return { success: false }
    }
}

async function apiFetchList<T>(
    token: string | undefined,
    path: string,
    params?: Record<string, any>,
    tags?: string[],
): Promise<TabSlice<T>> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`)
        url.searchParams.set("page", "1")
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v != null) url.searchParams.set(k, String(v))
            })
        }
        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [...(tags ?? [])], revalidate: 300 }
        })
        if (!res.ok) return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
        const json = await res.json()
        const d = json?.data ?? json
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

// ─── Pure GETs — token as arg, no directives ─────────────────────────────────

export async function getAdminFinancialCards(
    token: string | undefined,
    params?: Record<string, string>,
): Promise<{ cards: AdminFinancialCards | null }> {
    const { data } = await apiFetch<AdminFinancialCards>(token, ADMIN_FINANCIALS_CARDS_ENDPOINT, params, [CACHE_TAGS.ADMIN_FINANCIAL_CARDS])
    return { cards: data ?? null }
}

export async function getAdminResaleCards(token: string | undefined): Promise<{ cards: AdminResaleCards | null }> {
    const { data } = await apiFetch<AdminResaleCards>(token, ADMIN_FINANCIALS_RESALE_CARDS_ENDPOINT, {}, [CACHE_TAGS.ADMIN_RESALE_CARDS])
    return { cards: data ?? null }
}

export async function getAdminPendingPayouts(
    token: string | undefined,
    params?: Record<string, any>,
): Promise<TabSlice<AdminPayout>> {
    return apiFetchList<AdminPayout>(token, ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT, params, [CACHE_TAGS.ADMIN_PENDING_PAYOUTS])
}

export async function getAdminApprovedPayouts(
    token: string | undefined,
    params?: Record<string, any>,
): Promise<TabSlice<AdminPayout>> {
    return apiFetchList<AdminPayout>(token, ADMIN_FINANCIALS_APPROVED_PAYOUTS_ENDPOINT, params, [CACHE_TAGS.ADMIN_APPROVED_PAYOUTS])
}

export async function getAdminMarketplaceListings(
    token: string | undefined,
    params?: Record<string, any>,
): Promise<TabSlice<AdminMarketplaceListing>> {
    return apiFetchList<AdminMarketplaceListing>(token, ADMIN_FINANCIALS_MARKETPLACE_ENDPOINT, params, [CACHE_TAGS.ADMIN_RESALE_CARDS])
}

export async function getAdminFeaturedPayments(
    token: string | undefined,
    params?: Record<string, any>,
): Promise<TabSlice<AdminFeaturedPayment>> {
    return apiFetchList<AdminFeaturedPayment>(token, ADMIN_FINANCIALS_FEATURED_PAYMENTS_ENDPOINT, params, [CACHE_TAGS.ADMIN_FINANCIAL_CARDS])
}

export async function getAdminSubscriptions(
    token: string | undefined,
    params?: Record<string, any>,
): Promise<TabSlice<AdminSubscription>> {
    return apiFetchList<AdminSubscription>(token, ADMIN_FINANCIALS_SUBSCRIPTIONS_ENDPOINT, params, [CACHE_TAGS.ADMIN_FINANCIAL_CARDS])
}
