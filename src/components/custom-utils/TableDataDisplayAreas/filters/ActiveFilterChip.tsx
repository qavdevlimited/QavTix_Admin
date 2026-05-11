'use client'

import { Dispatch, SetStateAction } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useAppSelector } from '@/lib/redux/hooks'

interface ActiveFilterChipsProps {
    filters: Partial<FilterValues>
    categories?: Category[]
    setFilters: Dispatch<SetStateAction<Partial<FilterValues>>>
    className?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (d: Date | string) => format(new Date(d), 'MMM d, yyyy')

const formatDateRange = (range?: { from?: Date | string; to?: Date | string } | null): string | null => {
    if (!range) return null
    if (range.from && range.to) return `${fmt(range.from)} – ${fmt(range.to)}`
    if (range.from) return `From ${fmt(range.from)}`
    if (range.to) return `Until ${fmt(range.to)}`
    return null
}

const formatPriceRange = (range?: { min?: number; max?: number } | null, prefix = ''): string | null => {
    if (!range) return null
    if (range.min != null && range.max != null) return `${prefix}${range.min} – ${prefix}${range.max}`
    if (range.min != null) return `${prefix}Min ${range.min}`
    if (range.max != null) return `${prefix}Max ${range.max}`
    return null
}

const DATE_PRESET_LABELS: Record<string, string> = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ActiveFilterChips({
    filters,
    categories = [],
    setFilters,
    className,
}: ActiveFilterChipsProps) {

    const chips: { key: keyof FilterValues; value: string; label: string }[] = []

    // categories — resolve label from id
    filters.categories?.forEach(selectedId => {
        const match = categories.find(c => c.value === selectedId)
        chips.push({ key: 'categories', value: selectedId, label: match?.label ?? selectedId })
    })

    // simple string / enum singles
    if (filters.status) chips.push({ key: 'status', value: filters.status, label: filters.status })
    if (filters.userStatus) chips.push({ key: 'userStatus', value: filters.userStatus, label: filters.userStatus })
    if (filters.transactionStatus) chips.push({ key: 'transactionStatus', value: filters.transactionStatus, label: filters.transactionStatus })
    if (filters.listingType) chips.push({ key: 'listingType', value: filters.listingType, label: filters.listingType })
    if (filters.sortBy) chips.push({ key: 'sortBy', value: filters.sortBy, label: `Sort: ${filters.sortBy}` })
    if (filters.sort) chips.push({ key: 'sort', value: filters.sort, label: `Sort: ${filters.sort}` })
    if (filters.event) chips.push({ key: 'event', value: filters.event, label: filters.event })
    if (filters.package) chips.push({ key: 'package', value: filters.package, label: filters.package })
    if (filters.billingCycle) chips.push({ key: 'billingCycle', value: filters.billingCycle, label: filters.billingCycle })
    if (filters.performance) chips.push({ key: 'performance', value: String(filters.performance), label: String(filters.performance) })

    // numeric singles
    if (filters.walletBalance != null) chips.push({ key: 'walletBalance', value: String(filters.walletBalance), label: `Balance: ${filters.walletBalance}` })
    if (filters.spend != null) chips.push({ key: 'spend', value: String(filters.spend), label: `Spend: ${filters.spend}` })
    if (filters.amount != null) chips.push({ key: 'amount', value: String(filters.amount), label: `Amount: ${filters.amount}` })
    if (filters.revenue != null) chips.push({ key: 'revenue', value: String(filters.revenue), label: `Revenue: ${filters.revenue}` })
    if (filters.numberOfEvents != null) chips.push({ key: 'numberOfEvents', value: String(filters.numberOfEvents), label: `Events: ${filters.numberOfEvents}` })

    // date ranges
    const dateRangeLabel = formatDateRange(filters.dateRange)
    const dateJoinedLabel = formatDateRange(filters.dateJoined)
    const lastActivityLabel = formatDateRange(filters.lastActivity)
    const purchaseDateRangeLabel = formatDateRange(filters.purchaseDateRange)
    const withdrawalDateLabel = formatDateRange(filters.withdrawalDate)

    if (dateRangeLabel) chips.push({ key: 'dateRange', value: dateRangeLabel, label: `Date: ${dateRangeLabel}` })
    if (dateJoinedLabel) chips.push({ key: 'dateJoined', value: dateJoinedLabel, label: `Joined: ${dateJoinedLabel}` })
    if (lastActivityLabel) chips.push({ key: 'lastActivity', value: lastActivityLabel, label: `Activity: ${lastActivityLabel}` })
    if (purchaseDateRangeLabel) chips.push({ key: 'purchaseDateRange', value: purchaseDateRangeLabel, label: `Purchase: ${purchaseDateRangeLabel}` })
    if (withdrawalDateLabel) chips.push({ key: 'withdrawalDate', value: withdrawalDateLabel, label: `Withdrawal: ${withdrawalDateLabel}` })

    // single date
    if (filters.purchaseDate) chips.push({ key: 'purchaseDate', value: filters.purchaseDate.toISOString(), label: `Purchase: ${fmt(filters.purchaseDate)}` })
    if (filters.timestamp) chips.push({ key: 'timestamp', value: filters.timestamp.toISOString(), label: `Time: ${fmt(filters.timestamp)}` })

    // date preset
    if (filters.dateRangePreset) {
        chips.push({
            key: 'dateRangePreset',
            value: filters.dateRangePreset,
            label: DATE_PRESET_LABELS[filters.dateRangePreset] ?? filters.dateRangePreset,
        })
    }

    // price / amount ranges
    const currency = useAppSelector(store => store.authUser.user?.currency)
    const priceRangeLabel = formatPriceRange(filters.priceRange, currency)
    const spendRangeLabel = formatPriceRange(filters.spendRange, currency)
    const amountRangeLabel = formatPriceRange(filters.amountRange, currency)
    const quantityRangeLabel = formatPriceRange(filters.quantityRange)
    const commissionRangeLabel = formatPriceRange(filters.commissionRange, currency)
    const eventsRangeLabel = formatPriceRange(filters.eventsRange)
    const revenueRangeLabel = formatPriceRange(filters.revenueRange, currency)

    if (priceRangeLabel) chips.push({ key: 'priceRange', value: priceRangeLabel, label: `Price: ${priceRangeLabel}` })
    if (spendRangeLabel) chips.push({ key: 'spendRange', value: spendRangeLabel, label: `Spend: ${spendRangeLabel}` })
    if (amountRangeLabel) chips.push({ key: 'amountRange', value: amountRangeLabel, label: `Amount: ${amountRangeLabel}` })
    if (quantityRangeLabel) chips.push({ key: 'quantityRange', value: quantityRangeLabel, label: `Qty: ${quantityRangeLabel}` })
    if (commissionRangeLabel) chips.push({ key: 'commissionRange', value: commissionRangeLabel, label: `Commission: ${commissionRangeLabel}` })
    if (eventsRangeLabel) chips.push({ key: 'eventsRange', value: eventsRangeLabel, label: `Events: ${eventsRangeLabel}` })
    if (revenueRangeLabel) chips.push({ key: 'revenueRange', value: revenueRangeLabel, label: `Revenue: ${revenueRangeLabel}` })

    // location
    if (filters.location) {
        chips.push({ key: 'location', value: filters.location.country, label: filters.location.label })
    }

    // ticketType — array of objects
    filters.ticketType?.forEach(type => {
        chips.push({ key: 'ticketType', value: type.id.toString(), label: type.ticket_type })
    })

    // action — array of strings
    filters.action?.forEach(act => {
        chips.push({ key: 'action', value: act, label: act })
    })

    // auditAction
    if (filters.auditAction) {
        chips.push({ key: 'auditAction', value: filters.auditAction, label: `Action: ${filters.auditAction}` })
    }

    // ticketStatus — array of strings
    filters.ticketStatus?.forEach(s => {
        chips.push({ key: 'ticketStatus', value: s, label: s })
    })

    // user
    if (filters.user) {
        chips.push({ key: 'user', value: String(filters.user.id), label: filters.user.full_name ?? 'User' })
    }

    if (!chips.length) return null

    // ── Removal logic ─────────────────────────────────────────────────────────

    const removeChip = (key: keyof FilterValues, value: string) => {
        setFilters(prev => {
            const current = prev[key]

            // arrays of primitives (categories, action, auditAction, ticketStatus)
            if (Array.isArray(current) && current.every(v => typeof v === 'string')) {
                return { ...prev, [key]: (current as string[]).filter(v => v !== value) }
            }

            // ticketType — array of objects keyed by id
            if (key === 'ticketType' && Array.isArray(current)) {
                return { ...prev, ticketType: (current as TicketType[]).filter(t => t.id.toString() !== value) }
            }

            // date ranges — clear the whole range object
            if (['dateRange', 'dateJoined', 'lastActivity', 'purchaseDateRange', 'withdrawalDate'].includes(key)) {
                return { ...prev, [key]: undefined }
            }

            // price / quantity ranges — clear the whole range object
            if (['priceRange', 'spendRange', 'amountRange', 'quantityRange', 'commissionRange', 'eventsRange', 'revenueRange'].includes(key)) {
                return { ...prev, [key]: null }
            }

            // everything else — null it out
            return { ...prev, [key]: null }
        })
    }

    const resetAll = () => {
        setFilters(prev => ({
            ...prev,
            categories: [],
            action: [],
            auditAction: null,
            ticketStatus: [],
            ticketType: [],
            status: null,
            userStatus: null,
            transactionStatus: null,
            listingType: null,
            sortBy: null,
            sort: null,
            event: null,
            host: null,
            package: null,
            billingCycle: null,
            performance: null,
            walletBalance: null,
            spend: null,
            amount: null,
            revenue: null,
            numberOfEvents: null,
            priceRange: null,
            spendRange: null,
            amountRange: null,
            quantityRange: null,
            commissionRange: null,
            eventsRange: null,
            revenueRange: null,
            location: null,
            user: null,
            dateRangePreset: null,
            purchaseDate: null,
            timestamp: null,
            dateRange: undefined,
            dateJoined: undefined,
            lastActivity: undefined,
            purchaseDateRange: undefined,
            withdrawalDate: undefined,
        }))
    }

    return (
        <div className={cn("flex flex-wrap items-center gap-2 mt-3", className)}>
            {chips.map(chip => (
                <span
                    key={`${chip.key}-${chip.value}`}
                    className="flex items-center gap-1.5 border border-brand-neutral-5 px-3 py-2 h-7 rounded-sm bg-brand-neutral-4 text-brand-neutral-7 text-xs font-medium capitalize"
                >
                    {chip.label}
                    <button
                        onClick={() => removeChip(chip.key, chip.value)}
                        className="text-brand-neutral-6 hover:text-brand-secondary-9 transition-colors"
                        aria-label={`Remove ${chip.label} filter`}
                    >
                        <Icon icon="mage:multiply" className="size-3" />
                    </button>
                </span>
            ))}

            <button
                onClick={resetAll}
                className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors ml-1"
            >
                Reset Filters
                <Icon icon="mage:multiply" className="size-3" />
            </button>
        </div>
    )
}