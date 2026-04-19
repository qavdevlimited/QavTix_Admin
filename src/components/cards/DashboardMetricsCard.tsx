"use client"

import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";
import DashboardMetricSparkline from "../charts/DashboardMetricsSparkline";
import { useIsMounted } from "@/custom-hooks/UseIsMounted";

interface DashboardMetricCardProps {
    label: string;
    subLabel?: string;
    value: string | number;
    trendData: number[];
    changePercent?: number;
    theme: {
        bg: string;
        text: string;
        trendPositive: string;
        trendNegative: string;
    };
    isNegativeGood?: boolean;
    extraValue?: string;
    extraLabel?: string;
}

export default function DashboardMetricCard({
    label,
    subLabel = "Current Value",
    value,
    trendData,
    changePercent = 0,
    theme,
    isNegativeGood = false,
    extraValue,
    extraLabel
}: DashboardMetricCardProps) {
    const isMounted = useIsMounted();
    const isUp = changePercent > 0;
    const isDown = changePercent < 0;
    const isStable = changePercent === 0;

    // isNegativeGood = true means going down is actually good
    const isPositive = isNegativeGood ? isDown : isUp;

    // Choose the trend color based on whether the trend is "good" or "bad" for this metric
    const trendColor = isPositive ? theme.trendPositive : theme.trendNegative;

    const sign = isUp ? "+" : isDown ? "-" : "";

    return (
        <div
            className="rounded-xl p-4 flex flex-col justify-between min-h-32 h-full min-w-55 w-60 transition-all hover:brightness-95 cursor-default select-none shadow-sm"
            style={{ backgroundColor: theme.bg }}
        >
            {/* Top Row */}
            <div className="flex justify-between items-start">
                <div className="flex gap-8">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium capitalize" style={{ color: theme.text }}>
                            {label}
                        </span>
                    </div>
                </div>
            </div>


            <div className="flex items-center justify-between gap-5 mt-3">
                <p className="text-[11px]" style={{ color: theme.text }}>
                    {subLabel}
                </p>


                {/* Extra Label Column */}
                {/* Percentage only shows if we aren't using the special layout */}
                {extraLabel ?
                    <span className="text-[11px]" style={{ color: theme.text }}>
                        {extraLabel}
                    </span>
                    :
                    !isStable && (
                        <span
                            className="text-xs font-bold"
                            style={{ color: trendColor }}
                        >
                            {sign}{Math.abs(changePercent).toFixed(1)}%
                        </span>
                    )
                }
            </div>

            {/* Bottom Row: Large Value and Sparkline/ExtraValue */}
            <div className="flex justify-between gap-3 items-end">
                <div className="flex justify-between w-full gap-8 items-end">
                    <div>
                        <h3 className={cn(
                            space_grotesk.className,
                            "text-lg font-bold leading-none"
                        )} style={{ color: theme.text }}>
                            {isMounted && value}
                        </h3>
                    </div>

                    {/* Extra Value Display */}
                    {extraValue && (
                        <h3 className={cn(
                            space_grotesk.className,
                            "text-lg font-bold leading-none"
                        )} style={{ color: theme.text }}>
                            {isMounted && extraValue}
                        </h3>
                    )}
                </div>

                {/* Show sparkline only if we aren't showing an extra value column */}
                {
                    !extraValue &&
                    <div className="mb-1">
                        <DashboardMetricSparkline
                            data={trendData}
                            theme={theme}
                            isPositive={isPositive}
                            width={70}
                            height={35}
                        />
                    </div>
                }
            </div>
        </div>
    )
}
