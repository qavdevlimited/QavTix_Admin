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
import { TabSlice } from "@/custom-hooks/UseDataDisplay"

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(
    token: string | undefined,
    path: string,
    params?: Record<string, any>
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
    params?: Record<string, any>
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

export async function getAdminUsers(token: string | undefined) {
    const data = await apiFetchList<AdminCustomer>(token, ADMIN_USERS_ENDPOINT)
    return { data }
}

export async function getAdminUsersCards(token: string | undefined, params?: Record<string, any>) {
    const { data } = await apiFetch<AdminUserCards>(token, ADMIN_USERS_CARDS_ENDPOINT, params)
    return { cards: data ?? null }
}

export async function getAdminAffiliates(token: string | undefined) {
    const data = await apiFetchList<AdminAffiliate>(token, ADMIN_AFFILIATES_ENDPOINT)
    return { data }
}

export async function getAdminAffiliatesCards(token: string | undefined, params?: Record<string, any>) {
    const { data } = await apiFetch<AdminAffiliateCards>(token, ADMIN_AFFILIATES_CARDS_ENDPOINT, params)
    return { cards: data ?? null }
}

export async function getAdminUserProfile(token: string | undefined, userId: string | number) {
    const { data } = await apiFetch<UserProfileDetails>(token, ADMIN_USER_PROFILE_ENDPOINT(userId))
    return { data: data ?? null }
}

export async function getAdminUserCards(token: string | undefined, userId: string | number, dateRange?: DatePreset) {
    const { data } = await apiFetch<UserKPICards>(token, ADMIN_USER_CARDS_ENDPOINT(userId), dateRange ? { date_range: dateRange } : {})
    return { cards: data ?? null }
}

export async function getAdminUserChart(token: string | undefined, userId: string | number, dateRange?: DatePreset) {
    const { data } = await apiFetch<UserChartDataPoint[]>(token, ADMIN_USER_CHART_ENDPOINT(userId), dateRange ? { date_range: dateRange } : {})
    return { chart: data ?? {} }
}

export async function getAdminWithdrawals(token: string | undefined) {
    return apiFetchList<AdminWithdrawal>(token, ADMIN_WITHDRAWALS_ENDPOINT)
}

export async function getAdminUserOrders(token: string | undefined, userId: string | number) {
    return apiFetchList<UserPurchaseOrder>(token, ADMIN_USER_PURCHASE_HISTORY_ENDPOINT(userId))
}
