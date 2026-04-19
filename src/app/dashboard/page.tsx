import { 
    getAdminActivities, 
    getAdminDashboardCards, 
    getAdminRevenueAnalytics, 
    getAdminTicketAnalytics 
} from "@/actions/dashboard";
import DashboardPageCW from "@/components/page-content-wrappers/DashboardPageCW";

export default async function DashboardPage() {
    const [cardsResult, ticketAnalyticsResult, revenueResult, activitiesResult] = await Promise.all([
        getAdminDashboardCards(),
        getAdminTicketAnalytics(),
        getAdminRevenueAnalytics("month"),
        getAdminActivities()
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