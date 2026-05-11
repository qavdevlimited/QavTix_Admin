"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { fetchPaginatedData } from "@/actions/paginated-data/client"
import { useOnRevalidate } from "./UseRevalidate"
import { Country } from "country-state-city"

export interface PageData<T> {
    results: T[]
    count: number
    next: number | null
    previous: number | null
    total_pages?: number
}

export interface TabSlice<T> {
    results: T[]
    count: number
    next: number | null
    previous: number | null
    total_pages?: number
}

export interface TabConfig<T> {
    key: string
    initialData: TabSlice<T>
    staticParams: Record<string, string>
    endpoint?: string
    onCards?: (cards: any | null) => void
    resultsKey?: string
}

export interface UseDataDisplayConfig<T> {
    endpoint: string
    tabs: TabConfig<T>[]
    activeTab?: string,
    revalidateTarget?: RevalidateTarget
}

type FetchStatus = "idle" | "loading" | "loadingMore" | "error" | "empty"

export interface TabState<T> {
    items: T[]
    cachedItems: T[]
    count: number
    totalPages: number
    currentPage: number
    hasNext: boolean
    status: FetchStatus
    isLoading: boolean
    isLoadingMore: boolean
    isError: boolean
    isEmpty: boolean
    search: string
    handleSearch: (query: string) => void
    loadMore: () => void
    fetchPage: (page: number) => void
    resetSearch: () => void
    refresh: () => void
}

const buildFilterParams = (filters: Partial<FilterValues>): Record<string, string | string[]> => {
    const params: Record<string, string | string[]> = {}

    const activeStatus =
        filters.ticketStatus?.length ? filters.ticketStatus :
            filters.listingStatus ? filters.listingStatus :
                filters.packageStatus ? filters.packageStatus :
                    filters.userStatus ? filters.userStatus :
                        filters.status ? filters.status :
                            null

    if (activeStatus) params.status = activeStatus

    if (filters.host) params.seller_id = filters.host
    if (filters.categories?.length) params.category = filters.categories
    if (filters.dateRange?.from) params.start_date = format(new Date(filters.dateRange.from), 'yyyy-MM-dd')
    if (filters.dateRange?.to) params.end_date = format(new Date(filters.dateRange.to), 'yyyy-MM-dd')
    if (filters.purchaseDate) {
        params.start_date = format(filters.purchaseDate, 'yyyy-MM-dd')
        params.end_date = format(filters.purchaseDate, 'yyyy-MM-dd')
    }

    if (filters.priceRange?.min != null && filters.priceRange.min > 0) params.min_price = String(filters.priceRange.min)
    if (filters.priceRange?.max != null) params.max_price = String(filters.priceRange.max)
    if (filters.status) params.status = filters.status
    if (filters.ticketType?.length) params.ticket_type = filters.ticketType.map(t => String(t.id))
    if (filters.performance != null) params.performance = String(filters.performance)
    if (filters.sortBy) params.ordering = filters.sortBy
    if (filters.dateRangePreset) params.date_range = filters.dateRangePreset
    if (filters.event) params.event = filters.event
    if (filters.userStatus) params.status = filters.userStatus
    if (filters.packageStatus) params.status = filters.packageStatus

    if (filters.location) {
        const countryName = Country.getCountryByCode(filters.location.country)?.name ?? filters.location.country
        params.country = countryName
        if (filters.location.state) params.state = filters.location.state
        if (filters.location.city) params.city = filters.location.city
    }

    if (filters.dateJoined?.from) params.date_joined_from = format(new Date(filters.dateJoined.from), 'yyyy-MM-dd')
    if (filters.dateJoined?.to) params.date_joined_to = format(new Date(filters.dateJoined.to), 'yyyy-MM-dd')
    if (filters.spendRange?.min != null && filters.spendRange.min > 0) params.min_spend = String(filters.spendRange.min)
    if (filters.spendRange?.max != null) params.max_spend = String(filters.spendRange.max)
    if (filters.lastActivity?.from) params.last_activity_from = format(new Date(filters.lastActivity.from), 'yyyy-MM-dd')
    if (filters.lastActivity?.to) params.last_activity_to = format(new Date(filters.lastActivity.to), 'yyyy-MM-dd')
    if (filters.withdrawalDate?.from) params.date_from = format(new Date(filters.withdrawalDate.from), 'yyyy-MM-dd')
    if (filters.withdrawalDate?.to) params.date_to = format(new Date(filters.withdrawalDate.to), 'yyyy-MM-dd')
    if (filters.purchaseDateRange?.from) params.date_from = format(new Date(filters.purchaseDateRange.from), 'yyyy-MM-dd')
    if (filters.purchaseDateRange?.to) params.date_to = format(new Date(filters.purchaseDateRange.to), 'yyyy-MM-dd')
    if (filters.amountRange?.min != null && filters.amountRange.min > 0) params.min_amount = String(filters.amountRange.min)
    if (filters.amountRange?.max != null) params.max_amount = String(filters.amountRange.max)
    if (filters.quantityRange?.min != null && filters.quantityRange.min > 0) params.qty_min = String(filters.quantityRange.min)
    if (filters.quantityRange?.max != null) params.qty_max = String(filters.quantityRange.max)
    if (filters.commissionRange?.min != null && filters.commissionRange.min > 0) params.min_commission = String(filters.commissionRange.min)
    if (filters.commissionRange?.max != null) params.max_commission = String(filters.commissionRange.max)
    if (filters.eventsRange?.min != null && filters.eventsRange.min > 0) params.min_events = String(filters.eventsRange.min)
    if (filters.eventsRange?.max != null) params.max_events = String(filters.eventsRange.max)
    if (filters.revenueRange?.min != null && filters.revenueRange.min > 0) params.min_revenue = String(filters.revenueRange.min)
    if (filters.revenueRange?.max != null) params.max_revenue = String(filters.revenueRange.max)
    if (filters.ticketStatus?.length) params.status = filters.ticketStatus
    if (filters.package) params.plan_slug = filters.package
    if (filters.billingCycle) params.billing_cycle = filters.billingCycle
    if (filters.auditAction) params.action = filters.auditAction
    if (filters.timestamp) params.timestamp = filters.timestamp.toISOString()

    return params
}



