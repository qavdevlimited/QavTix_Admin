"use client"

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import DateRangePresetFilter from "../custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import MetricCardsContainer1 from "../cards/MetricCardsContainer1"
import MetricsContainerLoader from "../loaders/MetricsContainerLoader"
import AffiliateMetricCardsContainer from "../cards/AffiliateMetricCardsContainer"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import UsersTable from "../custom-utils/TableDataDisplayAreas/tables/UsersTable"
import AffiliatesTable from "../custom-utils/TableDataDisplayAreas/tables/AffiliatesTable"
import WithdrawalsTable from "../custom-utils/TableDataDisplayAreas/tables/WithdrawalsTable"
import { TableDataDisplayFilter, UserManagementTabNFilterOptions } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import {
    ADMIN_USERS_ENDPOINT,
    ADMIN_AFFILIATES_ENDPOINT,
    ADMIN_WITHDRAWALS_ENDPOINT,
} from "@/endpoints"
import { getAdminUsersCards, getAdminAffiliatesCards } from "@/actions/user-management/index"
import { getAuthToken } from "@/helper-fns/getAuthToken"
import { mapUserCardsToMetrics, mapAffiliateCardsToSparkline } from "@/helper-fns/mapUserManagementCards"
import { Icon } from "@iconify/react"
import { exportData } from "@/helper-fns/exportData"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { useAppSelector } from "@/lib/redux/hooks"
import UserBulkActionsBar from "../custom-utils/dropdown/UserBulkActionsBar"

type ActiveTab = "users" | "affiliates" | "withdrawals"

const TAB_LABELS: Record<ActiveTab, string> = {
    users: "User List",
    affiliates: "Affiliate List",
    withdrawals: "Withdrawal History",
}

interface Props {
    initialUsers: TabSlice<AdminCustomer>
    initialUserCards: AdminUserCards | null
    initialAffiliates: TabSlice<AdminAffiliate>
    initialAffiliateCards: AdminAffiliateCards | null
    initialWithdrawals: TabSlice<AdminWithdrawal>
}

