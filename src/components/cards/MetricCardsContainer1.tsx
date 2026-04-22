import { cn } from "@/lib/utils"
import MetricCard1 from "./MetricCard1"
import UserProfileMetricCard from "./UserProfileMetricsCard"

interface MetricsCardsConatinerProps {
    metrics: MetricCardData1[] | UserProfileMetrics[]
    className?: string
    metricsFor?: "user_profile" | "host_profile" | "users" | "hosts" | "events" | "financials"
}

export default function MetricCardsContainer1({ metrics, className, metricsFor }: MetricsCardsConatinerProps) {

    return (
        <div className={cn(
            'grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-4 gap-4',
            className
        )}>
            {metrics.map((metric) => (
                metricsFor === "users" || metricsFor === "hosts" || metricsFor === "events" || metricsFor === "host_profile" || metricsFor === "financials" ?
                    <MetricCard1 key={metric.id} data={metric as MetricCardData1} />
                    :
                    metricsFor === "user_profile" ?
                        <UserProfileMetricCard key={metric.id} {...metric as UserProfileMetrics} />
                        :
                        null
            ))}
        </div>
    )
}