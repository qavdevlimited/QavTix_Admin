"use client"

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import DateRangePresetFilter from "@/components/custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import MetricCardsContainer1 from "@/components/cards/MetricCardsContainer1"
import MetricsContainerLoader from "@/components/loaders/MetricsContainerLoader"
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import BusinessManagementTable from "@/components/custom-utils/TableDataDisplayAreas/tables/BusinessManagementTable"
import HostSignupRequestsTable from "@/components/custom-utils/TableDataDisplayAreas/tables/PendingVerificationTable"
import { TableDataDisplayFilter, HostManagementTabNFilterOptions } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { ADMIN_HOSTS_ENDPOINT, ADMIN_HOST_VERIFICATIONS_ENDPOINT } from "@/endpoints"
import { getAdminHostCards } from "@/actions/host-management/index"
import { getAuthToken } from "@/helper-fns/getAuthToken"
import { mapHostCardsToMetrics } from "@/helper-fns/mapUserManagementCards"
import { Icon } from "@iconify/react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { useAppSelector } from "@/lib/redux/hooks"
import HostBulkActionsBar from "@/components/custom-utils/dropdown/HostBulkActionsBar"
import { exportData } from "@/helper-fns/exportData"

type ActiveTab = "all-hosts" | "pending-verification"


const TAB_LABELS: Record<ActiveTab, string> = {
    "all-hosts": "Host List",
    "pending-verification": "Pending Verifications",
}

interface Props {
    initialHosts: TabSlice<AdminHost>
    initialHostCards: AdminHostCards | null
    initialPendingHosts: TabSlice<AdminPendingHost>
}


