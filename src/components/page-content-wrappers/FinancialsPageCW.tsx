"use client"

import MetricCardsContainer1 from "@/components/cards/MetricCardsContainer1";
import { hostAnalyticsMetricsConfig, HostMetricKey } from "@/components/cards/resources/configs/host-metrics";
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper";
import DateFilter from "@/components/custom-utils/TableDataDisplayAreas/filters/DateFilter";
import { financialsFilterOptions, financialsFilterOptionsForResaleOrders, FinancialsTabNFilterOptions, HostManagementTabNFilterOptions } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters";
import BusinessManagementTable from "@/components/custom-utils/TableDataDisplayAreas/tables/BusinessManagementTable";
import { buildMetricsFromConfig } from "@/helper-fns/buildMetricsConfig";
import ExportButton1 from "@/lib/features/export/ExportDataBtn1";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";
import HostSignupRequestsTable from "../custom-utils/TableDataDisplayAreas/tables/PendingVerificationTable";
import { FinancialMetricKey, financialMetricsConfig } from "../cards/resources/configs/financials-metrics";
import PendingPayoutsTable from "../custom-utils/TableDataDisplayAreas/tables/financials/PendingPayoutTable";
import PayoutHistoryTable from "../custom-utils/TableDataDisplayAreas/tables/financials/PayoutHistoryTable";
import ListedForSaleTable from "../custom-utils/TableDataDisplayAreas/tables/financials/ListedForSaleTable";
import ResoldTicketsTable from "../custom-utils/TableDataDisplayAreas/tables/financials/ResoldTicketsTable";
import CategoryFilter from "../custom-utils/TableDataDisplayAreas/filters/CategoryFilter";
import { EventTypeFilter } from "../custom-utils/TableDataDisplayAreas/filters/EventTypeFilter";

interface IMetricsDataFilter {
    date: DateRange | null,
    categories: string[],
    eventType: string[]
}

export default function FinancialsPageCW(){


    const { tabList } = FinancialsTabNFilterOptions;
    const [activeTab, setActiveTab] = useState<typeof FinancialsTabNFilterOptions.tabList[number]["value"]>("pending-payout")
    const [metricsDataFilter, setMetricsDataFilter] =  useState<IMetricsDataFilter>({
        date: null,
        categories: [],
        eventType: []
    })

    const filterOptions = activeTab !== "resale-orders" ? financialsFilterOptions : financialsFilterOptionsForResaleOrders

    const [filters, setFilters] = useState<Partial<FilterValues>>({
        listingType: "listed-for-sale"
    })

    const apiData : Record<FinancialMetricKey, number>  = {
        'total-sales-gmv': 612,
        'platform-fees': 547,
        'affiliate-balance': 17,
        'payouts-pending': 5500
    }

    const [selectedPayouts, setSelectedPayouts] = useState<string[]>([])

    const analyticsMetrics = buildMetricsFromConfig(financialMetricsConfig, apiData)

    return (
        <main className="pb-12">
            <div className="flex flex-wrap justify-between items-center gap-5 mb-5 mt-10 lg:mt-4">
                <div className="flex flex-wrap items-center gap-3">
                    <DateFilter value={metricsDataFilter.date} onChange={(v) => setMetricsDataFilter(prev => ({...prev, date: v}))} />
                    <CategoryFilter onChange={(v) => setMetricsDataFilter(prev => ({ ...prev, categories: v }))} />
                    <EventTypeFilter onChange={(v) => setMetricsDataFilter(prev => ({ ...prev, eventType: v }))} />
                </div>

                <ExportButton1 showFormatSelector />
            </div>

            <div className="mb-8">
                <MetricCardsContainer1 metricsFor="hosts" metrics={analyticsMetrics} />
            </div>

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
                    activeTab === "pending-payout" ?
                    <PendingPayoutsTable selectedPayouts={selectedPayouts} setSelectedPayouts={setSelectedPayouts}  />
                    :
                    activeTab === "payout-history" ?
                    <PayoutHistoryTable />
                    :
                    activeTab === "resale-orders" ?
                    (
                        filters.listingType === 'already-resold' ?
                        <ResoldTicketsTable />
                        :
                        <ListedForSaleTable />
                    )
                    :
                    null
                }
            </DataDisplayTableWrapper>
        </main>
    )
}