import { formatPrice } from "./formatPrice"
import { makeTrend } from "./makeTrend"
import { DASHBOARD_STAT_CARD_THEMES } from "@/components/cards/resources/configs/dashboard-metrics"

// Shape for the regular flat MetricCard1 (Users + Withdrawals tabs)
export function mapUserCardsToMetrics(cards: AdminUserCards | null, currency: string): MetricCardData1[] {
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
            value: formatPrice(Number(cards.average_spend), currency),
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

export function mapAffiliateCardsToSparkline(cards: AdminAffiliateCards | null, currency: string): AffiliateSparklineCard[] {
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
            value: formatPrice(Number(cards.total_commission), currency, true, true),
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

export function mapUserProfileCards(cards: UserKPICards | null, currency: string): UserProfileMetrics[] {
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
            value: formatPrice(totalSpent, currency),
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
            value: formatPrice(lastOrderValue, currency),
            trendData: makeTrend(lastOrderValue, lastOrderChange),
            percentage: `${lastOrderChange > 0 ? "+" : ""}${lastOrderChange.toFixed(1)}%`,
            status: getStatus(lastOrderChange),
        },
    ]
}

export function mapHostCardsToMetrics(cards: AdminHostCards | null, currency: string): MetricCardData1[] {
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
            value: formatPrice(Number(cards.commission_paid), currency),
            description: formatGrowth(cards.commission_growth) + " vs last period",
            icon: "hugeicons:dollar-square",
            iconColor: "text-[#914613]",
        },
    ]
}

export function mapHostEarningsCardsToMetrics(cards: HostEarningsCards | null, currency: string): MetricCardData1[] {
    if (!cards) return []

    return [
        {
            id: "all_time_earnings",
            label: "All-Time Earnings",
            value: formatPrice(Number(cards.all_time_earnings), currency),
            description: "Total revenue generated",
            icon: "hugeicons:dollar-square",
            iconColor: "text-[#359160]",
        },
        {
            id: "current_balance",
            label: "Current Balance",
            value: formatPrice(Number(cards.current_balance), currency),
            description: "Available to withdraw",
            icon: "hugeicons:dollar-circle",
            iconColor: "text-[#FF9249]",
        },
        {
            id: "all_time_payouts",
            label: "All-Time Payouts",
            value: formatPrice(Number(cards.all_time_payouts), currency),
            description: "Total withdrawn so far",
            icon: "hugeicons:wallet-done-02",
            iconColor: "text-[#914613]",
        },
        {
            id: "next_payout",
            label: "Next Payout Date",
            value: cards.next_payout_date
                ? new Date(cards.next_payout_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
                : "N/A",
            description: "Scheduled disbursement",
            icon: "solar:calendar-linear",
            iconColor: "text-brand-primary-5",
        },
    ]
}

export function mapAdminEventCardsToMetrics(cards: AdminEventCards | null): MetricCardData1[] {
    if (!cards) return []

    return [
        {
            id: "live",
            label: "Live Events",
            value: cards.live.toLocaleString(),
            description: "Currently active events",
            icon: "hugeicons:calendar-03",
            iconColor: "text-[#359160]",
        },
        {
            id: "suspended",
            label: "Suspended",
            value: cards.suspended.toLocaleString(),
            description: "Paused by admin",
            icon: "hugeicons:task-edit-02",
            iconColor: "text-[#FF9249]",
        },
        {
            id: "ended",
            label: "Ended",
            value: cards.ended.toLocaleString(),
            description: "Already concluded",
            icon: "fluent-mdl2:end-point-solid",
            iconColor: "text-[#EF4444]",
        },
        {
            id: "sold_out",
            label: "Sold Out",
            value: cards.sold_out.toLocaleString(),
            description: "Fully booked events",
            icon: "hugeicons:wallet-done-01",
            iconColor: "text-[#5E92DF]",
        },
    ]
}

export function mapAdminFinancialCardsToMetrics(cards: AdminFinancialCards | null, currency?: string): MetricCardData1[] {
    if (!cards) return []

    const fmt = (v: string) => {
        const n = Number(v)
        if (n >= 1_000_000) return formatPrice(n / 1_000_000, currency) + 'M'
        if (n >= 1_000) return formatPrice(n / 1_000, currency) + 'K'
        return formatPrice(n, currency)
    }

    return [
        {
            id: "total_gmv",
            label: "Total GMV",
            value: fmt(cards.total_gmv),
            description: "Gross merchandise value",
            icon: "hugeicons:dollar-square",
            iconColor: "text-[#359160]",
        },
        {
            id: "platform_fees",
            label: "Platform Fees",
            value: fmt(cards.platform_fees),
            description: "Fees earned by platform",
            icon: "hugeicons:task-edit-02",
            iconColor: "text-[#FF9249]",
        },
        {
            id: "affiliate_balance",
            label: "Affiliate Balance",
            value: fmt(cards.affiliate_balance),
            description: "Outstanding affiliate earnings",
            icon: "hugeicons:user-add-01",
            iconColor: "text-[#C100C8]",
        },
        {
            id: "pending_payouts",
            label: "Pending Payouts",
            value: fmt(cards.pending_payouts),
            description: "Awaiting disbursement",
            icon: "hugeicons:wallet-01",
            iconColor: "text-[#5E92DF]",
        },
    ]
}

export function mapAdminResaleCardsToMetrics(cards: AdminResaleCards | null, currency?: string): MetricCardData1[] {
    if (!cards) return []

    const fmt = (v: string) => {
        const n = Number(v)
        if (n >= 1_000_000) return formatPrice(n / 1_000_000, currency) + 'M'
        if (n >= 1_000) return formatPrice(n / 1_000, currency) + 'K'
        return formatPrice(n, currency)
    }

    return [
        {
            id: "total_resale_revenue",
            label: "Resale Revenue",
            value: fmt(cards.total_resale_revenue),
            description: "Total marketplace revenue",
            icon: "hugeicons:dollar-square",
            iconColor: "text-[#359160]",
        },
        {
            id: "net_profit",
            label: "Net Profit",
            value: fmt(cards.net_profit),
            description: "After deductions",
            icon: "hugeicons:dollar-circle",
            iconColor: "text-[#FF9249]",
        },
        {
            id: "tickets_resold",
            label: "Tickets Resold",
            value: Number(cards.tickets_resold).toLocaleString(),
            description: "Total resale transactions",
            icon: "hugeicons:ticket-02",
            iconColor: "text-[#C100C8]",
        },
        {
            id: "active_listings",
            label: "Active Listings",
            value: Number(cards.active_listings).toLocaleString(),
            description: "Currently live listings",
            icon: "hugeicons:property-view",
            iconColor: "text-[#5E92DF]",
        },
    ]
}