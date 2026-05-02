"use server"

import {
    ADMIN_DASHBOARD_CARDS_ENDPOINT,
    ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT,
    ADMIN_DASHBOARD_REVENUE_ENDPOINT,
    ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT,
    DASHBOARD_OVERVIEW_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

export async function revalidateDashboard() {
    revalidateTag(CACHE_TAGS.DASHBOARD_CARDS, 'max')
    revalidateTag(CACHE_TAGS.DASHBOARD_ACTIVITIES, 'max')
}

// ─── Interactive GETs (for client-side refreshes) ────────────────────────────

export async function getAdminDashboardCards(): Promise<{ success: boolean; data?: AdminDashboardCardsData; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_DASHBOARD_CARDS_ENDPOINT}`)
        return { success: true, data: data.data }
    } catch {
        return { success: false, message: "Failed to load dashboard cards." }
    }
}

export async function getAdminTicketAnalytics(): Promise<{ success: boolean; data?: AdminTicketAnalyticsData; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT}`)
        return { success: true, data: data.data }
    } catch {
        return { success: false, message: "Failed to load ticket analytics." }
    }
}

export async function getAdminRevenueAnalytics(period: string = "month"): Promise<{ success: boolean; data?: AdminRevenueData; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_DASHBOARD_REVENUE_ENDPOINT}`, { params: { period } })
        return { success: true, data: data.data }
    } catch {
        return { success: false, message: "Failed to load revenue analytics." }
    }
}

export async function getAdminActivities(page: number = 1): Promise<{ success: boolean; data?: AdminActivitiesData; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT}`, { params: { page } })
        return { success: true, data: data.data }
    } catch {
        return { success: false, message: "Failed to load activities." }
    }
}

export async function getUpcomingEvents(params: UpcomingEventsParams = {}): Promise<GetUpcomingEventsResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${DASHBOARD_OVERVIEW_ENDPOINT}`, { params })
        return { success: true, data: data.data }
    } catch {
        return { success: false, message: "Failed to load upcoming events." }
    }
}
