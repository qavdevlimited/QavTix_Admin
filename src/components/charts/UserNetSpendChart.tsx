"use client"

import {
    XAxis, YAxis,
    CartesianGrid, ResponsiveContainer, Tooltip,
    BarChart,
    Bar,
} from "recharts"
import { cn } from "@/lib/utils"
import { getNiceTicks, formatYTick } from "@/helper-fns/chartFormatters"
import ChartLoader from "../loaders/ChartLoader"
import { useAppSelector } from "@/lib/redux/hooks"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { formatPrice } from "@/helper-fns/formatPrice"

interface ChartPoint {
    label: string
    value: number
}

const toPoints = (data: { label: string, amount: string | number }[]): ChartPoint[] => {
    if (!Array.isArray(data) || !data.length) return []
    return data.map(d => ({
        label: d.label,
        value: typeof d.amount === 'string' ? parseFloat(d.amount) : d.amount
    }))
}

const CustomTooltip = ({ active, payload }: any) => {
    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()

    if (!active || !payload?.length) return null
    return (
        <div className="bg-brand-accent-6 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-semibold">
            {isMounted ? formatPrice(payload[0].value ?? 0, user?.currency, true, true) : ""}
        </div>
    )
}

interface UserNetSpendChartProps {
    data: { label: string, amount: string | number }[]
    isLoading?: boolean
    className?: string
}

export default function UserNetSpendChart({ data, isLoading, className }: UserNetSpendChartProps) {

    const chartData = toPoints(data)

    if (!isLoading && !chartData.length) {
        return (
            <div className={cn("bg-white rounded-2xl border border-brand-neutral-2 p-6", className)}>
                <h3 className="text-xs font-medium text-brand-secondary-5 mb-8">Net Spend Chart</h3>
                <div className="flex items-center justify-center h-[300px] text-sm text-brand-secondary-5">
                    No spend data available
                </div>
            </div>
        )
    }

    const maxValue = Math.max(...chartData.map(d => d.value), 0)
    const { ticks, yMax } = getNiceTicks(maxValue)

    return (
        <div className={cn("bg-white rounded-2xl border border-brand-neutral-2 p-6", className)}>
            <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xs font-medium text-brand-secondary-5">Net Spend Chart</h3>
            </div>

            {isLoading ? (
                <ChartLoader />
            ) : (
                <div className="w-full overflow-x-auto">
                    <div className="min-w-150 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                                barCategoryGap="45%"
                            >
                                <CartesianGrid
                                    strokeDasharray="4px"
                                    vertical={false}
                                    stroke="#d4d9e0"
                                    strokeWidth={0.5}
                                />
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
                                    tickFormatter={formatYTick}
                                    domain={[0, yMax]}
                                    ticks={ticks}
                                    tickMargin={8}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: "transparent" }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#FF7A00"
                                    radius={[5, 5, 2, 2]}
                                    maxBarSize={10}
                                    barSize={9}
                                    isAnimationActive
                                    animationDuration={400}
                                    background={{ fill: "#E5E7EB", radius: "20px" }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    )
}