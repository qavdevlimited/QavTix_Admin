"use client"

import { cn } from "@/lib/utils"
import { AffiliateSparklineCard } from "@/helper-fns/mapUserManagementCards"
import AffiliateMetricCard from "./AffiliateMetricCard"

interface AffiliateMetricCardsContainerProps {
    metrics: AffiliateSparklineCard[]
    className?: string
}

export default function AffiliateMetricCardsContainer({ metrics, className }: AffiliateMetricCardsContainerProps) {
    return (
        <div className={cn(
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
            className
        )}>
            {metrics.map((metric) => (
                <AffiliateMetricCard key={metric.id} data={metric} />
            ))}
        </div>
    )
}
