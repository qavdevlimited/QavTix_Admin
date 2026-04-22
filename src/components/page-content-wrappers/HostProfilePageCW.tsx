"use client"

import { Dispatch, SetStateAction, useEffect, useState, useTransition, useRef, useMemo } from "react"
import DateRangePresetFilter from "@/components/custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import MetricCardsContainer1 from "@/components/cards/MetricCardsContainer1"
import MetricsContainerLoader from "@/components/loaders/MetricsContainerLoader"
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import HostEventsTable from "@/components/custom-utils/TableDataDisplayAreas/tables/HostEventsTable"
import { HostProfileCard } from "@/components/host-management/HostProfileCard"
import HostRevenueChart from "@/components/charts/HostRevenueChart"
import { TableDataDisplayFilter, HostProfileTabNFilterOptions } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { ADMIN_HOST_EVENTS_ENDPOINT } from "@/endpoints"
import { getHostEarningsCards } from "@/actions/host-management"
import { mapHostEarningsCardsToMetrics } from "@/helper-fns/mapUserManagementCards"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { forceHostPayout, toggleHostAutoPayout } from "@/actions/host-management"
import { ApiCategory } from "@/actions/filters"
import { deriveCategories } from "@/helper-fns/deriveCategories"

interface HostProfilePageCWProps {
    hostId: string
    initialProfile: HostProfileDetails | null
    initialCards: HostEarningsCards | null
    initialChart: HostChartPoint[]
    initialAllEvents: TabSlice<HostEvent>
    initialActiveEvents: TabSlice<HostEvent>
    initialDraftEvents: TabSlice<HostEvent>
    initialEndedEvents: TabSlice<HostEvent>
    initialCancelledEvents: TabSlice<HostEvent>
    categories: ApiCategory[]
}

export default function HostProfilePageCW({
    hostId,
    initialProfile,
    initialCards,
    initialChart,
    categories,
    initialAllEvents,
    initialActiveEvents,
    initialDraftEvents,
    initialEndedEvents,
    initialCancelledEvents,
}: HostProfilePageCWProps) {

    const dispatch = useAppDispatch()

    const { filterOptions, tabList } = HostProfileTabNFilterOptions

    const [datePreset, setDatePreset] = useState<DatePreset | null>(null)
    const [cards, setCards] = useState<HostEarningsCards | null>(initialCards)
    const [isCardsLoading, startCardsTransition] = useTransition()
    const [activeTab, setActiveTab] = useState<string>("all")
    const [filters, setFilters] = useState<Partial<FilterValues>>({})

    const eventsEndpoint = ADMIN_HOST_EVENTS_ENDPOINT(hostId)
    const { tabStates } = useDataDisplay<HostEvent>(
        {
            endpoint: eventsEndpoint,
            tabs: [
                { key: "all", initialData: initialAllEvents, staticParams: {} },
                { key: "active", initialData: initialActiveEvents, staticParams: { status: "active" } },
                { key: "draft", initialData: initialDraftEvents, staticParams: { status: "draft" } },
                { key: "ended", initialData: initialEndedEvents, staticParams: { status: "ended" } },
                { key: "cancelled", initialData: initialCancelledEvents, staticParams: { status: "cancelled" } },
            ],
            activeTab,
        },
        filters,
    )

    const activeTabState = tabStates[activeTab]

    const availableCategories = useMemo(
        () => deriveCategories(categories, activeTabState?.cachedItems ?? []),
        [categories?.length, activeTabState?.cachedItems]
    )

    const handleDatePresetChange = (preset: DatePreset | null) => {
        setDatePreset(preset)
        startCardsTransition(async () => {
            const { cards: newCards } = await getHostEarningsCards(
                hostId,
                preset ? { date_range: preset } : undefined,
            )
            setCards(newCards)
        })
    }

    const { user } = useAppSelector(store => store.authUser)
    const metrics = mapHostEarningsCardsToMetrics(cards, user?.currency!)


    const handleForcePayout = () => {
        dispatch(openConfirmation({
            actionType: "FORCE_PAYOUT",
            title: "Force Payout",
            description: `Are you sure you want to force a payout for ${initialProfile?.business_name}?`,
            confirmText: "Yes, Force Payout",
        }))
    }

    const { isConfirmed, lastConfirmedAction } = useAppSelector(s => s.confirmation)

    useEffect(() => {
        if (!isConfirmed || lastConfirmedAction !== "FORCE_PAYOUT") return

        const run = async () => {
            const result = await forceHostPayout(hostId)
            dispatch(resetConfirmationStatus())
            if (result.success) {
                dispatch(openSuccessModal({
                    title: "Payout Successful",
                    description: "The payout has been initiated successfully.",
                    variant: "success",
                    autoClose: true,
                }))
                handleDatePresetChange(datePreset)
            } else {
                dispatch(showAlert({
                    title: "Payout Failed",
                    description: result.message || "Could not process payout.",
                    variant: "destructive",
                }))
            }
        }
        run()
    }, [isConfirmed, lastConfirmedAction])

    return (
        <main className="pb-12">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-4">
                <DateRangePresetFilter
                    value={datePreset}
                    onChange={handleDatePresetChange}
                    label="KPI Range"
                    icon="solar:calendar-linear"
                />
                <ExportButton1 showFormatSelector />
            </div>

            <div className="mb-8">
                {isCardsLoading ? (
                    <MetricsContainerLoader />
                ) : (
                    <MetricCardsContainer1 metricsFor="host_profile" metrics={metrics} />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[21.8em_1fr] gap-4 gap-y-7 my-10">
                <div className="h-fit">
                    {initialProfile && (
                        <HostProfileCard
                            profile={initialProfile}
                            onForcePayout={handleForcePayout}
                        />
                    )}
                </div>

                <div className="min-w-0 space-y-5 h-full">
                    <div
                        className={cn(
                            "bg-white min-h-[13%] h-[13%] rounded-lg w-full border border-gray-100 p-5 shadow-[0px_4px_24px_0px_rgba(51,38,174,0.08)]",
                        )}
                    >
                        <h3 className="text-xs font-bold text-brand-secondary-9">Business Description: <span className="font-medium text-brand-secondary-8">{initialProfile?.description}</span></h3>
                    </div>
                    <HostRevenueChart
                        hostId={hostId}
                        initialData={initialChart}
                    />
                </div>
            </div>

            <div>
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>
                    Host Events
                </h3>

                <DataDisplayTableWrapper
                    tabs={tabList}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filters={filters}
                    filterOptions={filterOptions as readonly TableDataDisplayFilter[]}
                    setFilters={setFilters as Dispatch<SetStateAction<Partial<FilterValues>>>}
                    showSearch
                    searchPlaceholder="Search events..."
                    categories={availableCategories}
                    onSearch={activeTabState?.handleSearch}
                    isLoading={activeTabState?.isLoading}
                >
                    <HostEventsTable
                        items={(activeTabState?.items ?? []) as HostEvent[]}
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