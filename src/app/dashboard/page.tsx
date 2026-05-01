import { 
    getAdminActivities, 
    getAdminDashboardCards, 
    getAdminRevenueAnalytics, 
    getAdminTicketAnalytics 
} from "@/actions/dashboard/index";
import DashboardPageCW from "@/components/page-content-wrappers/DashboardPageCW";
import { cookies } from "next/headers";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;
    const [cardsResult, ticketAnalyticsResult, revenueResult, activitiesResult] = await Promise.all([
        getAdminDashboardCards(token),
        getAdminTicketAnalytics(token),
        getAdminRevenueAnalytics(token, "month"),
        getAdminActivities(token)
    ]);

    return (
        <DashboardPageCW 
            cardsData={cardsResult.data}
            ticketAnalytics={ticketAnalyticsResult.data}
            initialRevenueData={revenueResult.data}
            activitiesData={activitiesResult.data}
        />
    )
}