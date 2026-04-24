"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import FilterButtonsActions1 from "./buttons-and-inputs/FilterActionButtons1"
import { useMediaQuery } from "@/custom-hooks/UseMediaQuery"
import { MobileBottomSheet } from "../../dropdown/EventFilterDropdownMobileBottomSheet"
import { useParams } from "next/navigation"
import { fetchTicketTypes } from "@/actions/filters"
import { formatPrice } from "@/helper-fns/formatPrice"
import { useAppSelector } from "@/lib/redux/hooks"


export interface TicketType {
    id: number
    ticket_type: string
    price: string
    quantity: number
    sold_count: number
}

interface TicketTypeFilterProps {
    value?: TicketType[]
    onChange: (value: TicketType[]) => void
    icon?: string
    label?: string
}


export function TicketTypeFilter({
    value = [],
    onChange,
    icon,
    label = "Ticket Type",
}: TicketTypeFilterProps) {
    const isTablet = useMediaQuery("(min-width: 768px)")
    const [isOpen, setIsOpen] = useState(false)
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<TicketType[]>(value)

    const cache = useRef<Map<string, TicketType[]>>(new Map())
    const hasFetched = useRef(false)
    const { event_id: paramsEventId } = useParams()
    const eventId = paramsEventId as string

    const currency = useAppSelector(store => store.authUser.user?.currency)

    const loadTicketTypes = useCallback(async () => {
        if (cache.current.has(eventId)) {
            setTicketTypes(cache.current.get(eventId)!)
            return
        }
        setLoading(true)
        const result = await fetchTicketTypes(eventId)
        cache.current.set(eventId, result)
        setTicketTypes(result)
        setLoading(false)
    }, [eventId])

    // Fetch on first open only
    useEffect(() => {
        if (!isOpen || hasFetched.current) return
        hasFetched.current = true
        loadTicketTypes()
    }, [isOpen, loadTicketTypes])


    const hasActiveFilter = selected.length > 0

    const displayText = (() => {
        if (!hasActiveFilter) return label
        if (selected.length === 1) return selected[0].ticket_type
        return `${selected.length} types`
    })()


    const handleToggle = (type: TicketType) => {
        setSelected((prev) =>
            prev.some((t) => t.id === type.id)
                ? prev.filter((t) => t.id !== type.id)
                : [...prev, type]
        )
    }

    const handleApply = () => {
        onChange(selected)
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelected([])
        onChange([])
    }


    const filterContent = (
        <div className="space-y-2">
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Icon icon="svg-spinners:ring-resize" className="size-5 text-brand-primary-5" />
                </div>
            ) : ticketTypes.length === 0 ? (
                <p className="py-6 text-center text-xs text-brand-neutral-5">
                    No ticket types found
                </p>
            ) : (
                ticketTypes.map((type) => {
                    const isSelected = selected.some((t) => t.id === type.id)
                    const available = type.quantity - type.sold_count
                    return (
                        <button
                            key={type.id}
                            onClick={() => handleToggle(type)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left",
                                isSelected
                                    ? "border-brand-primary-6 bg-brand-primary-1 shadow-[0px_5.8px_23.17px_0px_#3326AE14]"
                                    : "border-brand-neutral-3 hover:border-brand-primary-3 hover:bg-brand-neutral-1"
                            )}
                        >
                            <div className={cn(
                                "size-4 shrink-0 rounded-[4px] border-2 flex items-center justify-center transition-colors",
                                isSelected ? "border-brand-primary-6 bg-brand-primary-6" : "border-brand-neutral-4 bg-white"
                            )}>
                                {isSelected && <Icon icon="mdi:check" className="size-2.5 text-white" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-semibold truncate",
                                    isSelected ? "text-brand-primary-8" : "text-brand-secondary-9"
                                )}>
                                    {type.ticket_type}
                                </p>
                                <p className="text-xs text-brand-neutral-6 mt-0.5">{available} left</p>
                            </div>

                            <span className={cn(
                                "text-xs font-semibold shrink-0",
                                isSelected ? "text-brand-primary-6" : "text-brand-neutral-7"
                            )}>
                                {formatPrice(Number(type.price), currency)}
                            </span>
                        </button>
                    )
                })
            )}
        </div>
    )

    const dropdownClasses = cn(
        "w-72 p-4 rounded-2xl shadow-xl bg-white border-none z-50",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
        "data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-4",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
        "data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-top-4"
    )

    return (
        <>
            {/* Mobile — Bottom Sheet */}
            {!isTablet && (
                <>
                    <EventFilterTypeBtn
                        onClick={() => setIsOpen(true)}
                        displayText={displayText}
                        hasActiveFilter={hasActiveFilter}
                        icon={icon}
                    />
                    <MobileBottomSheet
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Ticket Type"
                    >
                        {filterContent}
                        <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet — Dropdown */}
            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <EventFilterTypeBtn
                            displayText={displayText}
                            hasActiveFilter={hasActiveFilter}
                            icon={icon}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" sideOffset={8} className={dropdownClasses}>
                        <div className="space-y-4">
                            <p className="text-xs font-semibold text-brand-neutral-6 uppercase tracking-wide px-1">
                                Ticket Type
                            </p>
                            {filterContent}
                            <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}