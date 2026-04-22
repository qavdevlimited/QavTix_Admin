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
import { searchHosts } from "@/actions/host-management"

interface HostFilterProps {
    value?: string | null
    onChange: (value: string | null) => void
    icon: string
    label?: string
}

export function HostFilter({ value, onChange, icon, label = "Host" }: HostFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [hosts, setHosts] = useState<{ id: string; name: string }[]>([])
    const [loading, setLoading] = useState(false)

    const allCache = useRef<{ id: string; name: string }[]>([])
    const searchCache = useRef<Map<string, { id: string; name: string }[]>>(new Map())
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const fetchData = useCallback(async (query: string) => {
        const key = query.trim().toLowerCase()

        if (key === "" && allCache.current.length > 0) {
            setHosts(allCache.current)
            return
        }
        if (searchCache.current.has(key)) {
            setHosts(searchCache.current.get(key)!)
            return
        }

        setLoading(true)
        try {
            const results = await searchHosts(query || undefined)
            setHosts(results)
            if (key === "") allCache.current = results
            else searchCache.current.set(key, results)
        } catch {
            setHosts([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!isOpen) return
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => fetchData(search), search ? 350 : 100)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [isOpen, search, fetchData])

    useEffect(() => { if (!isOpen) setSearch("") }, [isOpen])

    const selectedHost = hosts.find(h => h.id === value)
    const displayText = value
        ? (selectedHost?.name ?? `Host #${value}`)
        : `All ${label}s`

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon}
                    displayText={displayText}
                    hasActiveFilter={!!value}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className={cn(
                    "w-80 p-4 pb-6 rounded-2xl shadow-xl bg-white border border-brand-neutral-3 z-50",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200",
                )}
            >
                {/* Clear all / filter header */}
                <div className="flex items-center justify-between mb-3">
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

                {/* Search */}
                <div className="relative mb-3">
                    <Icon icon="mage:search" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-neutral-5" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search ${label.toLowerCase()}s...`}
                        className="w-full bg-brand-neutral-1 border border-brand-neutral-5 rounded-lg py-2.5 pl-10 pr-4 text-xs outline-none focus:ring-1 focus:ring-brand-primary-4"
                    />
                    {loading && (
                        <Icon icon="svg-spinners:ring-resize" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-brand-primary-5" />
                    )}
                </div>

                {/* Host list */}
                <div className="max-h-52 overflow-y-auto pr-1 space-y-1">
                    {/* "All" option */}
                    <button
                        onClick={() => { onChange(null); setIsOpen(false) }}
                        className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-xs transition-colors",
                            !value
                                ? "bg-brand-primary-1 text-brand-primary-6 font-semibold"
                                : "text-brand-neutral-7 hover:bg-brand-neutral-2",
                        )}
                    >
                        All {label}s
                    </button>

                    {hosts.map((host) => (
                        <button
                            key={host.id}
                            onClick={() => { onChange(host.id); setIsOpen(false) }}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2",
                                value === host.id
                                    ? "bg-brand-primary-1 text-brand-primary-6 font-semibold"
                                    : "text-brand-neutral-8 hover:bg-brand-neutral-2",
                            )}
                        >
                            <Icon icon="hugeicons:student-card" className="size-3.5 shrink-0 opacity-70" />
                            <span className="truncate">{host.name}</span>
                            {value === host.id && (
                                <Icon icon="iconamoon:check-bold" className="ml-auto size-3 text-brand-primary-6 shrink-0" />
                            )}
                        </button>
                    ))}

                    {!loading && hosts.length === 0 && (
                        <p className="py-6 text-center text-xs text-brand-neutral-5">
                            {search ? `No hosts matching "${search}"` : "No hosts found"}
                        </p>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
