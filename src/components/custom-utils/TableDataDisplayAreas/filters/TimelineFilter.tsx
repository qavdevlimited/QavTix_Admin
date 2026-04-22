"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const MONTHS = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i).reverse()

const MONTH_SHORT: Record<number, string> = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
}

// ─── Chip Row ────────────────────────────────────────────────────────────────

interface ChipRowProps {
    label: string
    items: { value: number; label: string }[]
    selected: number | null
    onSelect: (value: number | null) => void
    onClear: () => void
}

function ChipRow({ label, items, selected, onSelect, onClear }: ChipRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (selected === null || !scrollRef.current) return
        const el = scrollRef.current.querySelector<HTMLButtonElement>(`[data-value="${selected}"]`)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }, [selected])

    const scrollBy = useCallback((dir: -1 | 1) => {
        scrollRef.current?.scrollBy({ left: dir * 120, behavior: "smooth" })
    }, [])

    return (
        <div className="space-y-2.5">
            {/* Row header */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#666666]">{label}</span>
                <div className="flex items-center gap-2">
                    {selected !== null && (
                        <button
                            onClick={onClear}
                            className="text-xs font-medium text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                    <div className="flex items-center gap-0.5">
                        <button
                            onClick={() => scrollBy(-1)}
                            className="p-1 rounded-md text-brand-neutral-7 hover:text-brand-secondary-8 hover:bg-brand-neutral-2 transition-colors"
                        >
                            <Icon icon="fluent:chevron-left-20-filled" className="size-4" />
                        </button>
                        <button
                            onClick={() => scrollBy(1)}
                            className="p-1 rounded-md text-brand-neutral-7 hover:text-brand-secondary-8 hover:bg-brand-neutral-2 transition-colors"
                        >
                            <Icon icon="fluent:chevron-right-20-filled" className="size-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable chips */}
            <div
                ref={scrollRef}
                className="flex items-center gap-2 overflow-x-auto p-0.5"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {items.map((item) => {
                    const isActive = selected === item.value
                    return (
                        <button
                            key={item.value}
                            data-value={item.value}
                            onClick={() => onSelect(isActive ? null : item.value)}
                            className={cn(
                                "shrink-0 px-4 py-2 rounded-[8px] text-[11px] font-medium transition-all duration-150 outline-none border",
                                isActive
                                    ? "border-brand-primary-7 bg-white text-brand-secondary-8 font-semibold shadow-[0_0_0_1px_var(--color-brand-primary-6)]"
                                    : "border-brand-neutral-5 bg-brand-secondary-1 text-brand-neutral-7 hover:border-brand-primary hover:bg-brand-primary-1 hover:text-brand-secondary-8",
                            )}
                        >
                            {item.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}


interface TimelineSelectorProps {
    year: number
    month: number | null
    onYearChange: (year: number) => void
    onMonthChange: (month: number | null) => void
    className?: string
}

export default function TimelineSelector({
    year,
    month,
    onYearChange,
    onMonthChange,
    className,
}: TimelineSelectorProps) {
    const [open, setOpen] = useState(false)

    const hasFilter = month !== null || year !== CURRENT_YEAR
    const displayText = month ? `${MONTH_SHORT[month]} ${year}` : `${year}`
    const yearItems = YEARS.map((y) => ({ value: y, label: String(y) }))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "flex items-center gap-3 transition-colors outline-none",
                        "px-2 justify-between text-xs rounded-[11px] h-9 min-w-24 font-medium",
                        "bg-white border border-brand-neutral-5",
                        "hover:border-brand-primary hover:bg-brand-primary-1",
                        hasFilter ? "text-brand-neutral-8" : "text-brand-neutral-7",
                        open && "border-brand-primary bg-brand-primary-1",
                        className,
                    )}
                >
                    <Icon icon="fluent:calendar-20-regular" width="20" height="20" className="shrink-0 text-brand-neutral-8" />
                    <span className="truncate">{displayText}</span>
                    <Icon
                        icon="fluent:chevron-down-20-filled"
                        className={cn(
                            "size-5 shrink-0 text-brand-neutral-8 transition-transform duration-200",
                            open && "rotate-180",
                        )}
                    />
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-80 p-5 rounded-2xl border border-brand-neutral-2 shadow-xl bg-white space-y-5"
            >
                {/* Popover header */}
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-secondary-9">Timeline</span>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-1 rounded-md text-brand-neutral-7 hover:text-brand-secondary-8 hover:bg-brand-neutral-2 transition-colors"
                    >
                        <Icon icon="fluent:chevron-up-20-filled" className="size-4" />
                    </button>
                </div>

                <ChipRow
                    label="Year"
                    items={yearItems}
                    selected={year}
                    onSelect={(v) => v !== null && onYearChange(v)}
                    onClear={() => onYearChange(CURRENT_YEAR)}
                />

                <ChipRow
                    label="Month"
                    items={MONTHS}
                    selected={month}
                    onSelect={onMonthChange}
                    onClear={() => onMonthChange(null)}
                />
            </PopoverContent>
        </Popover>
    )
}