const hasActiveFilters = (filters: Partial<FilterValues>): boolean =>
    !!(
        filters.categories?.length ||
        filters.dateRange?.from ||
        filters.dateRange?.to ||
        filters.priceRange?.min ||
        filters.priceRange?.max ||
        filters.status ||
        filters.userStatus ||
        filters.listingStatus ||
        filters.packageStatus ||
        filters.ticketType?.length ||
        filters.ticketStatus?.length ||
        filters.performance != null ||
        filters.purchaseDate ||
        filters.purchaseDateRange?.from ||
        filters.purchaseDateRange?.to ||
        filters.sortBy ||
        filters.dateRangePreset ||
        filters.event ||
        filters.host ||
        filters.location?.country ||
        filters.dateJoined?.from ||
        filters.dateJoined?.to ||
        filters.spendRange?.min ||
        filters.spendRange?.max ||
        filters.lastActivity?.from ||
        filters.lastActivity?.to ||
        filters.withdrawalDate?.from ||
        filters.withdrawalDate?.to ||
        filters.amountRange?.min ||
        filters.amountRange?.max ||
        filters.quantityRange?.min ||
        filters.quantityRange?.max ||
        filters.commissionRange?.min ||
        filters.commissionRange?.max ||
        filters.eventsRange?.min ||
        filters.eventsRange?.max ||
        filters.revenueRange?.min ||
        filters.revenueRange?.max ||
        filters.package ||
        filters.billingCycle ||
        filters.auditAction ||
        filters.timestamp
    )


