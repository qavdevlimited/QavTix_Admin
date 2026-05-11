"use client"

import { Dispatch, SetStateAction, useState, useTransition, useCallback, useEffect } from "react"
import MetricCardsContainer1 from "@/components/cards/MetricCardsContainer1"
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { FinancialsTabNFilterOptions } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import DateRangePresetFilter from "@/components/custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import { useDataDisplay, TabSlice } from "@/custom-hooks/UseDataDisplay"
import {
    ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT,
    ADMIN_FINANCIALS_APPROVED_PAYOUTS_ENDPOINT,
    ADMIN_FINANCIALS_MARKETPLACE_ENDPOINT,
    ADMIN_FINANCIALS_FEATURED_PAYMENTS_ENDPOINT,
    ADMIN_FINANCIALS_SUBSCRIPTIONS_ENDPOINT,
} from "@/endpoints"
import FinancialsBulkActionsBar from "@/components/custom-utils/dropdown/FinancialsBulkActionsBar"
import { exportData } from "@/helper-fns/exportData"
import {
    mapAdminFinancialCardsToMetrics,
    mapAdminResaleCardsToMetrics,
} from "@/helper-fns/mapUserManagementCards"
import { getAdminFinancialCards, getAdminResaleCards } from "@/actions/financials/index"
import { getAuthToken } from "@/helper-fns/getAuthToken"
import AdminPendingPayoutsTable from "@/components/custom-utils/TableDataDisplayAreas/tables/financials/AdminPendingPayoutsTable"
import AdminPayoutHistoryTable from "@/components/custom-utils/TableDataDisplayAreas/tables/financials/AdminPayoutHistoryTable"
import AdminMarketplaceTable from "@/components/custom-utils/TableDataDisplayAreas/tables/financials/AdminMarketplaceTable"
import AdminFeaturedPaymentsTable from "@/components/custom-utils/TableDataDisplayAreas/tables/financials/AdminFeaturedPaymentsTable"
import AdminSubscriptionsTable from "@/components/custom-utils/TableDataDisplayAreas/tables/financials/AdminSubscriptionsTable"
import MetricsContainerLoader from "../loaders/MetricsContainerLoader"
import { EventFilter } from "../custom-utils/TableDataDisplayAreas/filters/EventFilter"
import { useAppSelector } from "@/lib/redux/hooks"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
interface FinancialsPageCWProps {
    initialPendingPayouts: TabSlice<AdminPayout>
    initialApprovedPayouts: TabSlice<AdminPayout>
    initialMarketplace: TabSlice<AdminMarketplaceListing>
    initialFeaturedPayments: TabSlice<AdminFeaturedPayment>
    initialSubscriptions: TabSlice<AdminSubscription>
    initialCards: AdminFinancialCards | null
    initialResaleCards: AdminResaleCards | null
}

type FinancialsTab = typeof FinancialsTabNFilterOptions.tabList[number]["value"]

