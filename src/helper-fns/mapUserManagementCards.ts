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



const safeFloat = (val: any): number => {
    const n = typeof val === 'number' ? val : parseFloat(val)
    return isFinite(n) ? n : 0
}

const safeChange = (val: any): number => {
    const n = typeof val === 'number' ? val : parseFloat(val)
    return isFinite(n) ? n : 0
}

export function mapUserProfileCards(cards: UserKPICards | null): UserProfileMetrics[] {
    if (!cards) return []

    const totalSpent = safeFloat(cards.total_spent)
    const lastOrderValue = safeFloat(cards.last_order_value)
    const ticketsBought = safeFloat(cards.tickets_bought)
    const refundCount = safeFloat(cards.refund_count)

    const totalSpentChange = safeChange(cards.total_spent_change)
    const ticketsBoughtChange = safeChange(cards.tickets_bought_change)
    const refundCountChange = safeChange(cards.refund_count_change)
    const lastOrderChange = safeChange(cards.last_order_value_change)

    const getStatus = (change: number): "good" | "bad" | "moderate" => {
        if (change > 5) return "good"
        if (change < 0) return "bad"
        return "moderate"
    }

    return [
        {
            id: "total-spent",
            label: "Total Spent",
            value: `₦${totalSpent.toLocaleString()}`,
            trendData: makeTrend(totalSpent, totalSpentChange),
            percentage: `${totalSpentChange > 0 ? "+" : ""}${totalSpentChange.toFixed(1)}%`,
            status: getStatus(totalSpentChange),
        },
        {
            id: "tickets-bought",
            label: "Tickets Bought",
            value: String(ticketsBought),
            trendData: makeTrend(ticketsBought, ticketsBoughtChange),
            percentage: `${ticketsBoughtChange > 0 ? "+" : ""}${ticketsBoughtChange.toFixed(1)}%`,
            status: getStatus(ticketsBoughtChange),
        },
        {
            id: "refund-count",
            label: "Refund Count",
            value: String(refundCount),
            trendData: makeTrend(refundCount, refundCountChange),
            percentage: `${Math.abs(refundCountChange).toFixed(1)}%`,
            status: refundCountChange > 0 ? "bad" : "good",
        },
        {
            id: "last-order-value",
            label: "Last Order Value",
            value: `₦${lastOrderValue.toLocaleString()}`,
            trendData: makeTrend(lastOrderValue, lastOrderChange),
            percentage: `${lastOrderChange > 0 ? "+" : ""}${lastOrderChange.toFixed(1)}%`,
            status: getStatus(lastOrderChange),
        },
    ]
}

export function mapHostCardsToMetrics(cards: AdminHostCards | null): MetricCardData1[] {
    if (!cards) return []

    const formatGrowth = (g: number) => `${g > 0 ? "+" : ""}${g.toFixed(1)}%`

    return [
        {
            id: "total_hosts",
            label: "Total Hosts",
            value: cards.total_hosts.toLocaleString(),
            description: "All registered hosts",
            icon: "famicons:people-outline",
            iconColor: "text-[#359160]",
        },
        {
            id: "new_this_period",
            label: "New This Period",
            value: cards.new_this_period.toLocaleString(),
            description: formatGrowth(cards.new_growth) + " growth",
            icon: "famicons:gift-outline",
            iconColor: "text-brand-accent-5",
        },
        {
            id: "tickets_sold",
            label: "Tickets Sold",
            value: cards.tickets_sold.toLocaleString(),
            description: formatGrowth(cards.tickets_growth) + " vs last period",
            icon: "hugeicons:ticket-02",
            iconColor: "text-[#5E92DF]",
        },
        {
            id: "commission_paid",
            label: "Commission Paid",
            value: `₦${Number(cards.commission_paid).toLocaleString()}`,
            description: formatGrowth(cards.commission_growth) + " vs last period",
            icon: "hugeicons:dollar-square",
            iconColor: "text-[#914613]",
        },
    ]
}