const useTabState = <T>(
    config: TabConfig<T>,
    filters: Partial<FilterValues>,
    endpoint: string
): TabState<T> => {

    const [items, setItems] = useState<T[]>(config.initialData.results)
    const [cachedItems, setCachedItems] = useState<T[]>(config.initialData.results)
    const [count, setCount] = useState(config.initialData.count)
    const [totalPages, setTotalPages] = useState(config.initialData.total_pages ?? 1)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNext, setHasNext] = useState(!!config.initialData.next)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState<FetchStatus>(
        () => config.initialData.results.length === 0 ? "empty" : "idle"
    )

    const configRef = useRef(config)
    configRef.current = config
    const filtersRef = useRef(filters)
    filtersRef.current = filters

    const cachedItemsRef = useRef(cachedItems)
    cachedItemsRef.current = cachedItems

    const searchRef = useRef(search)
    searchRef.current = search

    const initialized = useRef(false)
    const isFetching = useRef(false)
    const pageRef = useRef(1)
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const filterKey = [
        filters.categories?.join(',') ?? '',
        filters.dateRange?.from?.toString() ?? '',
        filters.dateRange?.to?.toString() ?? '',
        filters.status ?? '',
        filters.userStatus ?? '',
        filters.listingStatus ?? '',
        filters.packageStatus ?? '',
        filters.ticketType?.map(t => t.id).join(',') ?? '',
        filters.ticketStatus?.join(',') ?? '',
        String(filters.priceRange?.min ?? ''),
        String(filters.priceRange?.max ?? ''),
        String(filters.performance ?? ''),
        filters.dateRangePreset ?? '',
        filters.sortBy ?? '',
        filters.purchaseDate?.toString() ?? '',
        filters.purchaseDateRange?.from?.toString() ?? '',
        filters.purchaseDateRange?.to?.toString() ?? '',
        filters.event ?? '',
        filters.host ?? '',
        filters.location?.country ?? '',
        filters.location?.state ?? '',
        filters.location?.city ?? '',
        filters.dateJoined?.from?.toString() ?? '',
        filters.dateJoined?.to?.toString() ?? '',
        String(filters.spendRange?.min ?? ''),
        String(filters.spendRange?.max ?? ''),
        filters.lastActivity?.from?.toString() ?? '',
        filters.lastActivity?.to?.toString() ?? '',
        filters.withdrawalDate?.from?.toString() ?? '',
        filters.withdrawalDate?.to?.toString() ?? '',
        String(filters.amountRange?.min ?? ''),
        String(filters.amountRange?.max ?? ''),
        String(filters.quantityRange?.min ?? ''),
        String(filters.quantityRange?.max ?? ''),
        String(filters.commissionRange?.min ?? ''),
        String(filters.commissionRange?.max ?? ''),
        String(filters.eventsRange?.min ?? ''),
        String(filters.eventsRange?.max ?? ''),
        String(filters.revenueRange?.min ?? ''),
        String(filters.revenueRange?.max ?? ''),
        filters.package ?? '',
        filters.billingCycle ?? '',
        filters.auditAction ?? '',
        filters.timestamp?.toISOString() ?? '',
    ].join('|')


    const prevFilterKey = useRef(filterKey)

    const fetchData = useRef(async (p: number, s: string, append: boolean) => {
        if (isFetching.current) return
        isFetching.current = true

        setStatus(append ? "loadingMore" : "loading")

        const result = await fetchPaginatedData<T>({
            endpoint,
            staticParams: configRef.current.staticParams,
            filterParams: buildFilterParams(filtersRef.current),
            page: p,
            search: s,
            resultsKey: configRef.current.resultsKey,
        })

        isFetching.current = false

        if (!result.success) {
            setItems([])
            setStatus("error")
            configRef.current.onCards?.(null)
            return
        }

        if (result.cards !== undefined) {
            configRef.current.onCards?.(result.cards)
        }

        const newItems = result.results as T[]

        if (newItems.length === 0 && !append) {
            setItems([])
            setCount(0)
            setHasNext(false)
            setTotalPages(0)
            setCurrentPage(p)
            setStatus("empty")
            return
        }

        setItems(prev => append ? [...prev, ...newItems] : newItems)
        setCount(result.count)
        setHasNext(!!result.next)
        setTotalPages(result.total_pages ?? 1)
        setCurrentPage(p)
        setStatus("idle")

        if (!s && !hasActiveFilters(filtersRef.current)) {
            setCachedItems(newItems)
        }
    })

    useEffect(() => {
        if (!initialized.current) return
        if (prevFilterKey.current === filterKey) return

        prevFilterKey.current = filterKey

        if (!hasActiveFilters(filters) && !searchRef.current) {
            pageRef.current = 1
            setCurrentPage(1)
            setItems(cachedItemsRef.current)
            setCount(cachedItemsRef.current.length)
            setHasNext(false)
            setTotalPages(1)
            setStatus(cachedItemsRef.current.length === 0 ? "empty" : "idle")
            return
        }

        setSearch("")
        searchRef.current = ""
        pageRef.current = 1
        fetchData.current(1, "", false)
    }, [filterKey])

    useEffect(() => {
        initialized.current = true
        return () => { initialized.current = false }
    }, [])

    const handleSearch = useCallback((query: string) => {
        const trimmed = query.trim()
        if (debounceTimer.current) clearTimeout(debounceTimer.current)

        if (!trimmed) {
            setSearch("")
            searchRef.current = ""
            pageRef.current = 1
            setCurrentPage(1)
            setItems(cachedItemsRef.current)
            setCount(cachedItemsRef.current.length)
            setHasNext(false)
            setTotalPages(1)
            setStatus(cachedItemsRef.current.length === 0 ? "empty" : "idle")
            return
        }

        setSearch(trimmed)
        searchRef.current = trimmed
        debounceTimer.current = setTimeout(() => {
            pageRef.current = 1
            fetchData.current(1, trimmed, false)
        }, 400)
    }, [])

    const loadMore = useCallback(() => {
        if (!hasNext || status === "loadingMore" || isFetching.current) return
        const nextPage = pageRef.current + 1
        pageRef.current = nextPage
        fetchData.current(nextPage, searchRef.current, true)
    }, [hasNext, status])

    // Fetches a specific page, replacing current items (no append)
    const fetchPage = useCallback((page: number) => {
        if (isFetching.current) return
        if (page < 1 || (totalPages > 0 && page > totalPages)) return
        pageRef.current = page
        fetchData.current(page, searchRef.current, false)
    }, [totalPages])


    const resetSearch = useCallback(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        setSearch("")
        searchRef.current = ""
        pageRef.current = 1
        setCurrentPage(1)
        setItems(cachedItemsRef.current)
        setCount(cachedItemsRef.current.length)
        setHasNext(false)
        setTotalPages(1)
        setStatus(cachedItemsRef.current.length === 0 ? "empty" : "idle")
    }, [])


    const refresh = useCallback(() => {
        if (isFetching.current) return
        pageRef.current = 1
        fetchData.current(1, searchRef.current, false)
    }, [])

    return {
        items, cachedItems, count, totalPages, currentPage, hasNext,
        status,
        isLoading: status === "loading",
        isLoadingMore: status === "loadingMore",
        isError: status === "error",
        isEmpty: status === "empty",
        search, handleSearch, loadMore, fetchPage,
        resetSearch,
        refresh
    }
}

export function useDataDisplay<T>(
    config: UseDataDisplayConfig<T>,
    filters: Partial<FilterValues>
): {
    tabStates: Record<string, TabState<T>>
    activeTabState: TabState<T>
} {

    const activeTab = config.activeTab ?? config.tabs[0].key

    const stateEntries = config.tabs.map(tab =>
        // eslint-disable-next-line react-hooks/rules-of-hooks
        [tab.key, useTabState(tab, filters, tab.endpoint ?? config.endpoint)] as const
    )

    const tabStates = Object.fromEntries(stateEntries) as Record<string, TabState<T>>

    useOnRevalidate(config.revalidateTarget ?? "" as RevalidateTarget, () => {
        if (!config.revalidateTarget) return

        // Refresh ALL tabs when revalidation fires
        Object.values(tabStates).forEach((state) => {
            state.refresh()
        })
    })

    return {
        tabStates,
        activeTabState: tabStates[activeTab] ?? tabStates[config.tabs[0].key],
    }
}