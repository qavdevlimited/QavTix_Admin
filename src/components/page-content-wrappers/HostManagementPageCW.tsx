"use client"

import MetricCardsContainer1 from "@/components/cards/MetricCardsContainer1";
import { hostAnalyticsMetricsConfig, HostMetricKey } from "@/components/cards/resources/configs/host-metrics";
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper";
import DateFilter from "@/components/custom-utils/TableDataDisplayAreas/filters/DateFilter";
import { HostManagementTabNFilterOptions } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters";
import BusinessManagementTable from "@/components/custom-utils/TableDataDisplayAreas/tables/BusinessManagementTable";
import { buildMetricsFromConfig } from "@/helper-fns/buildMetricsConfig";
import ExportButton1 from "@/lib/features/export/ExportDataBtn1";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";
import HostSignupRequestsTable from "../custom-utils/TableDataDisplayAreas/tables/PendingVerificationTable";

interface IMetricsDataFilter {
    date: DateRange | null,
}

export default function HostmanagementPageCW(){


    const { filterOptions, tabList } = HostManagementTabNFilterOptions;
    const [activeTab, setActiveTab] = useState<typeof HostManagementTabNFilterOptions.tabList[number]["value"]>("all-hosts")
    const [metricsDataFilter, setMetricsDataFilter] =  useState<IMetricsDataFilter>({
        date: null,
    })

    const [filters, setFilters] = useState<Partial<FilterValues>>({})

    const apiData : Record<HostMetricKey, number>  = {
        'ticket-hosts': 612,
        'new-this-month': 547,
        'tickets-sold': 17,
        'commision-paid': 5500
    }

    const analyticsMetrics = buildMetricsFromConfig(hostAnalyticsMetricsConfig, apiData)

    return (
        <main className="pb-12">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-4">
                <DateFilter value={metricsDataFilter.date} onChange={(v) => setMetricsDataFilter(prev => ({...prev, date: v}))} />

                <ExportButton1 showFormatSelector />
            </div>

            <div>
                <MetricCardsContainer1 metricsFor="hosts" metrics={analyticsMetrics} />
            </div>

            <section className="mt-10">
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>Hosts</h3>
                <DataDisplayTableWrapper 
                    filters={filters}
                    setFilters={setFilters}
                    tabs={tabList}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filterOptions={filterOptions}
                    showSearch={true}
                    searchPlaceholder="Search by Owner or Business Name"
                >
                    {
                        activeTab === "all-hosts" ?
                        <BusinessManagementTable  />
                        :
                        <HostSignupRequestsTable />
                    }
                </DataDisplayTableWrapper>
            </section>
        </main>
    )
}