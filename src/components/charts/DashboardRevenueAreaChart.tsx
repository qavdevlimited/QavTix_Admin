"use client"

import { useState, useEffect, useTransition } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, Tooltip, ReferenceLine,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAdminRevenueAnalytics } from '@/actions/dashboard/index';
import { getAuthToken } from '@/helper-fns/getAuthToken';
import { formatPrice } from '@/helper-fns/formatPrice';
import { useAppSelector } from '@/lib/redux/hooks';
import { useIsMounted } from '@/custom-hooks/UseIsMounted';

interface ChartDataPoint {
    label: string;
    value: number;
    fullDate?: string;
}

type TimeFilter = 'week' | 'month' | 'annual';

const PERIOD_MAP: Record<TimeFilter, string> = {
    week: 'week',
    month: 'month',
    annual: 'year',
}

interface DashboardRevenueAreaChartProps {
    initialData?: AdminRevenueData;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const point = payload[0].payload as ChartDataPoint
    return (
        <div className="bg-brand-primary-6 text-white px-4 py-3 rounded-xl shadow-xl">
            <p className="text-xs mb-1 text-blue-200">
                {point.fullDate ?? point.label}
            </p>
            <p className="text-sm font-bold">
                {formatPrice(payload[0].value)}
            </p>
        </div>
    )
}

function computeYAxis(data: ChartDataPoint[]) {
    const maxValue = Math.max(...data.map(d => d.value), 0)

    if (maxValue === 0) {
        return { niceMax: 500000, yTicks: [0, 100000, 200000, 300000, 400000, 500000] }
    }

    const niceMax = Math.ceil(maxValue * 1.2 / 50000) * 50000
    const tickCount = 6
    const step = niceMax / (tickCount - 1)
    const yTicks = Array.from({ length: tickCount }, (_, i) => Math.round(i * step))

    return { niceMax, yTicks }
}

export default function DashboardRevenueAreaChart({ initialData }: DashboardRevenueAreaChartProps) {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('month')
    const [chartData, setChartData] = useState<ChartDataPoint[]>(initialData?.data || [])
    const [activeLabel, setActiveLabel] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()

    useEffect(() => {
        // Always fetch when filter changes — don't try to match against initialData.period
        // since the API returns "year" but our state uses "annual"
        startTransition(async () => {
            const token = await getAuthToken()
            const result = await getAdminRevenueAnalytics(token, timeFilter)
            if (result.success && result.data) {
                setChartData(result.data.data)
            }
        })
    }, [timeFilter])

    const { niceMax, yTicks } = computeYAxis(chartData)

    return (
        <div className="w-full bg-white rounded-[24px] p-8 shadow-sm border border-brand-neutral-2">
            <div className="flex items-center gap-5 mb-10">
                <h2 className="text-xs text-brand-secondary-5">Revenue Growth Chart</h2>

                <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
                    <SelectTrigger className="w-fit h-10 border-[1.4px] border-brand-neutral-5 text-xs font-bold text-brand-secondary-9 rounded-md focus:ring-0! focus:border-[1.4px] focus:border-brand-primary-5!">
                        <SelectValue placeholder="This Month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week" className="text-xs">This Week</SelectItem>
                        <SelectItem value="month" className="text-xs">This Month</SelectItem>
                        <SelectItem value="year" className="text-xs">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className={`w-full h-100 transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                        onMouseMove={(e: any) => {
                            if (e.activeLabel) setActiveLabel(e.activeLabel)
                        }}
                        onMouseLeave={() => setActiveLabel(null)}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0052FF" stopOpacity={0.12} />
                                <stop offset="95%" stopColor="#0052FF" stopOpacity={0.01} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid horizontal vertical={false} stroke="#F1F5F9" strokeWidth={1} />

                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                            tickMargin={16}
                            interval="preserveStartEnd"
                        />

                        <YAxis
                            orientation="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                            tickFormatter={(v) => isMounted ? formatPrice(v, user?.currency, true, true) : ""}
                            ticks={yTicks}
                            domain={[0, niceMax]}
                            width={60}
                        />

                        {activeLabel && (
                            <ReferenceLine x={activeLabel} stroke="#94A3B8" strokeDasharray="4 4" />
                        )}

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }}
                            isAnimationActive={false}
                        />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#0052CC"
                            strokeWidth={2}
                            fill="url(#colorRevenue)"
                            activeDot={{ r: 6, fill: "#0052CC", stroke: "#fff", strokeWidth: 3 }}
                            animationDuration={800}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}