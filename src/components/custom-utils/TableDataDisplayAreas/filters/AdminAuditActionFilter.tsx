"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"

export const AUDIT_ACTION_OPTIONS = [
    { value: "event_suspend", label: "Event Suspended" },
    { value: "event_unsuspend", label: "Event Unsuspended" },
    { value: "event_feature", label: "Event Featured" },
    { value: "event_delete", label: "Event Deleted" },
    { value: "host_approve", label: "Host Approved" },
    { value: "host_reject", label: "Host Rejected" },
    { value: "host_suspend", label: "Host Suspended" },
    { value: "user_suspend", label: "User Suspended" },
    { value: "user_unsuspend", label: "User Unsuspended" },
    { value: "user_ban", label: "User Banned" },
    { value: "payout_approve", label: "Payout Approved" },
    { value: "payout_decline", label: "Payout Declined" },
    { value: "payout_force", label: "Payout Forced" },
    { value: "withdrawal_approve", label: "Withdrawal Approved" },
    { value: "withdrawal_reject", label: "Withdrawal Rejected" },
    { value: "auto_payout", label: "Auto-Payout" },
    { value: "badge_gift", label: "Badge Gifted" },
    { value: "other", label: "Other" },
]

interface AuditActionFilterProps {
    value?: string | null
    onChange: (value: string | null) => void
    icon?: string
    label?: string
}

export function AdminAuditActionFilter({ value = null, onChange, icon }: AuditActionFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<string | null>(value)

    const handleToggle = (val: string) => {
        const next = selected === val ? null : val
        setSelected(next)
        onChange(next)
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelected(null)
        onChange(null)
    }

    const displayText = !selected
        ? "Action"
        : AUDIT_ACTION_OPTIONS.find(o => o.value === selected)?.label ?? "Action"

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon ?? "hugeicons:cursor-magic-selection-02"}
                    displayText={displayText}
                    hasActiveFilter={!!selected}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={5}
                className={cn(
                    "w-72 z-50 p-2 rounded-xl shadow-xl bg-white border border-brand-neutral-3",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200",
                )}
            >
                <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-brand-neutral-6">
                    Filter by Action
                </p>

                {/* Single scroll wrapping chips + clear */}
                <div className="max-h-64 overflow-y-auto pr-0.5">
                    <div className="flex flex-wrap gap-1.5 py-1">
                        {AUDIT_ACTION_OPTIONS.map(opt => {
                            const isSelected = selected === opt.value
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => handleToggle(opt.value)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all",
                                        isSelected
                                            ? "bg-brand-primary-1 border-brand-primary-6 text-brand-primary-8"
                                            : "bg-brand-neutral-1 border-brand-neutral-3 text-brand-neutral-7 hover:border-brand-primary-4 hover:text-brand-secondary-8"
                                    )}
                                >
                                    {isSelected && (
                                        <Icon icon="mdi:check" className="size-3 shrink-0 text-brand-primary-6" />
                                    )}
                                    {opt.label}
                                </button>
                            )
                        })}
                    </div>

                    {selected && (
                        <>
                            <DropdownMenuSeparator className="my-2 bg-brand-neutral-2" />
                            <button
                                onClick={() => { handleClear(); setIsOpen(false) }}
                                className="w-full text-center py-1.5 text-[11px] font-medium text-brand-neutral-6 hover:text-red-500 transition-colors"
                            >
                                Clear
                            </button>
                        </>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}