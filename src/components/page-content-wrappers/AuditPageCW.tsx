"use client"

import { useState } from "react"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { AuditTabNFilterOptions } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import DateRangePresetFilter from "@/components/custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"
import { useDataDisplay, TabSlice } from "@/custom-hooks/UseDataDisplay"
import { ADMIN_AUDIT_LOGS_ENDPOINT } from "@/endpoints"
import AdminAuditLogTable from "@/components/custom-utils/TableDataDisplayAreas/tables/financials/AdminAuditLogTable"

interface AuditPageCWProps {
    initialData: TabSlice<AdminAuditLog>
}

import { exportData } from "@/helper-fns/exportData"

export default function AuditPageCW({ initialData }: AuditPageCWProps) {
    const [filters, setFilters] = useState<Partial<FilterValues>>({})

    // The date_range preset is used both as a top-level KPI filter and as a
    // query param in useDataDisplay via buildFilterParams (filters.dateRangePreset → date_range)
    const { tabStates } = useDataDisplay<AdminAuditLog>(
        {
            endpoint: ADMIN_AUDIT_LOGS_ENDPOINT,
            tabs: [
                {
                    key: "audit-logs",
                    initialData,
                    staticParams: {},
                },
            ],
            activeTab: "audit-logs",
            revalidateTarget: "audit",
        },
        filters,
    )

    const state = tabStates["audit-logs"]

    const handleDatePresetChange = (preset: DatePreset | null) => {
        setFilters(prev => ({ ...prev, dateRangePreset: preset ?? undefined }))
    }

    const handleExport = (format: any) => {
        exportData({
            data: (state?.items ?? []) as unknown as Record<string, unknown>[],
            format,
            filename: "audit_logs",
            title: "Audit Logs",
        })
    }

    return (
        <main className="pb-12">

            {/* ── Header controls ───────────────────────────────── */}
            <div className="flex flex-wrap justify-between items-center gap-5 mb-7 mt-10 lg:mt-4">
                <DateRangePresetFilter
                    value={filters.dateRangePreset ?? null}
                    onChange={handleDatePresetChange}
                    icon="solar:calendar-linear"
                    label="Date Range"
                />
                <ExportButton1 showFormatSelector onExport={handleExport} />
            </div>

            {/* ── Table ─────────────────────────────────────────── */}
            <DataDisplayTableWrapper
                filters={filters}
                setFilters={setFilters}
                filterOptions={AuditTabNFilterOptions.filterOptions as any}
                showSearch
                searchPlaceholder="Search by admin, action, IP…"
                currentSearch={state?.search ?? ""}
                onSearch={state?.handleSearch}
                isLoading={state?.isLoading}
            >
                <AdminAuditLogTable
                    items={state?.items ?? []}
                    isLoading={state?.isLoading ?? false}
                    isLoadingMore={state?.isLoadingMore ?? false}
                    hasNext={state?.hasNext ?? false}
                    count={state?.count ?? 0}
                    onLoadMore={state?.loadMore ?? (() => {})}
                    isEmpty={state?.isEmpty ?? false}
                    isError={state?.isError ?? false}
                    search={state?.search ?? ""}
                    currentPage={state?.currentPage ?? 1}
                    totalPages={state?.totalPages ?? 1}
                    fetchPage={state?.fetchPage ?? (() => {})}
                />
            </DataDisplayTableWrapper>
        </main>
    )
}