export default function HostmanagementPageCW({
    initialHosts,
    initialHostCards,
    initialPendingHosts,
}: Props) {

    const { tabFilterOptions, tabList } = HostManagementTabNFilterOptions

    const [activeTab, setActiveTab] = useState<ActiveTab>("all-hosts")
    const [datePreset, setDatePreset] = useState<DatePreset | null>(null)
    const [filters, setFilters] = useState<Partial<FilterValues>>({ userStatus: null, sortBy: null })
    const [isCardsLoading, setIsCardsLoading] = useState(false)

    // Bulk selection — reset when tab changes
    const [selectedHosts, setSelectedHosts] = useState<(string | number)[]>([])
    useEffect(() => {
        setSelectedHosts([])
        setFilters({})
    }, [activeTab])
    const isMounted = useIsMounted()
    const firstRender = useRef(true)
    const { user } = useAppSelector(store => store.authUser)

    // KPI Cards with rollback
    const hostCardsRef = useRef<AdminHostCards | null>(initialHostCards)
    const [hostCards, _setHostCards] = useState<AdminHostCards | null>(initialHostCards)
    const [hostCardsError, setHostCardsError] = useState(false)

    const setHostCards = (next: AdminHostCards | null) => {
        if (next) {
            hostCardsRef.current = next
            _setHostCards(next)
            setHostCardsError(false)
        } else {
            _setHostCards(hostCardsRef.current)
            setHostCardsError(true)
        }
    }

    // KPI filter only refetches cards — NOT the host table
    useEffect(() => {
        if (!isMounted) return;

        if (firstRender.current) {
            firstRender.current = false
            return
        }

        const refresh = async () => {
            setIsCardsLoading(true)
            try {
                const token = await getAuthToken()
                const { cards } = await getAdminHostCards(token, datePreset ? { date_range: datePreset } : undefined)
                setHostCards(cards)
            } catch {
                setHostCards(null)
            } finally {
                setIsCardsLoading(false)
            }
        }
        refresh()
    }, [datePreset])

    // useDataDisplay for hosts table
    const { activeTabState: hostsState } = useDataDisplay<AdminHost>(
        {
            endpoint: ADMIN_HOSTS_ENDPOINT,
            tabs: [{
                key: "all-hosts",
                initialData: initialHosts,
                staticParams: {},
            }],
            activeTab: "all-hosts",
        },
        filters,
    )

    // useDataDisplay for pending verifications table (separate, no shared filters)
    const { activeTabState: pendingState } = useDataDisplay<AdminPendingHost>(
        {
            endpoint: ADMIN_HOST_VERIFICATIONS_ENDPOINT,
            tabs: [{
                key: "pending-verification",
                initialData: initialPendingHosts,
                staticParams: {},
            }],
            activeTab: "pending-verification",
        },
        filters,
    )

    const activeState = activeTab === "all-hosts" ? hostsState : pendingState
    const hostMetrics = mapHostCardsToMetrics(hostCards, user?.currency!)

    const tabCounts: Record<string, number> = {
        "all-hosts": hostsState?.count ?? 0,
        "pending-verification": pendingState?.count ?? 0,
    }

    const handleExport = (format: any) => {
        const data = activeState?.items ?? []
        const labels: Record<ActiveTab, { filename: string; title: string }> = {
            "all-hosts": { filename: "hosts", title: "Host List" },
            "pending-verification": { filename: "pending_hosts", title: "Pending Verifications" },
        }
        exportData({
            data: data as unknown as Record<string, unknown>[],
            format,
            filename: labels[activeTab].filename,
            title: labels[activeTab].title,
        })
    }

    // Bulk action handler
    const handleBulkAction = useCallback(async (actionId: BulkHostActionId) => {
        if (!selectedHosts.length) return

        switch (actionId) {
            case "bulk-export": {
                const allItems = (activeState?.items ?? []) as unknown as Record<string, unknown>[]
                const selectedItems = allItems.filter((item: any) => {
                    const id = item.host_id ?? item.referral_id
                    return selectedHosts.includes(id)
                })
                const labels: Record<ActiveTab, { filename: string; title: string }> = {
                    "all-hosts": { filename: "hosts-selected", title: "Host List" },
                    "pending-verification": { filename: "pending-selected", title: "Pending Verifications" },
                }
                exportData({
                    data: selectedItems,
                    format: "csv",
                    filename: labels[activeTab].filename,
                    title: labels[activeTab].title,
                })
                setSelectedHosts([])
                break
            }

            case "bulk-suspend":
            case "bulk-approve":
            case "bulk-decline": {
                // Placeholders — wire to bulk endpoints when available
                console.warn(`[HostBulkActions] ${actionId} — no bulk endpoint yet. IDs:`, selectedHosts)
                setSelectedHosts([])
                break
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedHosts, activeState, activeTab])

    return (
        <main className="pb-12">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-4">
                <DateRangePresetFilter
                    value={datePreset}
                    onChange={setDatePreset}
                    label="KPI Range"
                />
                <ExportButton1 showFormatSelector label={`Export ${TAB_LABELS[activeTab]}`} onExport={handleExport} />
            </div>

            {/* KPI Cards */}
            <div className="mb-8">
                {isCardsLoading ? (
                    <MetricsContainerLoader />
                ) : (
                    <div className="relative">
                        <MetricCardsContainer1 metricsFor="hosts" metrics={hostMetrics} />
                        {hostCardsError && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                                <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
                                <span>Could not refresh stats — showing last available data</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <section className="mt-10">
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>
                    {TAB_LABELS[activeTab]}
                </h3>

                {/* Bulk actions bar — renders only when rows are selected */}
                <HostBulkActionsBar
                    selectedCount={selectedHosts.length}
                    tab={activeTab}
                    selectedItems={((hostsState?.items ?? []) as AdminHost[])
                        .filter(h => selectedHosts.includes(h.host_id))
                        .map(h => ({ status: h.status }))}
                    onAction={handleBulkAction}
                    onClearSelection={() => setSelectedHosts([])}
                />

                <DataDisplayTableWrapper
                    tabs={tabList}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filters={filters}
                    filterOptions={(tabFilterOptions[activeTab] ?? []) as readonly TableDataDisplayFilter[]}
                    setFilters={setFilters as Dispatch<SetStateAction<Partial<FilterValues>>>}
                    showSearch
                    searchPlaceholder={activeTab === "all-hosts" ? "Search by owner or business name..." : "Search verifications..."}
                    onSearch={activeState?.handleSearch}
                    isLoading={activeState?.isLoading}
                    tabCounts={tabCounts}
                >
                    {activeTab === "all-hosts" && (
                        <BusinessManagementTable
                            items={(hostsState?.items ?? []) as AdminHost[]}
                            isLoading={hostsState?.isLoading ?? false}
                            isLoadingMore={hostsState?.isLoadingMore ?? false}
                            hasNext={hostsState?.hasNext ?? false}
                            count={hostsState?.count ?? 0}
                            onLoadMore={hostsState?.loadMore}
                            isEmpty={hostsState?.isEmpty ?? false}
                            isError={hostsState?.isError ?? false}
                            search={hostsState?.search ?? ""}
                            currentPage={hostsState?.currentPage ?? 1}
                            totalPages={hostsState?.totalPages ?? 1}
                            fetchPage={hostsState?.fetchPage}
                            onRefresh={hostsState?.refresh}
                            selectedIds={selectedHosts}
                            onSelectionChange={setSelectedHosts}
                        />
                    )}

                    {activeTab === "pending-verification" && (
                        <HostSignupRequestsTable
                            items={(pendingState?.items ?? []) as AdminPendingHost[]}
                            isLoading={pendingState?.isLoading ?? false}
                            isLoadingMore={pendingState?.isLoadingMore ?? false}
                            hasNext={pendingState?.hasNext ?? false}
                            count={pendingState?.count ?? 0}
                            onLoadMore={pendingState?.loadMore}
                            isEmpty={pendingState?.isEmpty ?? false}
                            isError={pendingState?.isError ?? false}
                            search={pendingState?.search ?? ""}
                            currentPage={pendingState?.currentPage ?? 1}
                            totalPages={pendingState?.totalPages ?? 1}
                            fetchPage={pendingState?.fetchPage}
                            onRefresh={pendingState?.refresh}
                        />
                    )}
                </DataDisplayTableWrapper>
            </section>
        </main>
    )
}