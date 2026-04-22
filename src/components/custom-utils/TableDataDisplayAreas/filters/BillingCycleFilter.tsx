"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"

type BillingCycle = "monthly" | "annual"

const OPTIONS: { value: BillingCycle; label: string; icon: string }[] = [
    { value: "monthly", label: "Monthly",  icon: "hugeicons:calendar-03" },
    { value: "annual",  label: "Annual",   icon: "hugeicons:calendar-01" },
]

interface BillingCycleFilterProps {
    value?: string | null
    onChange: (value: string | null) => void
    icon?: string
    label?: string
}

export function BillingCycleFilter({ value, onChange, icon, label = "Billing Cycle" }: BillingCycleFilterProps) {
    const [isOpen, setIsOpen] = useState(false)

    const selected = OPTIONS.find((o) => o.value === value)
    const displayText = selected ? selected.label : "All Cycles"

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon ?? "hugeicons:calendar-03"}
                    displayText={displayText}
                    hasActiveFilter={!!value}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className={cn(
                    "w-52 p-3 rounded-2xl shadow-xl bg-white border border-brand-neutral-3 z-50",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200",
                )}
            >
                <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-xs font-medium text-brand-secondary-9">{label}</p>
                    {value && (
                        <button
                            onClick={() => { onChange(null); setIsOpen(false) }}
                            className="text-[11px] text-red-500 hover:text-red-600 font-medium"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <button
                    onClick={() => { onChange(null); setIsOpen(false) }}
                    className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-xs transition-colors mb-1",
                        !value
                            ? "bg-brand-primary-1 text-brand-primary-6 font-semibold"
                            : "text-brand-neutral-7 hover:bg-brand-neutral-2",
                    )}
                >
                    All Cycles
                </button>

                {OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => { onChange(opt.value); setIsOpen(false) }}
                        className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center gap-2",
                            value === opt.value
                                ? "bg-brand-primary-1 text-brand-primary-6 font-semibold"
                                : "text-brand-neutral-8 hover:bg-brand-neutral-2",
                        )}
                    >
                        <Icon icon={opt.icon} className="size-3.5 shrink-0 text-brand-neutral-6" />
                        <span className="flex-1">{opt.label}</span>
                        {value === opt.value && (
                            <Icon icon="iconamoon:check-bold" className="size-3 text-brand-primary-6 shrink-0" />
                        )}
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
