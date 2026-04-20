"use client"

import { calculateTrend } from "@/helper-fns/calculateTrend";
import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";
import UserProfileMetricSparkline from "../charts/UserProfileMetricsSparkLine";


export default function UserProfileMetricCard({
    label,
    value,
    trendData,
    status = 'good',
}: UserProfileMetrics) {

    const trend = calculateTrend(trendData)
    const isPositive = trend.direction === 'up';
    const safePercent = isFinite(trend.percentageChange) ? trend.percentageChange : 0

    const statusColors = {
        good: "text-[#10B981]",
        moderate: "text-[#F59E0B]",
        bad: "text-[#EF4444]"
    }

    return (
        <div className="rounded-xl bg-white p-5 flex flex-col justify-between h-30 w-full max-w-70 border border-gray-100 shadow-[0px_5.8px_23.17px_0px_#3326AE14] transition-all hover:shadow-md cursor-default select-none">
            <div className="flex justify-between items-start">
                <span className="text-xs text-brand-secondary-9">{label}</span>
                <span className={cn("text-xs font-bold", statusColors[status])}>
                    {safePercent <= 0 ? '0%' : (isPositive ? '+' : '-') + Math.abs(safePercent).toFixed(0) + '%'}
                </span>
            </div>

            <div className="flex justify-between gap-2 items-end mt-2">
                <h3 className={cn(space_grotesk.className, "text-xl font-bold text-brand-secondary-9")}>
                    {value}
                </h3>

                <div className="mb-1">
                    <UserProfileMetricSparkline
                        data={trendData}
                        status={status}
                        width={80}
                        height={40}
                    />
                </div>
            </div>
        </div>
    )
}