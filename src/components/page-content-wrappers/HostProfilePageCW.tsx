"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { DateRange } from "react-day-picker"
import DateFilter from "../custom-utils/TableDataDisplayAreas/filters/DateFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import MetricCardsContainer1 from "../cards/MetricCardsContainer1"
import UserNetSpendChart from "../charts/UserNetSpendChart"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { HostProfileTabNFilterOptions } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import { hostProfileAnalyticsMetricsConfig, HostProfileMetricKey } from "../cards/resources/configs/host-metrics"
import { buildMetricsFromConfig } from "@/helper-fns/buildMetricsConfig"
import { HostProfileDetailsCard } from "../user-management/HostProfileCard"
import HostAllEventsTable from "../custom-utils/TableDataDisplayAreas/tables/HostAllEventsTable"
import HostProfileChart from "../charts/HostProfileChart"

interface IMetricsDataFilter {
    date: DateRange | null,
}

export default function HostProfilePageCW(){

    const [metricsDataFilter, setMetricsDataFilter] =  useState<IMetricsDataFilter>({
        date: null,
    })

    const { filterOptions, tabList } = HostProfileTabNFilterOptions;
    const [activeTab, setActiveTab] = useState<typeof HostProfileTabNFilterOptions.tabList[number]["value"]>("all-events")
    
    const apiData : Record<HostProfileMetricKey, number>  = {
        'all-time-earnings': 612,
        'current-balance': 547,
        'all-time-payouts': 17,
        'next-payout-date': 5500
    }

    const analyticsMetrics = buildMetricsFromConfig(hostProfileAnalyticsMetricsConfig as Record<HostProfileMetricKey, MetricCardData1>, apiData)
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])


    return (
        <main className="pb-10">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-4">
                <DateFilter value={metricsDataFilter.date} onChange={(v) => setMetricsDataFilter(prev => ({...prev, date: v}))} />

                <ExportButton1 showFormatSelector />
            </div>
            
            <div>
                <MetricCardsContainer1 metricsFor="hosts" metrics={analyticsMetrics} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[21.8em_1fr] gap-4 gap-y-7 my-10">
                <div className="h-fit">
                    <HostProfileDetailsCard host={null} />
                </div>
                <div className="min-w-0 space-y-10">
                    <HostProfileChart />
                </div>
            </div>
            <div>
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>Shola’s Events</h3>
                <DataDisplayTableWrapper 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filterOptions={filterOptions}
                    tabs={tabList}
                >
                    <HostAllEventsTable selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} />
                </DataDisplayTableWrapper>
            </div>
        </main>
    )
}