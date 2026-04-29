"use server";

import { cookies } from "next/headers";
import { getAdminDashboardCards, getAdminTicketAnalytics, getAdminRevenueAnalytics, getAdminActivities, getUpcomingEvents, revalidateDashboard } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("admin_access_token")?.value;
}

export async function getAdminDashboardCardsClient(...args: any[]) {
    return (getAdminDashboardCards as any)(await getToken(), ...args);
}

export async function getAdminTicketAnalyticsClient(...args: any[]) {
    return (getAdminTicketAnalytics as any)(await getToken(), ...args);
}

export async function getAdminRevenueAnalyticsClient(...args: any[]) {
    return (getAdminRevenueAnalytics as any)(await getToken(), ...args);
}

export async function getAdminActivitiesClient(...args: any[]) {
    return (getAdminActivities as any)(await getToken(), ...args);
}

export async function getUpcomingEventsClient(...args: any[]) {
    return (getUpcomingEvents as any)(await getToken(), ...args);
}

export async function revalidateDashboardClient(...args: any[]) {
    return (revalidateDashboard as any)(await getToken(), ...args);
}
