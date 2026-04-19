export const DASHBOARD_STAT_CARD_THEMES = {
    REVENUE: {
        bg: "#B79BFF",
        text: "#FFFFFF",
        trendPositive: "#FFFFFF",
        trendNegative: "#FFD6D6",
    },
    USERS: {
        bg: "#FFF3D9",
        text: "#3D4149",
        trendPositive: "#6C8C3C",
        trendNegative: "#F44336",
    },
    TRANSACTIONS: {
        bg: "#EFFFED",
        text: "#3D4149",
        trendPositive: "#4CAF50",
        trendNegative: "#F44336",
    },
    EVENTS: {
        bg: "#FFE2E5",
        text: "#3D4149",
        trendPositive: "#4CAF50",
        trendNegative: "#F44336",
    },
    PAYOUTS: {
        bg: "#C2D5F3",
        text: "#3D4149",
        trendPositive: "#4CAF50",
        trendNegative: "#F44336",
    },
    SYSTEM: {
        bg: "#C7FFA5",
        text: "#3D4149",
        trendPositive: "#4CAF50",
        trendNegative: "#F44336",
    },
} as const;


export const DASHBOARD_STATS_CONFIG = [
    {
        key: "platform_revenue",
        label: "Platform Revenue",
        subLabel: "Current Value",
        type: "currency",
        theme: DASHBOARD_STAT_CARD_THEMES.REVENUE,
    },
    {
        key: "total_users",
        label: "Total Users (Buyers & Sellers)",
        subLabel: "Current Number",
        type: "number",
        theme: DASHBOARD_STAT_CARD_THEMES.USERS,
    },
    {
        key: "transactions_today",
        label: "Transactions Today",
        subLabel: "Current Value",
        type: "number",
        theme: DASHBOARD_STAT_CARD_THEMES.TRANSACTIONS,
    },
    {
        key: "active_events",
        label: "Active Events",
        subLabel: "Current Value",
        type: "number",
        theme: DASHBOARD_STAT_CARD_THEMES.EVENTS,
    },
    {
        key: "pending_payouts",
        label: "Pending Payouts",
        subLabel: "Current Value",
        type: "number",
        theme: DASHBOARD_STAT_CARD_THEMES.PAYOUTS,
    },
    {
        key: "system_health",
        label: "System Health",
        subLabel: "Uptime",
        type: "percent",
        theme: DASHBOARD_STAT_CARD_THEMES.SYSTEM,
    },
]




export type DashboardStatusMetricsCardsConfig = {
    id: string
    label: string
    description: string
    variant: 'primary' | 'accent' | 'blue'
}

export const dashboardStatusMetricsCardsConfig: DashboardStatusMetricsCardsConfig[] = [
    {
        id: 'active-users',
        label: 'Active Users',
        description: 'Users online now',
        variant: 'primary'
    },
    {
        id: 'active-sellers',
        label: "Active Seller's",
        description: 'Sellers currently live',
        variant: 'accent'
    },
    {
        id: 'monthly-gmv',
        label: 'Monthly GMV',
        description: 'Sales this month',
        variant: 'blue'
    }
]


export const dashboardStatusMetricsCardsConfigVariantStyles = {
    primary: {
        container: 'bg-brand-primary-1 border-brand-primary-2',
        value: 'text-brand-primary-4',
        label: 'text-brand-primary-4',
        description: 'text-brand-primary-4',
    },
    accent: {
        container: 'bg-brand-accent-1 border-brand-accent-2',
        value: 'text-brand-accent-4',
        label: 'text-brand-accent-4',
        description: 'text-brand-accent-5',
    },
    blue: {
        container: 'bg-brand-primary-4 border-brand-primary-5',
        value: 'text-white',
        label: 'text-white',
        description: 'text-white/80',
    }
}
