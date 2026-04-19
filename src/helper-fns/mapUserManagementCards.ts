import { makeTrend } from "./makeTrend"
import { DASHBOARD_STAT_CARD_THEMES } from "@/components/cards/resources/configs/dashboard-metrics"

// Shape for the regular flat MetricCard1 (Users + Withdrawals tabs)
export function mapUserCardsToMetrics(cards: AdminUserCards | null): MetricCardData1[] {
    if (!cards) return []

    return [
        {
            id: "total_customers",
            label: "Total Customers",
            value: cards.total_customers.toLocaleString(),
            description: "All registered customers",
            icon: "famicons:people-outline",
            iconColor: 'text-[#359160]',
        },
        {
            id: "new_this_period",
            label: "New Customers",
            value: cards.new_this_period.toLocaleString(),
            description: "Joined in this period",
            icon: "famicons:gift-outline",
            iconColor: 'text-brand-accent-5',
        },
        {
            id: "repeat_buyers",
            label: "Repeat Buyers",
            value: cards.repeat_buyers.toLocaleString(),
            description: "More than one purchase",
            icon: "uil:repeat",
            iconColor: 'text-brand-accent-9',
        },
        {
            id: "average_spend",
            label: "Average Spend",
            value: `₦${Number(cards.average_spend).toLocaleString()}`,
            description: "Per customer",
            icon: "icon-park-outline:average",
            iconColor: 'text-blue-600',
        },
    ]
}

// Shape for DashboardMetricCard (Affiliates tab — sparkline cards)
export interface AffiliateSparklineCard {
    id: string
    label: string
    subLabel: string
    value: string
    trendData: number[]
    changePercent: number
    theme: typeof DASHBOARD_STAT_CARD_THEMES[keyof typeof DASHBOARD_STAT_CARD_THEMES]
}

export function mapAffiliateCardsToSparkline(cards: AdminAffiliateCards | null): AffiliateSparklineCard[] {
    if (!cards) return []

    return [
        {
            id: "total_affiliates",
            label: "Total Affiliates",
            subLabel: "All time",
            value: cards.total_affiliates.toLocaleString(),
            trendData: makeTrend(cards.total_affiliates, cards.affiliate_growth),
            changePercent: cards.affiliate_growth,
            theme: DASHBOARD_STAT_CARD_THEMES.USERS,
        },
        {
            id: "total_clicks",
            label: "Total Clicks",
            subLabel: "Link clicks",
            value: cards.total_clicks.toLocaleString(),
            trendData: makeTrend(cards.total_clicks, cards.clicks_growth),
            changePercent: cards.clicks_growth,
            theme: DASHBOARD_STAT_CARD_THEMES.TRANSACTIONS,
        },
        {
            id: "conversion_rate",
            label: "Conversion Rate",
            subLabel: "Clicks → Signups",
            value: `${cards.conversion_rate}%`,
            trendData: makeTrend(cards.conversion_rate, cards.conversion_rate_growth),
            changePercent: cards.conversion_rate_growth,
            theme: DASHBOARD_STAT_CARD_THEMES.EVENTS,
        },
        {
            id: "total_commission",
            label: "Total Commission",
            subLabel: "Earned",
            value: `₦${Number(cards.total_commission).toLocaleString()}`,
            trendData: makeTrend(Number(cards.total_commission), cards.commission_growth),
            changePercent: cards.commission_growth,
            theme: DASHBOARD_STAT_CARD_THEMES.PAYOUTS,
        },
    ]
}
