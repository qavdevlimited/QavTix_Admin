import { CACHE_TAGS } from "@/cache-tags"
import {
    ADMIN_DASHBOARD_CARDS_ENDPOINT,
    ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT,
    ADMIN_DASHBOARD_REVENUE_ENDPOINT,
    ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT,
    DASHBOARD_OVERVIEW_ENDPOINT,
} from "@/endpoints"

// ─── Pure fetch helper — token passed as arg, no directives ──────────────────

async function apiFetch<T>(
    token: string | undefined,
    path: string,
    params?: Record<string, string | number | undefined>,
    tags?: string[],
): Promise<{ success: boolean; data?: T; message?: string }> {
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
        if (!res.ok) {
            return { success: false, message: "Request failed" }
        }
        const json = await res.json()
        return { success: true, data: json.data as T }
    } catch (err: any) {
        return { success: false, message: "Failed to load data." }
    }
}

// ─── Exported GETs (server pages read cookies, pass token here) ───────────────

export async function getAdminDashboardCards(
    token: string | undefined,
): Promise<{ success: boolean; data?: AdminDashboardCardsData; message?: string }> {
    return apiFetch<AdminDashboardCardsData>(token, ADMIN_DASHBOARD_CARDS_ENDPOINT, {}, [CACHE_TAGS.DASHBOARD_CARDS])
}

export async function getAdminTicketAnalytics(
    token: string | undefined,
): Promise<{ success: boolean; data?: AdminTicketAnalyticsData; message?: string }> {
    return apiFetch<AdminTicketAnalyticsData>(token, ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT, {}, [CACHE_TAGS.DASHBOARD_TICKET_ANALYTICS])
}

export async function getAdminRevenueAnalytics(
    token: string | undefined,
    period: string = "month",
): Promise<{ success: boolean; data?: AdminRevenueData; message?: string }> {
    return apiFetch<AdminRevenueData>(token, ADMIN_DASHBOARD_REVENUE_ENDPOINT, { period }, [CACHE_TAGS.DASHBOARD_REVENUE])
}

export async function getAdminActivities(
    token: string | undefined,
    page: number = 1,
): Promise<{ success: boolean; data?: AdminActivitiesData; message?: string }> {
    return apiFetch<AdminActivitiesData>(
        token,
        ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT,
        { page },
        [CACHE_TAGS.DASHBOARD_ACTIVITIES]
    )
}

export async function getUpcomingEvents(
    token: string | undefined,
    params: UpcomingEventsParams = {},
): Promise<GetUpcomingEventsResult> {
    return apiFetch<any>(token, DASHBOARD_OVERVIEW_ENDPOINT, params as any, [CACHE_TAGS.UPCOMING_EVENTS])
}
