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

export type PackageSlug = "basic" | "standard" | "advanced" | "premium" | "pro" | "enterprise"

interface PackageOption {
    slug: PackageSlug
    label: string
    icon: string
    color: string
}

const PACKAGE_OPTIONS: PackageOption[] = [
    { slug: "basic", label: "Basic", icon: "hugeicons:package-01", color: "text-emerald-600" },
    { slug: "standard", label: "Standard", icon: "hugeicons:package-02", color: "text-blue-600" },
    { slug: "advanced", label: "Advanced", icon: "hugeicons:package-03", color: "text-violet-600" },
]

interface PackageFilterProps {
    value?: string | null
    onChange: (value: string | null) => void
    icon?: string
    label?: string
    /** Restrict which slugs are shown */
    slugs?: PackageSlug[]
}

export function PackageFilter({
    value,
    onChange,
    icon,
    label = "Package",
    slugs,
}: PackageFilterProps) {
    const [isOpen, setIsOpen] = useState(false)

    const options = slugs
        ? PACKAGE_OPTIONS.filter((o) => slugs.includes(o.slug))
        : PACKAGE_OPTIONS

    const selected = options.find((o) => o.slug === value)
    const displayText = selected ? selected.label : `All ${label}s`

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon ?? "hugeicons:package-01"}
                    displayText={displayText}
                    hasActiveFilter={!!value}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className={cn(
                    "w-64 p-3 rounded-2xl shadow-xl bg-white border border-brand-neutral-3 z-50",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200",
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-xs font-medium text-brand-secondary-9">Filter by {label}</p>
                    {value && (
                        <button
                            onClick={() => { onChange(null); setIsOpen(false) }}
                            className="text-[11px] text-red-500 hover:text-red-600 font-medium"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* All option */}
                <button
                    onClick={() => { onChange(null); setIsOpen(false) }}
                    className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-xs transition-colors mb-1",
                        !value
                            ? "bg-brand-primary-1 text-brand-primary-6 font-semibold"
                            : "text-brand-neutral-7 hover:bg-brand-neutral-2",
                    )}
                >
                    All {label}s
                </button>

                <div className="space-y-0.5">
                    {options.map((opt) => (
                        <button
                            key={opt.slug}
                            onClick={() => { onChange(opt.slug); setIsOpen(false) }}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center gap-2",
                                value === opt.slug
                                    ? "bg-brand-primary-1 text-brand-primary-6 font-semibold"
                                    : "text-brand-neutral-8 hover:bg-brand-neutral-2",
                            )}
                        >
                            <Icon icon={opt.icon} className={cn("size-3.5 shrink-0", opt.color)} />
                            <span className="flex-1 truncate">{opt.label}</span>
                            {value === opt.slug && (
                                <Icon icon="iconamoon:check-bold" className="size-3 text-brand-primary-6 shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
