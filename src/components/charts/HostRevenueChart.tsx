"use client"

import { useState, useTransition } from "react"
import {
    XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
    BarChart, Bar,
} from "recharts"
import { cn } from "@/lib/utils"
import { getNiceTicks, formatYTick } from "@/helper-fns/chartFormatters"
import ChartLoader from "@/components/loaders/ChartLoader"
import { getHostChart } from "@/actions/host-management"
import { space_grotesk } from "@/lib/fonts"
import TimelineSelector from "@/components/custom-utils/TableDataDisplayAreas/filters/TimelineFilter"
import { useAppSelector } from "@/lib/redux/hooks"
import { formatPrice } from "@/helper-fns/formatPrice"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"

type ChartType = "revenue" | "tickets"

interface HostRevenueChartProps {
    hostId: string | number
    initialData: HostChartPoint[]
    className?: string
}

const CustomTooltip = ({ active, payload, chartType }: any) => {

    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()

    if (!active || !payload?.length) return null
    const value = payload[0].value ?? 0
    return (
        <div className="bg-brand-accent-6 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-semibold">
            {chartType === "revenue" && isMounted ? formatPrice(value, user?.currency, true, true) : `${value.toLocaleString()} tickets`}
        </div>
    )
}

const CURRENT_YEAR = new Date().getFullYear()

const MONTH_LABELS: Record<number, string> = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December",
}

export default function HostRevenueChart({ hostId, initialData, className }: HostRevenueChartProps) {

    const [chartType, setChartType] = useState<ChartType>("revenue")
    const [year, setYear] = useState<number>(CURRENT_YEAR)
    const [month, setMonth] = useState<number | null>(null)
    const [chartData, setChartData] = useState<HostChartPoint[]>(initialData)
    const [isLoading, startTransition] = useTransition()

    const refetch = (type: ChartType, y: number, m: number | null) => {
        startTransition(async () => {
            const params: Record<string, any> = { chart_type: type, year: y }
            if (m) params.month = m
            const { chart } = await getHostChart(hostId, params)
            setChartData(chart)
        })
    }

    const handleTypeChange = (t: ChartType) => {
        setChartType(t)
        refetch(t, year, month)
    }

    const handleYearChange = (y: number) => {
        setYear(y)
        refetch(chartType, y, month)
    }

    const handleMonthChange = (m: number | null) => {
        setMonth(m)
        refetch(chartType, year, m)
    }

    const maxValue = Math.max(...chartData.map(d => d.value), 0)
    const { ticks, yMax } = getNiceTicks(maxValue)

    const barColor = chartType === "revenue" ? "#FF7A00" : "#5E92DF"
    const bgColor = chartType === "revenue" ? "#E5E7EB" : "#DBEAFE"

    const subLabel = month
        ? `${MONTH_LABELS[month]} ${year}`
        : `Full year ${year}`

    return (
        <div className={cn("bg-white rounded-2xl h-[80%] border border-brand-neutral-2 p-6", className)}>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                    <h3 className={cn(space_grotesk.className, "text-sm font-bold text-brand-secondary-8")}>
                        {chartType === "revenue" ? "Revenue Growth" : "Ticket Sales"}
                    </h3>
                    <p className="text-[11px] text-brand-neutral-7 mt-0.5">{subLabel}</p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Chart type toggle */}
                    <div className="flex items-center gap-1 bg-brand-neutral-2 rounded-lg p-1">
                        {(["revenue", "tickets"] as ChartType[]).map(t => (
                            <button
                                key={t}
                                onClick={() => handleTypeChange(t)}
                                className={cn(
                                    "text-[11px] font-medium px-3 py-1.5 rounded-md capitalize transition-all",
                                    chartType === t
                                        ? "bg-brand-primary-6 text-white shadow-sm"
                                        : "text-brand-neutral-7 bg-brand-neutral-3 hover:text-brand-secondary-8",
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Timeline dropdown — replaces the old year + month selects */}
                    <TimelineSelector
                        year={year}
                        month={month}
                        onYearChange={handleYearChange}
                        onMonthChange={handleMonthChange}
                    />
                </div>
            </div>

            {/* Chart */}
            {isLoading ? (
                <ChartLoader />
            ) : !chartData.length ? (
                <div className="flex items-center justify-center h-[300px] text-sm text-brand-secondary-5">
                    No data available
                </div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <div className="min-w-[450px] max-h-full h-[380px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }} barCategoryGap="45%">
                                <CartesianGrid strokeDasharray="4px" vertical={false} stroke="#d4d9e0" strokeWidth={0.5} />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                    tickMargin={12}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                    tickFormatter={chartType === "revenue" ? formatYTick : (v) => v.toLocaleString()}
                                    domain={[0, yMax]}
                                    ticks={ticks}
                                    tickMargin={8}
                                />
                                <Tooltip
                                    content={<CustomTooltip chartType={chartType} />}
                                    cursor={{ fill: "transparent" }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill={barColor}
                                    radius={[5, 5, 2, 2]}
                                    maxBarSize={10}
                                    barSize={9}
                                    isAnimationActive
                                    animationDuration={400}
                                    background={{ fill: bgColor, radius: "20px" }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    )
}