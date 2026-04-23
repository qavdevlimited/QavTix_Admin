"use client"

import { cn } from "@/lib/utils"
import { DashboardStatusMetricsCardsConfig, dashboardStatusMetricsCardsConfigVariantStyles } from "./resources/configs/dashboard-metrics"
import { space_grotesk } from "@/lib/fonts"

interface DashboardStatusMetricCardsProps {
    config: DashboardStatusMetricsCardsConfig & { value: string | number }
}

export default function DashboardStatusMetricsCard({ config }: DashboardStatusMetricCardsProps) {

    const styles = dashboardStatusMetricsCardsConfigVariantStyles[config.variant]

    return (
        <div className={cn(
            "flex flex-wrap items-center gap-3 gap-y-1 w-full min-w-40 max-h-20 px-4 py-3 rounded-lg border-[1.5px] transition-all duration-200 hover:shadow-md",
            styles.container
        )}>
            <h4 className={cn(space_grotesk.className, "font-bold text-xl", styles.label)}>{config.value}</h4>

            <div className="flex flex-col justify-center">
                <div className="flex flex-col -mt-0.5">
                    <span className={cn("text-xs font-bold whitespace-nowrap", styles.label)}>
                        {config.label}
                    </span>
                    <span className={cn("text-[10px] leading-tight line-clamp-2 max-w-30", styles.description)}>
                        {config.description}
                    </span>
                </div>
            </div>
        </div>
    )
}