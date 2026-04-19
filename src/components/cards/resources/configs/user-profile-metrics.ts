
export const USER_PROFILE_METRICS_CONFIG : UserProfileMetrics[] = [
    {
        id: "total-spent",
        label: "Total Spent",
        value: "₦234,500",
        trendData: [10, 15, 8, 12, 18, 22],
        percentage: "+22%",
        status: "moderate"
    },
    {
        id: "tickets-bought",
        label: "Tickets Bought",
        value: "51",
        trendData: [5, 10, 5, 8, 12, 15],
        percentage: "+8%",
        status: "good"
    },
    {
        id: "refund-count",
        label: "Refund Count",
        value: "51",
        trendData: [20, 15, 25, 10, 5, 2],
        percentage: "18%",
        status: "bad"
    },
    {
        id: "last-order-value",
        label: "Last Order Value",
        value: "7200",
        trendData: [20, 15, 25, 10, 5, 2],
        status: "bad",
        percentage: "8%"
    }
] as const;