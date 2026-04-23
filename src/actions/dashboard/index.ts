"use server"

import { CACHE_TAGS } from "@/cache-tags";
import {
    ADMIN_DASHBOARD_CARDS_ENDPOINT,
    ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT,
    ADMIN_DASHBOARD_REVENUE_ENDPOINT,
    ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT,
    DASHBOARD_OVERVIEW_ENDPOINT
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

// ─── Generic cached fetch helper ─────────────────────────────────────────────
// Uses native fetch + next: { tags, revalidate } for Next.js data cache.
// Reading cookies() here is safe — fetch caches the *response*, not the request.

async function cachedFetch<T>(
    path: string,
    tag: string,
    revalidate: number,
    params?: Record<string, string | number | undefined>,
): Promise<{ success: boolean; data?: T; message?: string }> {
    try {
        const token = await getToken()
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
            next: { tags: [tag], revalidate },
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

// ─── Dashboard cached GETs ────────────────────────────────────────────────────

export async function getAdminDashboardCards(): Promise<{ success: boolean; data?: AdminDashboardCardsData; message?: string }> {
    return cachedFetch<AdminDashboardCardsData>(ADMIN_DASHBOARD_CARDS_ENDPOINT, CACHE_TAGS.DASHBOARD_CARDS, 300)
}

export async function getAdminTicketAnalytics(): Promise<{ success: boolean; data?: AdminTicketAnalyticsData; message?: string }> {
    return cachedFetch<AdminTicketAnalyticsData>(ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT, CACHE_TAGS.DASHBOARD_TICKET_ANALYTICS, 300)
}

export async function getAdminRevenueAnalytics(period: string = "month"): Promise<{ success: boolean; data?: AdminRevenueData; message?: string }> {
    return cachedFetch<AdminRevenueData>(ADMIN_DASHBOARD_REVENUE_ENDPOINT, CACHE_TAGS.DASHBOARD_REVENUE, 300, { period })
}

export async function getAdminActivities(page: number = 1): Promise<{ success: boolean; data?: AdminActivitiesData; message?: string }> {
    return cachedFetch<AdminActivitiesData>(
        `${ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT}?page=${page}`,
        `${CACHE_TAGS.DASHBOARD_ACTIVITIES}_page_${page}`,
        60
    )
}

// ─── Upcoming events (filter-driven — not pre-cached) ────────────────────────
// Uses native fetch with next: { tags } so the first call is still cached
// but can be revalidated when events change.

export async function getUpcomingEvents(
    params: UpcomingEventsParams = {}
): Promise<GetUpcomingEventsResult> {
    try {
        const token = await getToken()

        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${DASHBOARD_OVERVIEW_ENDPOINT}`
        )

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
            next: { tags: [CACHE_TAGS.UPCOMING_EVENTS] },
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

// ─── Revalidation helpers (call from server actions that mutate events) ───────

export async function revalidateDashboard() {
    revalidateTag(CACHE_TAGS.DASHBOARD_CARDS, 'max')
    revalidateTag(CACHE_TAGS.DASHBOARD_ACTIVITIES, 'max')
}
