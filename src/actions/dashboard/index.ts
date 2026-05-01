import { CACHE_TAGS } from "@/cache-tags"
import {
    ADMIN_DASHBOARD_CARDS_ENDPOINT,
    ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT,
    ADMIN_DASHBOARD_REVENUE_ENDPOINT,
    ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT,
    DASHBOARD_OVERVIEW_ENDPOINT,
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cacheTag } from "next/cache"

// ─── Internal cached fetch — token passed as arg, 'use cache' scoped here ─────

async function cachedFetch<T>(
    token: string | undefined,
    path: string,
    tag: string,
    params?: Record<string, string | number | undefined>,
): Promise<{ success: boolean; data?: T; message?: string }> {
    'use cache'
    cacheTag(tag)
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
        if (!res.ok) {
            const json = await res.json().catch(() => ({}))
            return { success: false, message: json?.message ?? "Request failed" }
        }
        const json = await res.json()
        return { success: true, data: json.data as T }
    } catch (err: any) {
        return { success: false, message: err?.message ?? "Failed to load data." }
    }
}

// ─── Exported GETs (server pages read cookies, pass token here) ───────────────

export async function getAdminDashboardCards(
    token: string | undefined,
): Promise<{ success: boolean; data?: AdminDashboardCardsData; message?: string }> {
    return cachedFetch<AdminDashboardCardsData>(token, ADMIN_DASHBOARD_CARDS_ENDPOINT, CACHE_TAGS.DASHBOARD_CARDS)
}

export async function getAdminTicketAnalytics(
    token: string | undefined,
): Promise<{ success: boolean; data?: AdminTicketAnalyticsData; message?: string }> {
    return cachedFetch<AdminTicketAnalyticsData>(token, ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT, CACHE_TAGS.DASHBOARD_TICKET_ANALYTICS)
}

export async function getAdminRevenueAnalytics(
    token: string | undefined,
    period: string = "month",
): Promise<{ success: boolean; data?: AdminRevenueData; message?: string }> {
    return cachedFetch<AdminRevenueData>(token, ADMIN_DASHBOARD_REVENUE_ENDPOINT, CACHE_TAGS.DASHBOARD_REVENUE, { period })
}

export async function getAdminActivities(
    token: string | undefined,
    page: number = 1,
): Promise<{ success: boolean; data?: AdminActivitiesData; message?: string }> {
    return cachedFetch<AdminActivitiesData>(
        token,
        `${ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT}?page=${page}`,
        `${CACHE_TAGS.DASHBOARD_ACTIVITIES}_page_${page}`,
    )
}

export async function getUpcomingEvents(
    token: string | undefined,
    params: UpcomingEventsParams = {},
): Promise<GetUpcomingEventsResult> {
    'use cache'
    cacheTag(CACHE_TAGS.UPCOMING_EVENTS)
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${DASHBOARD_OVERVIEW_ENDPOINT}`)

        if (params.page != null) url.searchParams.set("page", String(params.page))
        if (params.search != null) url.searchParams.set("search", params.search)
        if (params.ordering != null) url.searchParams.set("ordering", params.ordering)
        if (params.status != null) url.searchParams.set("status", params.status)
        if (params.category != null) url.searchParams.set("category", String(params.category))
        if (params.performance != null) url.searchParams.set("performance", params.performance)
        if (params.start_date != null) url.searchParams.set("start_date", params.start_date)
        if (params.end_date != null) url.searchParams.set("end_date", params.end_date)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })

        if (!res.ok) {
            const json = await res.json()
            console.error("[getUpcomingEvents] status:", res.status, json)
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }
    } catch (err) {
        console.error("[getUpcomingEvents] error:", err)
        return { success: false, message: "Failed to load upcoming events." }
    }
}
