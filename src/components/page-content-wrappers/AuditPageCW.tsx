"use client"

import { DateRange } from "react-day-picker"
import { AuditTabNFilterOptions } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters";
import { useState } from "react";
import DateFilter from "../custom-utils/TableDataDisplayAreas/filters/DateFilter";
import ExportButton1 from "@/lib/features/export/ExportDataBtn1";
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper";
import AuditLogTable from "../custom-utils/TableDataDisplayAreas/tables/AuditLogTable";

interface IMetricsDataFilter {
    date: DateRange | null,
}

export default function AuditPageCW(){

    const [metricsDataFilter, setMetricsDataFilter] =  useState<IMetricsDataFilter>({
        date: null
    })
    
    const { filterOptions } = AuditTabNFilterOptions;
    const [filters, setFilters] = useState<Partial<FilterValues>>({})

    return(
        <main className="pb-12">
            <div className="flex flex-wrap justify-between items-center gap-5 mb-7 mt-10 lg:mt-4">
                <DateFilter value={metricsDataFilter.date} onChange={(v) => setMetricsDataFilter(prev => ({...prev, date: v}))} />

                <ExportButton1 showFormatSelector />
            </div>

            <DataDisplayTableWrapper 
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions.map(v => v.value === "dateRange" ? {...v, label: "Timestamp" } : v)}
                showSearch={true}
                searchPlaceholder="Search by Owner or Business Name"
            >
                <AuditLogTable />
            </DataDisplayTableWrapper>
        </main>
    )
}