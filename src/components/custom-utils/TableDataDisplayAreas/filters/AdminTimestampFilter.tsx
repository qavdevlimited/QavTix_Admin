'use client'

import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'
import { useMediaQuery } from '@/custom-hooks/UseMediaQuery'
import FilterButtonsActions1 from './buttons-and-inputs/FilterActionButtons1'
import { MobileBottomSheet } from '../../dropdown/EventFilterDropdownMobileBottomSheet'
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'
import { Icon } from '@iconify/react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimestampFilterProps {
    value?: Date | null
    onChange: (value: Date | null) => void
    filterFor?: "homepage" | "eventPage"
    label?: string
}

// ─── Quick presets ────────────────────────────────────────────────────────────

const QUICK_PRESETS = [
    { label: "Now", getValue: () => new Date() },
    { label: "Today start", getValue: () => startOfDay(new Date()) },
    { label: "Today end", getValue: () => endOfDay(new Date()) },
    { label: "Week start", getValue: () => startOfWeek(new Date(), { weekStartsOn: 1 }) },
    { label: "Week end", getValue: () => endOfWeek(new Date(), { weekStartsOn: 1 }) },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function to12Hour(h: number): { hour: number; period: "AM" | "PM" } {
    if (h === 0) return { hour: 12, period: "AM" }
    if (h < 12) return { hour: h, period: "AM" }
    if (h === 12) return { hour: 12, period: "PM" }
    return { hour: h - 12, period: "PM" }
}

function to24Hour(hour: number, period: "AM" | "PM"): number {
    if (period === "AM") return hour === 12 ? 0 : hour
    return hour === 12 ? 12 : hour + 12
}

function formatTimestamp(date: Date): string {
    return format(date, "MMM dd, h:mm a")
}

// ─── Quick Preset Buttons ─────────────────────────────────────────────────────

function QuickPresetButtons({
    selected,
    onSelect,
}: {
    selected: Date | null
    onSelect: (date: Date) => void
}) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {QUICK_PRESETS.map((preset) => {
                const val = preset.getValue()
                const isActive = selected
                    ? Math.abs(selected.getTime() - val.getTime()) < 60_000
                    : false
                return (
                    <button
                        key={preset.label}
                        type="button"
                        onClick={() => onSelect(val)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            isActive
                                ? "bg-brand-primary-6 text-white border-brand-primary-6"
                                : "bg-brand-neutral-1 border-brand-neutral-3 text-brand-neutral-7 hover:border-brand-primary-4 hover:text-brand-secondary-8"
                        )}
                    >
                        {preset.label}
                    </button>
                )
            })}
        </div>
    )
}

// ─── Time Picker ──────────────────────────────────────────────────────────────

function TimeSegment({
    value,
    label,
    min,
    max,
    onChange,
}: {
    value: number
    label: string
    min: number
    max: number
    onChange: (v: number) => void
}) {
    const increment = () => onChange(value >= max ? min : value + 1)
    const decrement = () => onChange(value <= min ? max : value - 1)

    return (
        <div className="flex flex-col items-center gap-1">
            <button
                type="button"
                onClick={increment}
                className="w-9 h-7 flex items-center justify-center rounded-md text-brand-neutral-8 hover:text-brand-secondary-8 hover:bg-brand-neutral-2 transition-colors"
            >
                <Icon icon="fluent:chevron-up-20-filled" className="size-3.5" />
            </button>

            {/* Hidden native input for manual typing, styled to hide spinners */}
            <input
                type="number"
                min={min}
                max={max}
                value={String(value).padStart(2, "0")}
                onChange={(e) => {
                    const v = Number(e.target.value)
                    if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)))
                }}
                className={cn(
                    "w-11 h-10 text-center text-sm font-normal text-brand-secondary-8",
                    "bg-brand-neutral-1 border border-brand-neutral-3 rounded-lg",
                    "focus:outline-none focus:border-brand-primary-4 focus:ring-1 focus:ring-brand-primary-3 transition-colors",
                    // hide native spin buttons cross-browser
                    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                )}
            />

            <span className="text-[10px] text-brand-neutral-7 font-normal tracking-wide uppercase">
                {label}
            </span>

            <button
                type="button"
                onClick={decrement}
                className="w-9 h-7 flex items-center justify-center rounded-md text-brand-neutral-5 hover:text-brand-secondary-8 hover:bg-brand-neutral-2 transition-colors"
            >
                <Icon icon="fluent:chevron-down-20-filled" className="size-3.5" />
            </button>
        </div>
    )
}

