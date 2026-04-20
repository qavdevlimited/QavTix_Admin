'use client'

import { Dispatch, SetStateAction } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface ActiveFilterChipsProps {
    filters: Partial<FilterValues>
    categories: Category[]                  // available categories — used to resolve label from id
    setFilters: Dispatch<SetStateAction<Partial<FilterValues>>>
    className?: string
}

export default function ActiveFilterChips({ filters, categories, setFilters, className }: ActiveFilterChipsProps) {

    const chips: { key: keyof FilterValues; value: string; label: string }[] = []

    console.log(filters.location)
    // categories — only selected ones (filters.categories holds the selected IDs as strings)
    if (filters.categories?.length) {
        filters.categories.forEach(selectedId => {
            const match = categories.find(cat => cat.value === selectedId)
            chips.push({
                key: 'categories',
                value: selectedId,
                label: match?.label ?? selectedId,
            })
        })
    }

    // status — single value
    if (filters.status) {
        chips.push({ key: 'status', value: filters.status, label: filters.status })
    }


    if (filters.purchaseDate) {
        chips.push({ key: 'purchaseDate', value: filters.purchaseDate.toLocaleDateString(), label: filters.purchaseDate.toLocaleDateString() })
    }

    // ticketType — array of strings
    if (filters.ticketType?.length) {
        filters.ticketType.forEach(type => {
            chips.push({ key: 'ticketType', value: type, label: type })
        })
    }

    // userStatus — single value
    if (filters.userStatus) {
        chips.push({ key: 'userStatus', value: filters.userStatus, label: filters.userStatus })
    }

    if (filters.location) {
        chips.push({
            key: 'location',
            value: filters.location.country,
            label: filters.location.label
        })
    }

    // event — single value
    if (filters.event) {
        chips.push({ key: 'event', value: filters.event, label: filters.event })
    }

    // performance — single value
    if (filters.performance) {
        chips.push({ key: 'performance', value: String(filters.performance), label: String(filters.performance) })
    }

    // listingType — single value
    if (filters.listingType) {
        chips.push({ key: 'listingType', value: filters.listingType, label: filters.listingType })
    }

    // sortBy — single value
    if (filters.sortBy) {
        chips.push({ key: 'sortBy', value: filters.sortBy, label: filters.sortBy })
    }

    // transactionStatus — single value
    if (filters.transactionStatus) {
        chips.push({ key: 'transactionStatus', value: filters.transactionStatus, label: filters.transactionStatus })
    }

    // action — array of strings
    if (filters.action?.length) {
        filters.action.forEach(act => {
            chips.push({ key: 'action', value: act, label: act })
        })
    }

    if (!chips.length) return null

    const removeChip = (key: keyof FilterValues, value: string) => {
        setFilters(prev => {
            const current = prev[key]
            if (Array.isArray(current)) {
                return { ...prev, [key]: current.filter(v => v !== value) }
            }
            return { ...prev, [key]: null }
        })
    }

    const resetAll = () => {
        setFilters(prev => ({
            ...prev,
            categories: [],
            status: null,
            ticketType: [],
            priceRange: undefined,
            dateRange: undefined,
            purchaseDate: null,
            userStatus: null,
            location: null,
            event: null,
            performance: null,
            action: [],
            listingType: null,
            sortBy: null,
            transactionStatus: null,
            dateJoined: undefined,
            spendRange: null,
            lastActivity: undefined,
            withdrawalDate: undefined,
            amountRange: null,
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