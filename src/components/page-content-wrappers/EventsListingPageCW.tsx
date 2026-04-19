"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";
import { EventsListingTabNFilterOptions } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters";
import { eventsListingAnalyticsMetricsConfig, EventsListingMetrics } from "../cards/resources/configs/events-listing-metrics";
import { buildMetricsFromConfig } from "@/helper-fns/buildMetricsConfig";
import DateFilter from "../custom-utils/TableDataDisplayAreas/filters/DateFilter";
import ExportButton1 from "@/lib/features/export/ExportDataBtn1";
import MetricCardsContainer1 from "../cards/MetricCardsContainer1";
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper";
import AllEventsTable from "../custom-utils/TableDataDisplayAreas/tables/events-listing/AllEventsTable";
import LiveEventsTable from "../custom-utils/TableDataDisplayAreas/tables/events-listing/LiveEvents";
import SuspendedEventsTable from "../custom-utils/TableDataDisplayAreas/tables/events-listing/SuspendedEventsTable";
import EndedEventsTable from "../custom-utils/TableDataDisplayAreas/tables/events-listing/EndedEventsTable";


interface IMetricsDataFilter {
    date: DateRange | null,
}

export default function EventsListingPageCW(){

    const [metricsDataFilter, setMetricsDataFilter] =  useState<IMetricsDataFilter>({
        date: null,
    })

    const { filterOptions, tabList } = EventsListingTabNFilterOptions;
    const [activeTab, setActiveTab] = useState<typeof EventsListingTabNFilterOptions.tabList[number]["value"]>("all-events")
    
    const apiData : Record<EventsListingMetrics, number>  = {
        'live': 612,
        'suspended': 547,
        'ended': 17,
        'sold-out': 5500
    }

    const analyticsMetrics = buildMetricsFromConfig(eventsListingAnalyticsMetricsConfig, apiData)

    return (
        <main className="pb-10">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-5">
                <DateFilter value={metricsDataFilter.date} onChange={(v) => setMetricsDataFilter(prev => ({...prev, date: v}))} />

                <ExportButton1 showFormatSelector />
            </div>
            
            <div>
                <MetricCardsContainer1 metricsFor="events" metrics={analyticsMetrics} />
            </div>

            <div className="mt-7">
                <DataDisplayTableWrapper 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filterOptions={filterOptions}
                    tabs={tabList}
                >
                    {
                        activeTab === "all-events" ?
                        <AllEventsTable /> 
                        :
                        activeTab === "live-events" ?
                        <LiveEventsTable />
                        :
                        activeTab === "suspended-events" ?
                        <SuspendedEventsTable />
                        :
                        activeTab === "ended-events" ?
                        <EndedEventsTable />
                        :
                        null
                    }
                </DataDisplayTableWrapper>
            </div>
        </main>
    )
}