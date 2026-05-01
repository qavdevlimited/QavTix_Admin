"use client"

import { Dispatch, SetStateAction, useMemo, useState, useTransition } from "react"
import { AdminEventsTabNFilterOptions, TableDataDisplayFilter } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import MetricCardsContainer1 from "@/components/cards/MetricCardsContainer1"
import MetricsContainerLoader from "@/components/loaders/MetricsContainerLoader"
import DateRangePresetFilter from "@/components/custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import AdminEventsTable from "@/components/custom-utils/TableDataDisplayAreas/tables/events-listing/AdminEventsTable"
import { useDataDisplay, TabSlice } from "@/custom-hooks/UseDataDisplay"
import { ADMIN_EVENTS_ENDPOINT } from "@/endpoints"
import { getAdminEventCards } from "@/actions/events/index"
import { getAuthToken } from "@/helper-fns/getAuthToken"
import { mapAdminEventCardsToMetrics } from "@/helper-fns/mapUserManagementCards"
import { deriveCategories } from "@/helper-fns/deriveCategories"
import { ApiCategory } from "@/actions/filters/index"

interface EventsListingPageCWProps {
    initialAllEvents: TabSlice<AdminEvent>
    initialLiveEvents: TabSlice<AdminEvent>
    initialSuspendedEvents: TabSlice<AdminEvent>
    initialEndedEvents: TabSlice<AdminEvent>
    initialCancelledEvents: TabSlice<AdminEvent>
    initialCards: AdminEventCards | null
    categories: ApiCategory[]
}

import { exportData } from "@/helper-fns/exportData"

export default function EventsListingPageCW({
    initialAllEvents,
    initialLiveEvents,
    initialSuspendedEvents,
    initialEndedEvents,
    initialCancelledEvents,
    initialCards,
    categories,
}: EventsListingPageCWProps) {

    const { filterOptions, tabList } = AdminEventsTabNFilterOptions

    const [activeTab, setActiveTab] = useState<typeof AdminEventsTabNFilterOptions.tabList[number]["value"]>("all")
    const [datePreset, setDatePreset] = useState<DatePreset | null>(null)
    const [filters, setFilters] = useState<Partial<FilterValues>>({})
    const [cards, setCards] = useState<AdminEventCards | null>(initialCards)
    const [isCardsLoading, startCardsTransition] = useTransition()

    const { tabStates } = useDataDisplay<AdminEvent>(
        {
            endpoint: ADMIN_EVENTS_ENDPOINT,
            tabs: [
                { key: "all", initialData: initialAllEvents, staticParams: {} },
                { key: "live", initialData: initialLiveEvents, staticParams: { event_state: "live" } },
                { key: "suspended", initialData: initialSuspendedEvents, staticParams: { event_state: "suspended" } },
                { key: "ended", initialData: initialEndedEvents, staticParams: { event_state: "ended" } },
                { key: "cancelled", initialData: initialCancelledEvents, staticParams: { event_state: "cancelled" } },
            ],
            activeTab,
            revalidateTarget: "event-listing"
        },
        filters,
    )

    const activeTabState = tabStates[activeTab]

    const availableCategories = useMemo(
        () => deriveCategories(categories, activeTabState?.cachedItems ?? []),
        [categories?.length, activeTabState?.cachedItems],
    )


    const handleDatePresetChange = (preset: DatePreset | null) => {
        setDatePreset(preset)
        startCardsTransition(async () => {
            const token = await getAuthToken()
            const { cards: newCards } = await getAdminEventCards(
                token,
                preset ? { date_range: preset } : undefined,
            )
            setCards(newCards)
        })
    }
    const metrics = mapAdminEventCardsToMetrics(cards)

    const handleExport = (format: any) => {
        const data = activeTabState?.items ?? []
        exportData({
            data: data as unknown as Record<string, unknown>[],
            format,
            filename: `${activeTab}_events`,
            title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Events`,
        })
    }

    return (
        <main className="pb-10">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-5">
                <DateRangePresetFilter
                    value={datePreset}
                    onChange={handleDatePresetChange}
                    label="KPI Range"
                    icon="solar:calendar-linear"
                />
                <ExportButton1 showFormatSelector onExport={handleExport} />
            </div>

            <div className="mb-8">
                {isCardsLoading ? (
                    <MetricsContainerLoader />
                ) : (
                    <MetricCardsContainer1 metricsFor="events" metrics={metrics} />
                )}
            </div>

            <div className="mt-7">
                <DataDisplayTableWrapper
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filterOptions={filterOptions as readonly TableDataDisplayFilter[]}
                    filters={filters}
                    setFilters={setFilters as Dispatch<SetStateAction<Partial<FilterValues>>>}
                    tabs={tabList}
                    showSearch
                    searchPlaceholder="Search events..."
                    categories={availableCategories}
                    onSearch={activeTabState?.handleSearch}
                    isLoading={activeTabState?.isLoading}
                >
                    <AdminEventsTable
                        items={(activeTabState?.items ?? []) as AdminEvent[]}
                        isLoading={activeTabState?.isLoading ?? false}
                        isLoadingMore={activeTabState?.isLoadingMore ?? false}
                        hasNext={activeTabState?.hasNext ?? false}
                        count={activeTabState?.count ?? 0}
                        activeTab={activeTab}
                        onLoadMore={activeTabState?.loadMore ?? (() => { })}
                        isEmpty={activeTabState?.isEmpty ?? false}
                        isError={activeTabState?.isError ?? false}
                        search={activeTabState?.search ?? ""}
                        currentPage={activeTabState?.currentPage ?? 1}
                        totalPages={activeTabState?.totalPages ?? 1}
                        fetchPage={activeTabState?.fetchPage ?? (() => { })}
                        onRefresh={activeTabState?.refresh}
                    />
                </DataDisplayTableWrapper>
            </div>
        </main>
    )
}