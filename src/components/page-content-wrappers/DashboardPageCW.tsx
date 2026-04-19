"use client"

import ExportButton1 from "@/lib/features/export/ExportDataBtn1";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import DashboardMetricCardsContainer from "../cards/DashboardMetricsCardContainer";
import { DASHBOARD_STATS_CONFIG } from "../cards/resources/configs/dashboard-metrics";
import DashboardMetricCard from "../cards/DashboardMetricsCard";
import { formatStatValue } from "@/helper-fns/buildMetricsConfig";
import OverviewSection from "../dashboard/OverviewSection";
import ActivitySectionCW from "./ActivitySectionCW";
import QuickActionsSection from "../dashboard/QuickActionSection";
import DashboardRevenueAreaChart from "../charts/DashboardRevenueAreaChart";
import SalesBreakdownChart from "../charts/SalesBreakdownChart";
import { makeTrend } from "@/helper-fns/makeTrend";

interface DashboardPageCWProps {
    cardsData?: AdminDashboardCardsData;
    ticketAnalytics?: AdminTicketAnalyticsData;
    initialRevenueData?: AdminRevenueData;
    activitiesData?: AdminActivitiesData;
}



export default function DashboardPageCW({
    cardsData,
    ticketAnalytics,
    initialRevenueData,
    activitiesData
}: DashboardPageCWProps) {
    const s1 = cardsData?.section_one;

    return (
        <main className="pb-12 mt-10 lg:mt-4">
            <div className="flex justify-between items-center gap-5 mb-8">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>Overview</h2>
                <ExportButton1 showFormatSelector />
            </div>

            <DashboardMetricCardsContainer>
                {DASHBOARD_STATS_CONFIG.map((config) => {
                    const rawValue = s1 ? (s1 as any)[config.key] : 0;

                    let growthPercent = 0;
                    if (config.key === "platform_revenue") growthPercent = s1?.revenue_growth || 0;
                    else if (config.key === "total_users") growthPercent = s1?.user_growth || 0;

                    const history = makeTrend(Number(rawValue) || 0, growthPercent);

                    if (config.key === "system_health") {
                        return (
                            <div key={config.key} className="min-w-70 shrink-0">
                                <DashboardMetricCard
                                    label={config.label}
                                    subLabel="Uptime"
                                    value={`${s1?.system_uptime ?? 0}%`}
                                    trendData={history}
                                    changePercent={growthPercent}
                                    theme={config.theme}
                                    extraValue={`${s1?.total_users ?? 0} Users`}
                                    extraLabel="Active Sessions"
                                />
                            </div>
                        )
                    }

                    return (
                        <div key={config.key} className="min-w-60 shrink-0">
                            <DashboardMetricCard
                                label={config.label}
                                subLabel={config.subLabel}
                                value={formatStatValue(rawValue as number, config.type as any)}
                                trendData={history}
                                changePercent={growthPercent}
                                theme={config.theme}
                            />
                        </div>
                    )
                })}
            </DashboardMetricCardsContainer>


            <div className="flex flex-wrap gap-5 mt-10">
                <div className="flex-1 basis-140 space-y-8">
                    <OverviewSection
                        sectionTwo={cardsData?.section_two}
                    />

                    <QuickActionsSection
                        sectionThree={cardsData?.section_three}
                    />

                    <DashboardRevenueAreaChart initialData={initialRevenueData} />
                </div>

                <div className="w-full lg:w-fit">
                    <div className="grid justify-items-center grid-cols-[repeat(auto-fit,minmax(320px,1fr))] lg:grid-cols-1 gap-y-8">
                        <div className="w-full max-w-80">
                            <ActivitySectionCW activitiesData={activitiesData} />
                        </div>

                        <div className="w-full max-w-80">
                            <SalesBreakdownChart ticketAnalytics={ticketAnalytics} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}