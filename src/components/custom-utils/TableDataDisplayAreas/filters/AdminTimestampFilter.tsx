"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import FilterButtonsActions1 from "./buttons-and-inputs/FilterActionButtons1"
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, parseISO } from "date-fns"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

// ─── Quick presets ────────────────────────────────────────────────────────────

const QUICK_PRESETS = [
    { label: "Now",        getValue: () => new Date() },
    { label: "Today start", getValue: () => startOfDay(new Date()) },
    { label: "Today end",   getValue: () => endOfDay(new Date()) },
    { label: "Week start",  getValue: () => startOfWeek(new Date(), { weekStartsOn: 1 }) },
    { label: "Week end",    getValue: () => endOfWeek(new Date(), { weekStartsOn: 1 }) },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Time Picker ─────────────────────────────────────────────────────────────

function TimePicker({
    hour, minute, period,
    onHourChange, onMinuteChange, onPeriodChange,
}: {
    hour: number; minute: number; period: "AM" | "PM"
    onHourChange: (h: number) => void
    onMinuteChange: (m: number) => void
    onPeriodChange: (p: "AM" | "PM") => void
}) {
    const inputClass = cn(
        "w-12 text-center text-sm font-semibold text-brand-secondary-9",
        "bg-white border border-brand-neutral-3 rounded-lg py-1.5",
        "focus:outline-none focus:border-brand-primary-5 focus:ring-1 focus:ring-brand-primary-3 transition-colors",
    )
    return (
        <div className="flex items-center justify-center gap-1.5">
            <input type="number" min={1} max={12}
                value={String(hour).padStart(2, "0")}
                onChange={(e) => onHourChange(Math.min(12, Math.max(1, Number(e.target.value))))}
                className={inputClass}
            />
            <span className="text-brand-neutral-6 font-bold text-sm select-none">:</span>
            <input type="number" min={0} max={59}
                value={String(minute).padStart(2, "0")}
                onChange={(e) => onMinuteChange(Math.min(59, Math.max(0, Number(e.target.value))))}
                className={inputClass}
            />
            <div className="flex items-center bg-brand-neutral-2 rounded-lg p-0.5 ml-1">
                {(["AM", "PM"] as const).map((p) => (
                    <button key={p} type="button" onClick={() => onPeriodChange(p)}
                        className={cn(
                            "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                            period === p
                                ? "bg-brand-primary-6 text-white shadow-sm"
                                : "text-brand-neutral-7 hover:text-brand-secondary-8",
                        )}
                    >{p}</button>
                ))}
            </div>
        </div>
    )
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface AdminTimestampFilterProps {
    value?: Date | null
    onChange: (value: Date | null) => void
    icon?: string
    label?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AdminTimestampFilter({
    value,
    onChange,
    icon,
    label = "Timestamp",
}: AdminTimestampFilterProps) {
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
        setSelectedDay(undefined)
        setHour(to12Hour(now.getHours()).hour)
        setMinute(now.getMinutes())
        setPeriod(to12Hour(now.getHours()).period)
        onChange(null)
        setIsOpen(false)
    }

    const displayText = value
        ? format(value, "MMM dd, h:mm a")
        : label

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon ?? "solar:calendar-linear"}
                    displayText={displayText}
                    hasActiveFilter={!!value}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className={cn(
                    "w-72 z-50 p-4 rounded-xl shadow-xl bg-white border border-brand-neutral-3",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300 data-[state=open]:zoom-in-95",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200 data-[state=closed]:zoom-out-95",
                )}
            >
                <div className="space-y-4">

                    {/* Quick presets */}
                    <div className="flex flex-wrap gap-1.5">
                        {QUICK_PRESETS.map(preset => {
                            const val = preset.getValue()
                            const draft = buildDraft()
                            const isActive = draft ? Math.abs(draft.getTime() - val.getTime()) < 60_000 : false
                            return (
                                <button key={preset.label} type="button"
                                    onClick={() => handlePresetSelect(val)}
                                    className={cn(
                                        "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                                        isActive
                                            ? "bg-brand-primary-6 text-white border-brand-primary-6"
                                            : "bg-white border-brand-neutral-3 text-brand-neutral-7 hover:border-brand-primary-4 hover:text-brand-secondary-8",
                                    )}
                                >{preset.label}</button>
                            )
                        })}
                    </div>

                    <div className="h-px bg-brand-neutral-2" />

                    {/* Day picker */}
                    <DayPicker
                        mode="single"
                        selected={selectedDay}
                        onSelect={setSelectedDay}
                        className="p-0 w-full"
                        classNames={{
                            months: "w-full",
                            month: "w-full",
                            caption: "flex justify-between items-center mb-2 px-1",
                            caption_label: "text-xs font-semibold text-brand-secondary-8",
                            nav: "flex gap-1",
                            nav_button: cn(
                                "size-6 flex items-center justify-center rounded-lg",
                                "border border-brand-neutral-3 text-brand-neutral-6",
                                "hover:bg-brand-neutral-2 hover:text-brand-secondary-8 transition-colors",
                            ),
                            table: "w-full border-collapse",
                            head_row: "grid grid-cols-7 mb-1",
                            head_cell: "text-center text-[10px] font-medium text-brand-neutral-5 py-1",
                            row: "grid grid-cols-7",
                            cell: "flex items-center justify-center",
                            day: cn(
                                "size-7 flex items-center justify-center rounded-lg text-[11px] font-medium",
                                "text-brand-secondary-8 hover:bg-brand-primary-1 hover:text-brand-primary-7 transition-colors",
                            ),
                            day_selected: "!bg-brand-primary-6 !text-white hover:!bg-brand-primary-7",
                            day_today: "border border-brand-primary-4 text-brand-primary-6 font-semibold",
                            day_outside: "text-brand-neutral-4 opacity-50",
                            day_disabled: "opacity-30 cursor-not-allowed",
                        }}
                    />

                    <div className="h-px bg-brand-neutral-2" />

                    {/* Time picker */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-medium text-brand-neutral-5 text-center uppercase tracking-wider">Time</p>
                        <TimePicker
                            hour={hour} minute={minute} period={period}
                            onHourChange={setHour}
                            onMinuteChange={setMinute}
                            onPeriodChange={setPeriod}
                        />
                    </div>

                    {/* Preview */}
                    {selectedDay && (
                        <div className="rounded-lg bg-brand-primary-1 border border-brand-primary-2 px-3 py-2 text-center">
                            <p className="text-xs text-brand-primary-7 font-semibold">
                                {format(buildDraft()!, "MMM dd, yyyy · h:mm a")}
                            </p>
                        </div>
                    )}

                    <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