export default function UserManagementPageCW({
    initialUsers,
    initialUserCards,
    initialAffiliates,
    initialAffiliateCards,
    initialWithdrawals,
}: Props) {

    const { tabFilterOptions, tabList } = UserManagementTabNFilterOptions

    const [activeTab, setActiveTab] = useState<ActiveTab>("users")
    const [datePreset, setDatePreset] = useState<DatePreset | null>(null)
    const [filters, setFilters] = useState<Partial<FilterValues>>({ userStatus: null, sortBy: null, location: null })
    const [isCardsLoading, setIsCardsLoading] = useState(false)

    // Bulk selection state (separate per logical entity but reset on tab change)
    const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([])

    const isMounted = useIsMounted()
    const firstRender = useRef(true)

    // KPI Cards state with rollback
    const userCardsRef = useRef<AdminUserCards | null>(initialUserCards)
    const [userCards, _setUserCards] = useState<AdminUserCards | null>(initialUserCards)
    const [userCardsError, setUserCardsError] = useState(false)

    const affiliateCardsRef = useRef<AdminAffiliateCards | null>(initialAffiliateCards)
    const [affiliateCards, _setAffiliateCards] = useState<AdminAffiliateCards | null>(initialAffiliateCards)
    const [affiliateCardsError, setAffiliateCardsError] = useState(false)

    const setUserCards = (next: AdminUserCards | null) => {
        if (next) {
            userCardsRef.current = next
            _setUserCards(next)
            setUserCardsError(false)
        } else {
            _setUserCards(userCardsRef.current)
            setUserCardsError(true)
        }
    }

    const setAffiliateCards = (next: AdminAffiliateCards | null) => {
        if (next) {
            affiliateCardsRef.current = next
            _setAffiliateCards(next)
            setAffiliateCardsError(false)
        } else {
            _setAffiliateCards(affiliateCardsRef.current)
            setAffiliateCardsError(true)
        }
    }

    // Merged filters: do NOT include datePreset as it only applies to KPI cards
    const mergedFilters: Partial<FilterValues> = {
        ...filters,
    }

    // Clear selection when switching tabs
    useEffect(() => { setSelectedUsers([]) }, [activeTab])

    // Manually fetch cards when date filter changes since they are on separate endpoints
    useEffect(() => {
        if (!isMounted) return

        if (firstRender.current) {
            firstRender.current = false
            return
        }

        const refreshCards = async () => {
            setIsCardsLoading(true)
            const params = { date_range: datePreset }
            try {
                const token = await getAuthToken()
                const [usersRes, affiliatesRes] = await Promise.all([
                    getAdminUsersCards(token, params),
                    getAdminAffiliatesCards(token, params)
                ])
                setUserCards(usersRes.cards)
                setAffiliateCards(affiliatesRes.cards)
            } catch (error) {
                console.error("Failed to fetch cards", error)
            } finally {
                setIsCardsLoading(false)
            }
        }

        refreshCards()
    }, [datePreset])

    // useDataDisplay — one hook per endpoint
    const { tabStates } = useDataDisplay<AdminCustomer | AdminAffiliate | AdminWithdrawal>(
        {
            endpoint: ADMIN_USERS_ENDPOINT,
            tabs: [{
                key: "users",
                initialData: initialUsers as TabSlice<AdminCustomer | AdminAffiliate | AdminWithdrawal>,
                staticParams: {},
            }],
            revalidateTarget: "customers",
        },
        mergedFilters,
    )

    const { tabStates: affiliateTabStates } = useDataDisplay<AdminAffiliate>(
        {
            endpoint: ADMIN_AFFILIATES_ENDPOINT,
            tabs: [{
                key: "affiliates",
                initialData: initialAffiliates,
                staticParams: {},
            }],
            revalidateTarget: "customers",
        },
        mergedFilters,
    )

    const { tabStates: withdrawalTabStates } = useDataDisplay<AdminWithdrawal>(
        {
            endpoint: ADMIN_WITHDRAWALS_ENDPOINT,
            tabs: [{
                key: "withdrawals",
                initialData: initialWithdrawals,
                staticParams: {},
            }],
            revalidateTarget: "customers",
        },
        mergedFilters,
    )

    const usersState = tabStates["users"] as unknown as ReturnType<typeof useDataDisplay<AdminCustomer>>["activeTabState"]
    const affiliatesState = affiliateTabStates["affiliates"]
    const withdrawalsState = withdrawalTabStates["withdrawals"]

    const activeState = activeTab === "users"
        ? usersState
        : activeTab === "affiliates"
            ? affiliatesState
            : withdrawalsState

    // Tab count badges
    const tabCounts: Record<string, number> = {
        users:       usersState?.count       ?? 0,
        affiliates:  affiliatesState?.count  ?? 0,
        withdrawals: withdrawalsState?.count ?? 0,
    }

    // Cards are SSR-prefetched — show loader when table is loading AND cards are still null, or when actively refetching
    const isKpiLoading = isCardsLoading || (activeTab === "affiliates"
        ? (affiliatesState?.isLoading ?? false) && affiliateCards === null
        : (usersState?.isLoading ?? false) && userCards === null)

    const kpiError = activeTab === "affiliates" ? affiliateCardsError : userCardsError

    const { user } = useAppSelector(store => store.authUser)

    // Flat metric cards for Users + Withdrawals tabs
    const userMetrics = mapUserCardsToMetrics(userCards, user?.currency!)

    // Sparkline cards for Affiliates tab
    const affiliateSparklineCards = mapAffiliateCardsToSparkline(affiliateCards, user?.currency!)

    const handleExport = (format: any) => {
        const data = activeState?.items ?? []
        const labels: Record<ActiveTab, { filename: string; title: string }> = {
            users: { filename: "users", title: "User List" },
            affiliates: { filename: "affiliates", title: "Affiliate List" },
            withdrawals: { filename: "withdrawals", title: "Withdrawal History" },
        }
        exportData({
            data: data as unknown as Record<string, unknown>[],
            format,
            filename: labels[activeTab].filename,
            title: labels[activeTab].title,
        })
    }

    // Bulk action handler
    const handleBulkAction = useCallback(async (actionId: BulkUserActionId) => {
        if (!selectedUsers.length) return

        switch (actionId) {
            case "bulk-export": {
                // Re-use the existing export helper for just the selected items
                const allItems = (activeState?.items ?? []) as unknown as Record<string, unknown>[]
                const selectedItems = allItems.filter((item: any) => {
                    const id = item.user_id ?? item.referral_id ?? item.payment_id
                    return selectedUsers.includes(id)
                })
                const labels: Record<ActiveTab, { filename: string; title: string }> = {
                    users:       { filename: "users-selected",       title: "User List" },
                    affiliates:  { filename: "affiliates-selected",  title: "Affiliate List" },
                    withdrawals: { filename: "withdrawals-selected", title: "Withdrawal History" },
                }
                exportData({
                    data: selectedItems,
                    format: "csv",
                    filename: labels[activeTab].filename,
                    title:    labels[activeTab].title,
                })
                setSelectedUsers([])
                break
            }

            case "bulk-suspend":
            case "bulk-ban": {
                // Per-user actions — call toggleUserSuspension or equivalent per ID
                // These are placeholders; wire to your actual bulk endpoints when available.
                console.warn(`[UserBulkActions] ${actionId} — no bulk endpoint yet. IDs:`, selectedUsers)
                setSelectedUsers([])
                break
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUsers, activeState, activeTab])

    return (
        <main className="pb-10">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <DateRangePresetFilter
                        value={datePreset}
                        onChange={setDatePreset}
                        label="KPI Range"
                    />
                </div>
                <ExportButton1
                    showFormatSelector
                    label={`Export ${TAB_LABELS[activeTab]}`}
                    onExport={handleExport}
                />
            </div>

            {/* KPI Cards */}
            <div className="mb-8">
                {isKpiLoading ? (
                    <MetricsContainerLoader />
                ) : (
                    <div className="relative">
                        {/* Affiliates: custom plain sparkline cards in grid container */}
                        {activeTab === "affiliates" ? (
                            <AffiliateMetricCardsContainer metrics={affiliateSparklineCards} />
                        ) : (
                            // Users + Withdrawals: regular flat metric cards
                            <MetricCardsContainer1 metricsFor="users" metrics={userMetrics} />
                        )}

                        {kpiError && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                                <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
                                <span>Could not refresh stats — showing last available data</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-8">
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>
                    {TAB_LABELS[activeTab]}
                </h3>

                {/* Bulk actions bar — renders only when rows are selected */}
                <UserBulkActionsBar
                    selectedCount={selectedUsers.length}
                    tab={activeTab}
                    onAction={handleBulkAction}
                    onClearSelection={() => setSelectedUsers([])}
                />

                <DataDisplayTableWrapper
                    tabs={tabList}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filters={filters}
                    filterOptions={tabFilterOptions[activeTab] as readonly TableDataDisplayFilter[]}
                    setFilters={setFilters as Dispatch<SetStateAction<Partial<FilterValues>>>}
                    showSearch
                    searchPlaceholder={
                        activeTab === "users" ? "Search by name or email…" :
                            activeTab === "affiliates" ? "Search by affiliate name…" :
                                "Search by recipient name…"
                    }
                    onSearch={activeState?.handleSearch}
                    isLoading={activeState?.isLoading}
                    tabCounts={tabCounts}
                >
                    {activeTab === "users" && (
                        <UsersTable
                            items={(usersState?.items ?? []) as AdminCustomer[]}
                            isLoading={usersState?.isLoading ?? false}
                            isLoadingMore={usersState?.isLoadingMore ?? false}
                            hasNext={usersState?.hasNext ?? false}
                            count={usersState?.count ?? 0}
                            onLoadMore={usersState?.loadMore}
                            isEmpty={usersState?.isEmpty ?? false}
                            isError={usersState?.isError ?? false}
                            search={usersState?.search ?? ""}
                            currentPage={usersState?.currentPage ?? 1}
                            totalPages={usersState?.totalPages ?? 1}
                            fetchPage={usersState?.fetchPage}
                            onRefresh={usersState?.refresh}
                        />
                    )}

                    {activeTab === "affiliates" && (
                        <AffiliatesTable
                            items={(affiliatesState?.items ?? []) as AdminAffiliate[]}
                            isLoading={affiliatesState?.isLoading ?? false}
                            isLoadingMore={affiliatesState?.isLoadingMore ?? false}
                            hasNext={affiliatesState?.hasNext ?? false}
                            count={affiliatesState?.count ?? 0}
                            onLoadMore={affiliatesState?.loadMore}
                            isEmpty={affiliatesState?.isEmpty ?? false}
                            isError={affiliatesState?.isError ?? false}
                            search={affiliatesState?.search ?? ""}
                            currentPage={affiliatesState?.currentPage ?? 1}
                            totalPages={affiliatesState?.totalPages ?? 1}
                            fetchPage={affiliatesState?.fetchPage}
                        />
                    )}

                    {activeTab === "withdrawals" && (
                        <WithdrawalsTable
                            items={(withdrawalsState?.items ?? []) as AdminWithdrawal[]}
                            isLoading={withdrawalsState?.isLoading ?? false}
                            isLoadingMore={withdrawalsState?.isLoadingMore ?? false}
                            hasNext={withdrawalsState?.hasNext ?? false}
                            count={withdrawalsState?.count ?? 0}
                            onLoadMore={withdrawalsState?.loadMore}
                            isEmpty={withdrawalsState?.isEmpty ?? false}
                            isError={withdrawalsState?.isError ?? false}
                            search={withdrawalsState?.search ?? ""}
                            currentPage={withdrawalsState?.currentPage ?? 1}
                            totalPages={withdrawalsState?.totalPages ?? 1}
                            fetchPage={withdrawalsState?.fetchPage}
                        />
                    )}
                </DataDisplayTableWrapper>
            </div>
        </main>
    )
}