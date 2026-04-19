"use client"

import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import DashboardMetricSparkline from "../charts/DashboardMetricsSparkline"
import { AffiliateSparklineCard } from "@/helper-fns/mapUserManagementCards"

interface AffiliateMetricCardProps {
    data: AffiliateSparklineCard
    className?: string
}

export default function AffiliateMetricCard({ data, className }: AffiliateMetricCardProps) {
    const isUp = data.changePercent > 0
    const isDown = data.changePercent < 0

    // Choose trend color - fallback to emerald/red if theme colors are meant for dark backgrounds
    const trendPositive = (data.theme.trendPositive as string) === "#FFFFFF" ? "#10B981" : data.theme.trendPositive
    const trendNegative = (data.theme.trendNegative as string) === "#FFFFFF" ? "#EF4444" : data.theme.trendNegative

    return (
        <div className={cn(
            'shadow-[0px_5.8px_23.17px_0px_#3326AE14] bg-white rounded-lg border border-brand-neutral-2 p-5 hover:scale-103 transition-transform duration-300 ease-in-out flex flex-col justify-between h-36',
            className
        )}>
            <div className="flex justify-between items-start">
                <p className="text-[11px] text-brand-secondary-6 capitalize tracking-wider mb-1">
                    {data.label}
                </p>
                {/* Trend Percentage Pill */}
                {data.changePercent !== 0 && (
                    <div className={cn(
                        "text-[10px] font-semibold flex items-center gap-1",
                        isUp ? "text-green-700" : "text-red-600"
                    )}>
                        <span className="text-[8px]">{isUp ? "▲" : "▼"}</span>
                        {Math.abs(data.changePercent)}%
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-auto">
                <h3 className={cn(space_grotesk.className, "text-2xl font-bold text-brand-secondary-9")}>
                    {data.value}
                </h3>
                <div className="mb-[-4px]">
                    <DashboardMetricSparkline
                        data={data.trendData}
                        isPositive={isUp}
                        width={90}
                        height={40}
                        theme={{
                            trendPositive: trendPositive,
                            trendNegative: trendNegative,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
