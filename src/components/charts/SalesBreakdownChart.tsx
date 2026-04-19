"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const CHART_COLORS = ['#00388D', '#2F70D9', '#FF914D', '#10B981', '#F43F5E', '#8B5CF6']

interface SalesBreakdownChartProps {
	ticketAnalytics?: AdminTicketAnalyticsData;
}

const CustomTooltip = ({ active, payload }: any) => {
	if (!active || !payload?.length) return null
	const data = payload[0].payload
	return (
		<div className="relative bg-[#001D4A] text-white px-4 py-3 rounded-xl shadow-xl">
			<p className="text-sm font-semibold mb-0.5">{data.name}</p>
			{data.subtitle && (
				<p className="text-xs text-blue-300 mb-1">{data.subtitle}</p>
			)}
			<p className="text-sm font-bold">{data.value.toLocaleString()} Purchases</p>
			{/* Arrow */}
			<div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#001D4A] rotate-45 rounded-sm" />
		</div>
	)
}

const filterTypes = [
	{ name: "This Week", value: "this_week" },
	{ name: "This Month", value: "this_month" },
	{ name: "This Year", value: "this_year" },
]

export default function SalesBreakdownChart({ ticketAnalytics }: SalesBreakdownChartProps) {
	const [filterValue, setFilterValue] = useState<string>("this_month")

	const dataConfig = ticketAnalytics?.overall?.map((item, index) => ({
		name: item.ticket_type,
		value: item.count,
		percentage: Math.round(item.percentage),
		color: CHART_COLORS[index % CHART_COLORS.length],
	})) || [
			{ name: 'No Data', value: 100, percentage: 100, color: '#E5E7EB' }
		]

	return (
		<div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-[0px_5.8px_23.17px_0px_#3326AE14] border border-neutral-100">

			{/* Header */}
			<div className="mb-4 flex justify-between items-start gap-6">
				<div>
					<h2 className="text-sm font-bold text-brand-secondary-9">Sales Breakdown</h2>
					<p className="text-xs text-brand-secondary-5 mt-0.5">Sales by Ticket Type</p>
				</div>
				<Select value={filterValue} onValueChange={setFilterValue}>
					<SelectTrigger className={cn(
						"border border-brand-neutral-4 font-medium text-xs w-fit bg-white rounded-lg",
						"hover:border-brand-neutral-5 focus:border-brand-primary-6 focus:ring-0"
					)}>
						<SelectValue placeholder="Filter" />
					</SelectTrigger>
					<SelectContent>
						{filterTypes.map((v) => (
							<SelectItem key={v.value} value={v.value} className="text-xs">
								{v.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Donut chart */}
			<div className="h-52 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Tooltip
							content={<CustomTooltip />}
							isAnimationActive={false}
						/>
						<Pie
							data={dataConfig}
							cx="50%"
							cy="50%"
							innerRadius={65}
							outerRadius={95}
							paddingAngle={3}
							dataKey="value"
							stroke="none"
							animationBegin={0}
							animationDuration={800}
						>
							{dataConfig.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.color}
								/>
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
			</div>

			<div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4">
				{dataConfig.map((item) => (
					<div key={item.name} className="flex flex-col items-center gap-1">
						<div className="flex items-center gap-1.5">
							<div
								className="size-2.5 rounded-full shrink-0"
								style={{ backgroundColor: item.color }}
							/>
							<span className="text-xs text-slate-500">{item.name}</span>
						</div>
						<span className="text-sm font-bold text-slate-700">{item.percentage}%</span>
					</div>
				))}
			</div>
		</div>
	)
}