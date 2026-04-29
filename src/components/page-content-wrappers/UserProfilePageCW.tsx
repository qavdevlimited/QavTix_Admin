"use client"

import { Dispatch, SetStateAction, useState, useTransition } from "react"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import MetricCardsContainer1 from "../cards/MetricCardsContainer1"
import { UserProfileDetailsCard } from "../user-management/UserProfileCard"
import UserNetSpendChart from "../charts/UserNetSpendChart"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { TableDataDisplayFilter, UserProfileTabNFilterOptions } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import UserPurchaseHistoryTable from "../custom-utils/TableDataDisplayAreas/tables/UserPurchaseHistoryTable"
import { getAdminUserCardsClient as getAdminUserCards, getAdminUserChartClient as getAdminUserChart } from "@/actions/user-management/client"
import { mapUserProfileCards } from "@/helper-fns/mapUserManagementCards"
import MetricsContainerLoader from "../loaders/MetricsContainerLoader"
import DateRangePresetFilter from "../custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { ADMIN_USER_PURCHASE_HISTORY_ENDPOINT } from "@/endpoints"
import { useAppSelector } from "@/lib/redux/hooks"

interface UserProfilePageCWProps {
    userId: string
    initialProfile: UserProfileDetails | null
    initialCards: UserKPICards | null
    initialChart: UserChartDataPoint[]
    initialOrders: TabSlice<UserPurchaseOrder>
}

import { exportData } from "@/helper-fns/exportData"

export default function UserProfilePageCW({
    userId,
    initialProfile,
    initialCards,
    initialChart,
    initialOrders,
}: UserProfilePageCWProps) {

    // KPI date preset — affects cards + chart only, NOT the table
    const [datePreset, setDatePreset] = useState<DatePreset | null>(null)
    const [cards, setCards] = useState<UserKPICards | null>(initialCards)
    const [chartData, setChartData] = useState<UserChartDataPoint[]>(initialChart)
    const [isCardsLoading, startCardsTransition] = useTransition()
    const [isChartLoading, startChartTransition] = useTransition()

    // Table filters — separate from KPI filter
    const { filterOptions } = UserProfileTabNFilterOptions
    const [filters, setFilters] = useState<Partial<FilterValues>>({
        purchaseDateRange: undefined,
        amountRange: null,
        quantityRange: null,
    })

    // useDataDisplay for purchase history table
    const endpoint = ADMIN_USER_PURCHASE_HISTORY_ENDPOINT(userId)

    const { activeTabState } = useDataDisplay<UserPurchaseOrder>(
        {
            endpoint,
            tabs: [{
                key: "orders",
                initialData: initialOrders,
                staticParams: {},
            }],
            activeTab: "orders",
        },
        filters,
    )

    // KPI refetch handler — only cards + chart, not table
    const handleDatePresetChange = (preset: DatePreset | null) => {
        setDatePreset(preset)

        startCardsTransition(async () => {
            const { cards: newCards } = await getAdminUserCards(userId, preset ?? undefined)
            setCards(newCards)
        })

        startChartTransition(async () => {
            const { chart: newChart } = await getAdminUserChart(userId, preset ?? undefined)
            setChartData(newChart)
        })
    }

    const { user } = useAppSelector(store => store.authUser)
    const metrics = mapUserProfileCards(cards, user?.currency!)

    const handleExport = (format: any) => {
        exportData({
            data: activeTabState.items as unknown as Record<string, unknown>[],
            format,
            filename: `user_${userId}_purchase_history`,
            title: "Purchase History",
        })
    }

    return (
        <main className="pb-10">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-4">
                <DateRangePresetFilter
                    value={datePreset}
                    onChange={handleDatePresetChange}
                    label="KPI Range"
                    icon="solar:calendar-linear"
                />
                <ExportButton1 showFormatSelector onExport={handleExport} />
            </div>

            <div>
                {isCardsLoading ? (
                    <MetricsContainerLoader />
                ) : (
                    <MetricCardsContainer1 metricsFor="user_profile" metrics={metrics} />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[21.8em_1fr] gap-4 gap-y-7 my-10">
                <div className="h-fit">
                    {initialProfile && <UserProfileDetailsCard profile={initialProfile} />}
                </div>

                <div className="min-w-0 space-y-10">
                    <UserNetSpendChart data={chartData} isLoading={isChartLoading} />

                    <div>
                        <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>
                            Purchase History
                        </h3>
                        <DataDisplayTableWrapper
                            filters={filters}
                            filterOptions={filterOptions as readonly TableDataDisplayFilter[]}
                            setFilters={setFilters as Dispatch<SetStateAction<Partial<FilterValues>>>}
                            showSearch
                            searchPlaceholder="Search by event name..."
                            onSearch={activeTabState.handleSearch}
                            isLoading={activeTabState.isLoading}
                        >
                            <UserPurchaseHistoryTable
                                items={activeTabState.items}
                                isLoading={activeTabState.isLoading}
                                isLoadingMore={activeTabState.isLoadingMore}
                                hasNext={activeTabState.hasNext}
                                count={activeTabState.count}
                                onLoadMore={activeTabState.loadMore}
                                isEmpty={activeTabState.isEmpty}
                                isError={activeTabState.isError}
                                search={activeTabState.search}
                                currentPage={activeTabState.currentPage}
                                totalPages={activeTabState.totalPages}
                                fetchPage={activeTabState.fetchPage}
                            />
                        </DataDisplayTableWrapper>
                    </div>
                </div>
            </div>
        </main>
    )
}