'use client'

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import { delay } from "@/helper-fns/delay"


const listingOptions = [
    {
        value: 'active' satisfies ListingType,
        label: 'Listed For Sale',
        icon: 'hugeicons:ticket-01',
        description: 'Primary tickets available for purchase'
    },
    {
        value: 'sold' satisfies ListingType,
        label: 'Already Resold',
        icon: 'solar:ticket-sale-outline',
        description: 'Secondary market resale history'
    },
    {
        value: 'cancelled' satisfies ListingType,
        label: 'Event Cancelled',
        icon: 'solar:ticket-sale-outline',
        description: 'Event was cancelled'
    }
] as const

interface ListingTypeFilterProps {
    value?: string
    onChange: (value: string | undefined) => void
    icon: string
}

export function ListingTypeFilter({ value, onChange, icon }: ListingTypeFilterProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = async (val: string) => {
        // If clicking the same one, we toggle it off (standard filter behavior)
        const nextValue = value === val ? undefined : val
        onChange(nextValue)
        await delay(300)
        setIsOpen(false)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon}
                    displayText="Listing Type"
                    onClick={() => setIsOpen(true)}
                    hasActiveFilter={!!value}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={5}
                className={cn(
                    "w-64 z-200! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)] bg-white border-brand-neutral-2",
                    // Standard company animations
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-4",
                    "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-4",
                    "data-[state=closed]:duration-400"
                )}
            >
                <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-brand-neutral-7">
                    Filter by Listing
                </p>

                <div className="space-y-1">
                    {listingOptions.map((option) => {
                        const isSelected = value === option.value
                        return (
                            <DropdownMenuItem
                                key={option.value}
                                onSelect={(e) => {
                                    e.preventDefault()
                                    handleSelect(option.value)
                                }}
                                className={cn(
                                    "flex items-center gap-2.5 px-2 py-2.5 rounded-lg cursor-pointer transition-colors outline-none",
                                    "focus:bg-brand-neutral-1 active:scale-[0.98]",
                                    isSelected ? "bg-brand-primary-1/40" : ""
                                )}
                            >
                                <div className={cn(
                                    "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                    isSelected ? "bg-brand-primary-6" : "bg-brand-neutral-2"
                                )}>
                                    <Icon
                                        icon={option.icon}
                                        className={cn('size-4', isSelected ? 'text-white' : 'text-brand-neutral-7')}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        'text-xs font-semibold',
                                        isSelected ? 'text-brand-primary-8' : 'text-brand-secondary-9'
                                    )}>
                                        {option.label}
                                    </p>
                                    <p className="text-[10px] text-brand-neutral-6 truncate">
                                        {option.description}
                                    </p>
                                </div>

                                {isSelected && (
                                    <Icon icon="iconamoon:check-bold" className="text-brand-primary-6 size-3 shrink-0" />
                                )}
                            </DropdownMenuItem>
                        )
                    })}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}