export default function FinancialsPageCW({
    initialPendingPayouts,
    initialApprovedPayouts,
    initialMarketplace,
    initialFeaturedPayments,
    initialSubscriptions,
    initialCards,
    initialResaleCards,
}: FinancialsPageCWProps) {

    const { tabList } = FinancialsTabNFilterOptions

    const [activeTab, setActiveTab] = useState<FinancialsTab>("pending-payout")
    const [filters, setFilters] = useState<Partial<FilterValues>>({})
    const [cards, setCards] = useState<AdminFinancialCards | null>(initialCards)
    const [resaleCards, setResaleCards] = useState<AdminResaleCards | null>(initialResaleCards)
    const [isCardsLoading, startCardsTransition] = useTransition()

    // Bulk selection — reset on tab change
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    useEffect(() => { setSelectedItems([]) }, [activeTab])

    const isMounted = useIsMounted()
    const currency = useAppSelector(s => s.authUser.user?.currency)

    const isResaleTab = activeTab === "resale-orders"
    const kpiMetrics = isResaleTab
        ? mapAdminResaleCardsToMetrics(resaleCards, currency)
        : mapAdminFinancialCardsToMetrics(cards, currency)

    const { tabStates } = useDataDisplay<any>(
        {
            endpoint: ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT, // fallback; each tab overrides
            tabs: [
                {
                    key: "pending-payout",
                    endpoint: ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT,
                    initialData: initialPendingPayouts,
                    staticParams: {},
                },
                {
                    key: "payout-history",
                    endpoint: ADMIN_FINANCIALS_APPROVED_PAYOUTS_ENDPOINT,
                    initialData: initialApprovedPayouts,
                    staticParams: {},
                },
                {
                    key: "resale-orders",
                    endpoint: ADMIN_FINANCIALS_MARKETPLACE_ENDPOINT,
                    initialData: initialMarketplace,
                    staticParams: {},
                },
                {
                    key: "featured-payments",
                    endpoint: ADMIN_FINANCIALS_FEATURED_PAYMENTS_ENDPOINT,
                    initialData: initialFeaturedPayments,
                    staticParams: {},
                },
                {
                    key: "subscriptions",
                    endpoint: ADMIN_FINANCIALS_SUBSCRIPTIONS_ENDPOINT,
                    initialData: initialSubscriptions,
                    staticParams: {},
                },
            ],
            activeTab,
            revalidateTarget: "financials",
        },
        filters,
    )

    const activeTabState = tabStates[activeTab]

    // Tab count badges — use cached count from each tab's loaded state
    const tabCounts: Record<string, number> = {
        "pending-payout":    tabStates["pending-payout"]?.count    ?? 0,
        "payout-history":    tabStates["payout-history"]?.count    ?? 0,
        "resale-orders":     tabStates["resale-orders"]?.count     ?? 0,
        "featured-payments": tabStates["featured-payments"]?.count ?? 0,
        "subscriptions":     tabStates["subscriptions"]?.count     ?? 0,
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab as FinancialsTab)
        setFilters({})
        setSelectedItems([]) // Clear selection on tab change

        if (tab === "resale-orders" && !resaleCards) {
            startCardsTransition(async () => {
                const token = await getAuthToken()
                const { cards: rc } = await getAdminResaleCards(token)
                setResaleCards(rc)
            })
        }
    }

    const handleDatePresetChange = (preset: DatePreset | null) => {
        setFilters(prev => ({ ...prev, dateRangePreset: preset }))
        startCardsTransition(async () => {
            const token = await getAuthToken()
            const { cards: freshCards } = await getAdminFinancialCards(
                token,
                preset ? { date_range: preset } : undefined,
            )
            setCards(freshCards)
        })
    }

    const handleEventChange = (event: string | null) => {
        setFilters(prev => ({ ...prev, event }))
        startCardsTransition(async () => {
            const token = await getAuthToken()
            const { cards: freshCards } = await getAdminFinancialCards(
                token,
                event ? { event_id: event } : undefined,
            )
            setCards(freshCards)
        })
    }

    const currentFilterOptions =
        FinancialsTabNFilterOptions.tabFilterOptions[activeTab] ??
        FinancialsTabNFilterOptions.tabFilterOptions["pending-payout"]

    const handleExport = (format: any) => {
        const data = activeTabState?.items ?? []
        exportData({
            data: data as unknown as Record<string, unknown>[],
            format,
            filename: `financials_${activeTab}`,
            title: `Financials - ${activeTab.replace("-", " ")}`,
        })
    }

    // Bulk action handler
    const handleBulkAction = useCallback(async (actionId: BulkFinancialsActionId) => {
        if (!selectedItems.length) return

        switch (actionId) {
            case "bulk-export": {
                const allItems = (activeTabState?.items ?? []) as unknown as Record<string, unknown>[]
                const selectedRows = allItems.filter((item: any) => {
                    const id = item.payout_id ?? item.listing_id ?? item.payment_id ?? item.subscription_id
                    return selectedItems.includes(id)
                })
                exportData({
                    data: selectedRows,
                    format: "csv",
                    filename: `financials_${activeTab}_selected`,
                    title: `Financials - ${activeTab.replace("-", " ")}`,
                })
                setSelectedItems([])
                break
            }
            case "bulk-approve":
            case "bulk-decline": {
                // Placeholder — wire to bulk payout endpoint when available
                console.warn(`[FinancialsBulkActions] ${actionId} — no bulk endpoint yet. IDs:`, selectedItems)
                setSelectedItems([])
                break
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItems, activeTabState, activeTab])

    return (
        <main className="pb-12">

            {/* ── Header controls ───────────────────────────────── */}
            <div className="flex flex-wrap justify-between items-center gap-5 mb-5 mt-10 lg:mt-4">
                <div className="flex gap-2 items-center">
                    <DateRangePresetFilter
                        value={filters.dateRangePreset ?? null}
                        onChange={handleDatePresetChange}
                        icon="solar:calendar-linear"
                    />
                    <EventFilter
                        value={filters.event ?? null}
                        onChange={handleEventChange}
                        icon="solar:calendar-linear"
                    />
                </div>
                <ExportButton1 showFormatSelector onExport={handleExport} />
            </div>

            {/* ── KPI Cards ─────────────────────────────────────── */}
            <div className="mb-8">
                {
                    (isCardsLoading || !isMounted) ?
                        <MetricsContainerLoader />
                        :
                        <MetricCardsContainer1
                            metricsFor="financials"
                            metrics={kpiMetrics}
                        />
                }
            </div>

            {/* ── Tabbed table ──────────────────────────────────── */}
            {/* Bulk actions bar */}
            <div className="mt-7">
                <FinancialsBulkActionsBar
                    selectedCount={selectedItems.length}
                    selectedItems={((activeTabState?.items ?? []) as any[])
                        .filter(e => selectedItems.includes(e.payout_id || e.id || e.order_id || e.subscription_id))
                        .map(e => ({ status: e.status }))}
                    onAction={handleBulkAction}
                    onClearSelection={() => setSelectedItems([])}
                />

                <DataDisplayTableWrapper
                filters={filters}
                setFilters={setFilters}
                tabs={tabList}
                activeTab={activeTab}
                setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                onTabChange={handleTabChange}
                filterOptions={currentFilterOptions as any}
                showSearch
                searchPlaceholder="Search payouts, events, subscribers…"
                currentSearch={activeTabState?.search ?? ""}
                onSearch={activeTabState?.handleSearch}
                isLoading={activeTabState?.isLoading}
                tabCounts={tabCounts}
            >
                {/* Pending Payouts */}
                {activeTab === "pending-payout" && (
                    <AdminPendingPayoutsTable
                        items={(activeTabState?.items ?? []) as AdminPayout[]}
                        isLoading={activeTabState?.isLoading ?? false}
                        isLoadingMore={activeTabState?.isLoadingMore ?? false}
                        hasNext={activeTabState?.hasNext ?? false}
                        count={activeTabState?.count ?? 0}
                        onLoadMore={activeTabState?.loadMore ?? (() => { })}
                        isEmpty={activeTabState?.isEmpty ?? false}
                        isError={activeTabState?.isError ?? false}
                        search={activeTabState?.search ?? ""}
                        currentPage={activeTabState?.currentPage ?? 1}
                        totalPages={activeTabState?.totalPages ?? 1}
                        fetchPage={activeTabState?.fetchPage ?? (() => { })}
                        onRefresh={activeTabState?.refresh}
                        selectedIds={selectedItems}
                        onSelectionChange={setSelectedItems}
                    />
                )}

                {/* Payout History */}
                {activeTab === "payout-history" && (
                    <AdminPayoutHistoryTable
                        items={(activeTabState?.items ?? []) as AdminPayout[]}
                        isLoading={activeTabState?.isLoading ?? false}
                        isLoadingMore={activeTabState?.isLoadingMore ?? false}
                        hasNext={activeTabState?.hasNext ?? false}
                        count={activeTabState?.count ?? 0}
                        onLoadMore={activeTabState?.loadMore ?? (() => { })}
                        isEmpty={activeTabState?.isEmpty ?? false}
                        isError={activeTabState?.isError ?? false}
                        search={activeTabState?.search ?? ""}
                        currentPage={activeTabState?.currentPage ?? 1}
                        totalPages={activeTabState?.totalPages ?? 1}
                        fetchPage={activeTabState?.fetchPage ?? (() => { })}
                    />
                )}

                {/* Resale Orders */}
                {activeTab === "resale-orders" && (
                    <AdminMarketplaceTable
                        items={(activeTabState?.items ?? []) as AdminMarketplaceListing[]}
                        isLoading={activeTabState?.isLoading ?? false}
                        isLoadingMore={activeTabState?.isLoadingMore ?? false}
                        hasNext={activeTabState?.hasNext ?? false}
                        count={activeTabState?.count ?? 0}
                        onLoadMore={activeTabState?.loadMore ?? (() => { })}
                        isEmpty={activeTabState?.isEmpty ?? false}
                        isError={activeTabState?.isError ?? false}
                        search={activeTabState?.search ?? ""}
                        currentPage={activeTabState?.currentPage ?? 1}
                        totalPages={activeTabState?.totalPages ?? 1}
                        fetchPage={activeTabState?.fetchPage ?? (() => { })}
                    />
                )}

                {/* Featured Payments */}
                {activeTab === "featured-payments" && (
                    <AdminFeaturedPaymentsTable
                        items={(activeTabState?.items ?? []) as AdminFeaturedPayment[]}
                        isLoading={activeTabState?.isLoading ?? false}
                        isLoadingMore={activeTabState?.isLoadingMore ?? false}
                        hasNext={activeTabState?.hasNext ?? false}
                        count={activeTabState?.count ?? 0}
                        onLoadMore={activeTabState?.loadMore ?? (() => { })}
                        isEmpty={activeTabState?.isEmpty ?? false}
                        isError={activeTabState?.isError ?? false}
                        search={activeTabState?.search ?? ""}
                        currentPage={activeTabState?.currentPage ?? 1}
                        totalPages={activeTabState?.totalPages ?? 1}
                        fetchPage={activeTabState?.fetchPage ?? (() => { })}
                    />
                )}

                {/* Subscriptions */}
                {activeTab === "subscriptions" && (
                    <AdminSubscriptionsTable
                        items={(activeTabState?.items ?? []) as AdminSubscription[]}
                        isLoading={activeTabState?.isLoading ?? false}
                        isLoadingMore={activeTabState?.isLoadingMore ?? false}
                        hasNext={activeTabState?.hasNext ?? false}
                        count={activeTabState?.count ?? 0}
                        onLoadMore={activeTabState?.loadMore ?? (() => { })}
                        isEmpty={activeTabState?.isEmpty ?? false}
                        isError={activeTabState?.isError ?? false}
                        search={activeTabState?.search ?? ""}
                        currentPage={activeTabState?.currentPage ?? 1}
                        totalPages={activeTabState?.totalPages ?? 1}
                        fetchPage={activeTabState?.fetchPage ?? (() => { })}
                    />
                )}
            </DataDisplayTableWrapper>
            </div>
        </main>
    )
}