"use client"

import { useState } from "react"
import { DateRange } from "react-day-picker"
import DateFilter from "../custom-utils/TableDataDisplayAreas/filters/DateFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import MetricCardsContainer1 from "../cards/MetricCardsContainer1"
import { USER_PROFILE_METRICS_CONFIG } from "../cards/resources/configs/user-profile-metrics"
import { UserProfileDetailsCard } from "../user-management/UserProfileCard"
import UserNetSpendChart from "../charts/UserNetSpendChart"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { UserProfileTabNFilterOptions } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import UserPurchaseHistoryTable from "../custom-utils/TableDataDisplayAreas/tables/UserPurchaseHistoryTable"

interface IMetricsDataFilter {
    date: DateRange | null,
}

export default function UserProfilePageCW(){

    const [metricsDataFilter, setMetricsDataFilter] =  useState<IMetricsDataFilter>({
        date: null,
    })

    const { filterOptions } = UserProfileTabNFilterOptions;

    return (
        <main className="pb-10">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-4">
                <DateFilter value={metricsDataFilter.date} onChange={(v) => setMetricsDataFilter(prev => ({...prev, date: v}))} />

                <ExportButton1 showFormatSelector />
            </div>
            
            <div>
                <MetricCardsContainer1 metricsFor="user_profile" metrics={USER_PROFILE_METRICS_CONFIG} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[21.8em_1fr] gap-4 gap-y-7 my-10">
                <div className="h-fit">
                    <UserProfileDetailsCard 
                        user={{
                            full_name: "James Cornor",
                            email: "jamescornor@gmail.com",
                            phone: "+2348273727732",
                            profile_img: "",
                            address: "No. 34 St. James Park, New Road",
                            id: "23"
                        }} 
                    />
                </div>
                <div className="min-w-0 space-y-10">
                    <UserNetSpendChart />
                    <div>
                        <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>Purchase History</h3>
                        <DataDisplayTableWrapper 
                            filterOptions={filterOptions}
                        >
                            <UserPurchaseHistoryTable />
                        </DataDisplayTableWrapper>
                    </div>
                </div>
            </div>
        </main>
    )
}