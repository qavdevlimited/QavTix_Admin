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
import { getServerAxios } from "@/lib/axios"
import { cookies } from "next/headers";

export async function getAdminDashboardCards(): Promise<{ success: boolean; data?: AdminDashboardCardsData; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        const res = await axiosInstance.get(`/${ADMIN_DASHBOARD_CARDS_ENDPOINT}`)
        return { success: true, data: res.data.data }
    } catch (err: any) {
        console.error("[getAdminDashboardCards] error:", err?.response?.data || err.message)
        return { success: false, message: "Failed to load dashboard overview." }
    }
}

export async function getAdminTicketAnalytics(): Promise<{ success: boolean; data?: AdminTicketAnalyticsData; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        const res = await axiosInstance.get(`/${ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT}`)
        return { success: true, data: res.data.data }
    } catch (err: any) {
        console.error("[getAdminTicketAnalytics] error:", err?.response?.data || err.message)
        return { success: false, message: "Failed to load ticket analytics." }
    }
}

export async function getAdminRevenueAnalytics(period: string = "month"): Promise<{ success: boolean; data?: AdminRevenueData; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        const res = await axiosInstance.get(`/${ADMIN_DASHBOARD_REVENUE_ENDPOINT}`, {
            params: { period }
        })
        return { success: true, data: res.data.data }
    } catch (err: any) {
        console.error("[getAdminRevenueAnalytics] error:", err?.response?.data || err.message)
        return { success: false, message: "Failed to load revenue analytics." }
    }
}

export async function getAdminActivities(): Promise<{ success: boolean; data?: AdminActivitiesData; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        const res = await axiosInstance.get(`/${ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT}`)
        return { success: true, data: res.data.data }
    } catch (err: any) {
        console.error("[getAdminActivities] error:", err?.response?.data || err.message)
        return { success: false, message: "Failed to load activities." }
    }
}




async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}


// Upcoming Events
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