function TimePicker({
    hour, minute, period,
    onHourChange, onMinuteChange, onPeriodChange,
}: {
    hour: number
    minute: number
    period: "AM" | "PM"
    onHourChange: (h: number) => void
    onMinuteChange: (m: number) => void
    onPeriodChange: (p: "AM" | "PM") => void
}) {
    return (
        <div className="flex items-center justify-center gap-3">
            <TimeSegment value={hour} label="hr" min={1} max={12} onChange={onHourChange} />

            {/* Separator */}
            <span className="text-brand-neutral-7 text-lg font-light select-none mb-5">:</span>

            <TimeSegment value={minute} label="min" min={0} max={59} onChange={onMinuteChange} />

            {/* AM / PM */}
            <div className="flex flex-col gap-1.5 mb-5">
                {(["AM", "PM"] as const).map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPeriodChange(p)}
                        className={cn(
                            "w-12 h-[2.1rem] text-xs font-medium rounded-lg border transition-all",
                            period === p
                                ? "bg-brand-primary-6 text-white border-brand-primary-6 shadow-sm"
                                : "bg-brand-neutral-1 border-brand-neutral-4 text-brand-neutral-6 hover:border-brand-primary-4 hover:text-brand-secondary-8"
                        )}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TimestampFilter({
    value,
    onChange,
    filterFor = "homepage",
    label = "Timestamp",
}: TimestampFilterProps) {
    const isTablet = useMediaQuery("(min-width: 768px)")
    const [isOpen, setIsOpen] = useState(false)

    const now = new Date()
    const { hour: initHour, period: initPeriod } = to12Hour(value?.getHours() ?? now.getHours())

    const [selectedDay, setSelectedDay] = useState<Date | undefined>(value ?? undefined)
    const [hour, setHour] = useState(initHour)
    const [minute, setMinute] = useState(value?.getMinutes() ?? now.getMinutes())
    const [period, setPeriod] = useState<"AM" | "PM">(initPeriod)

    const buildDraft = (day: Date | undefined = selectedDay): Date | null => {
        if (!day) return null
        const d = new Date(day)
        d.setHours(to24Hour(hour, period), minute, 0, 0)
        return d
    }

    const handlePresetSelect = (date: Date) => {
        const { hour: h, period: p } = to12Hour(date.getHours())
        setSelectedDay(date)
        setHour(h)
        setMinute(date.getMinutes())
        setPeriod(p)
    }

    const handleApply = () => {
        onChange(buildDraft())
        setIsOpen(false)
    }

    const handleClear = () => {
        const n = new Date()
        const { hour: h, period: p } = to12Hour(n.getHours())
        setSelectedDay(undefined)
        setHour(h)
        setMinute(n.getMinutes())
        setPeriod(p)
        onChange(null)
        setIsOpen(false)
    }

    const hasActiveFilter = !!value
    const displayText = hasActiveFilter ? formatTimestamp(value!) : label
    const triggerVariant = filterFor === "homepage" ? "default" : "compact"

    const filterContent = (
        <div className="space-y-4">
            <QuickPresetButtons selected={buildDraft()} onSelect={handlePresetSelect} />

            <div className="h-px bg-brand-neutral-3" />

            <Calendar
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                className="p-0 w-full"
            />

            <div className="h-px bg-brand-neutral-3" />

            {/* Time section */}
            <div className="space-y-3">
                <p className="text-[11px] font-normal text-brand-secondary-7 text-center uppercase tracking-widest">
                    Select Time
                </p>
                <TimePicker
                    hour={hour} minute={minute} period={period}
                    onHourChange={setHour}
                    onMinuteChange={setMinute}
                    onPeriodChange={setPeriod}
                />
            </div>

            {/* Preview */}
            {selectedDay && (
                <div className="rounded-lg bg-brand-primary-1 border border-brand-primary-3 px-3 py-2.5 text-center">
                    <p className="text-xs text-brand-primary-7 font-normal">
                        {formatTimestamp(buildDraft()!)}
                    </p>
                </div>
            )}
        </div>
    )

    const dropdownClasses = cn(
        "w-[22em] z-100! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
        "data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-4",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
        "data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-top-4"
    )

    return (
        <>
            {!isTablet && (
                <>
                    <EventFilterTypeBtn
                        onClick={() => setIsOpen(true)}
                        displayText={displayText}
                        hasActiveFilter={hasActiveFilter}
                    />
                    <MobileBottomSheet
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Timestamp"
                    >
                        {filterContent}
                        <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
                    </MobileBottomSheet>
                </>
            )}

            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <EventFilterTypeBtn
                                onClick={() => setIsOpen(true)}
                                displayText={displayText}
                                hasActiveFilter={hasActiveFilter}
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={dropdownClasses} align="start">
                        <div className="space-y-4">
                            {filterContent}
                            <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}