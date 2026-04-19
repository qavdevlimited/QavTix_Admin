import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface RevenueDataPoint {
    day: string
    value: number
}

const mockRevenueData: RevenueDataPoint[] = [
    { day: '12', value: 27000 },
    { day: '13', value: 20000 },
    { day: '14', value: 40000 },
    { day: '15', value: 32000 },
    { day: '16', value: 37000 },
    { day: '17', value: 28000 },
    { day: '18', value: 42000 }
]

const timeFilters = [
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' }
]

interface RevenueChartProps {
    className?: string
}

export function UserRevenueChart({ className }: RevenueChartProps) {
    const [timeFilter, setTimeFilter] = useState('this-week')

    const customTooltip = (props: any) => {
        const { active, payload } = props
        if (active && payload && payload.length > 0) {
            const value = payload[0].value
            return (
                <div className="bg-brand-accent-6 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-semibold">
                    ₦{(value / 1000).toFixed(1)}k
                </div>
            )
        }
        return null
    }

    return (
        <div className={cn('bg-white rounded-2xl border border-brand-neutral-2 p-6', className)}>
            <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xs font-medium text-brand-secondary-5">Revenue Chart</h3>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-fit font-medium h-9 text-xs border-brand-neutral-3 text-brand-secondary-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {timeFilters.map((filter) => (
                            <SelectItem key={filter.value} value={filter.value} className="text-xs">
                                {filter.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full overflow-x-auto">
                <div className="min-w-150 h-100">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={mockRevenueData}
                            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                        >
                            <CartesianGrid 
                                strokeDasharray="0" 
                                vertical={false}
                                stroke="#F3F4F6"
                                strokeWidth={1}
                            />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                tickMargin={12}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}K`}
                                domain={[0, 50000]}
                                ticks={[0, 10000, 20000, 30000, 40000, 50000]}
                                tickMargin={8}
                            />
                            <Tooltip content={customTooltip} cursor={{ stroke: '#FF7A00', strokeWidth: 1 }} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#FF7A00"
                                strokeWidth={3}
                                dot={{ fill: '#FF7A00', r: 5 }}
                                activeDot={{ r: 7, fill: '#FF7A00', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}