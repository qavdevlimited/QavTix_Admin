interface MetricCardData1 {
    id: string
    value: string | number
    label: string
    description: string
    icon: string
    iconColor: string
    valueFormatter?: (value: any) => string; 
}

type UserProfileMetrics = Pick<DashboardMetricCardData, "label" | "id" | "value" > & {
    status: "moderate" | "good" | "bad",
    percentage: string,
    trendData: number[]
}