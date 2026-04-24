'use client'

import { useState, useRef, useEffect } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { Country, State, City } from "country-state-city"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"


interface LocationResult {
    label: string
    country: string
    city: string
    state?: string
    type: 'city' | 'state'
    flag: string
}

interface LocationSearchFilterProps {
    value?: LocationValue | null
    onChange: (value: LocationValue | null) => void
    icon?: string
}

function buildResults(query: string): LocationResult[] {
    if (!query || query.trim().length < 2) return []
    const q = query.trim().toLowerCase()

    const results: LocationResult[] = []

    const countries = Country.getAllCountries()

    for (const country of countries) {
        // Search cities
        const cities = City.getCitiesOfCountry(country.isoCode) ?? []
        for (const city of cities) {
            if (city.name.toLowerCase().startsWith(q)) {
                const state = State.getStateByCodeAndCountry(city.stateCode, country.isoCode)
                results.push({
                    label: `${city.name}, ${state?.name ?? city.stateCode}, ${country.name}`,
                    country: country.isoCode,
                    city: city.name,
                    state: state?.name,
                    type: 'city',
                    flag: country.flag ?? '',
                })
                if (results.length >= 30) break
            }
        }

        // Search states too
        if (results.length < 30) {
            const states = State.getStatesOfCountry(country.isoCode) ?? []
            for (const state of states) {
                if (state.name.toLowerCase().startsWith(q)) {
                    results.push({
                        label: `${state.name}, ${country.name}`,
                        country: country.isoCode,
                        city: state.name,
                        state: state.name,
                        type: 'state',
                        flag: country.flag ?? '',
                    })
                }
            }
        }

        if (results.length >= 30) break
    }

    // Deduplicate and cap
    const seen = new Set<string>()
    return results.filter(r => {
        if (seen.has(r.label)) return false
        seen.add(r.label)
        return true
    }).slice(0, 20)
}

export default function LocationFilter({ value, onChange, icon = "hugeicons:location-01" }: LocationSearchFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [results, setResults] = useState<LocationResult[]>([])
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (!search.trim()) {
            setResults([])
            return
        }

        debounceRef.current = setTimeout(() => {
            setResults(buildResults(search))
        }, 250)

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [search])

    // Reset on close
    useEffect(() => {
        if (!isOpen) setSearch("")
    }, [isOpen])

    const handleSelect = (result: LocationResult) => {
        const value = {
            country: result.country,
            city: result.city,
            state: result.state,
            label: result.label,
        }
        onChange(value)
        setIsOpen(false)
    }
    const handleClear = () => {
        onChange(null)
        setSearch("")
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon}
                    displayText={value ? value.label.split(',')[0] : "All Locations"}
                    hasActiveFilter={!!value}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className={cn(
                    "w-80 p-4 rounded-2xl shadow-xl bg-white border-none z-50",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                    "data-[state=open]:duration-300 data-[state=open]:zoom-in-95",
                    "data-[state=open]:slide-in-from-top-2",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                    "data-[state=closed]:duration-200 data-[state=closed]:zoom-out-95",
                    "data-[state=closed]:slide-out-to-top-2",
                )}
            >
                {/* Search input */}
                <div className="relative mb-3">
                    <Icon
                        icon="mage:search"
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-neutral-7"
                    />
                    <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Enter locations here"
                        className="w-full bg-brand-neutral-1 rounded-xl py-3 pl-10 pr-4 text-xs placeholder:text-xs outline-none focus:ring-1 focus:ring-brand-primary-5 placeholder:text-brand-neutral-6"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <Icon icon="lucide:x" className="size-3.5 text-brand-neutral-7" />
                        </button>
                    )}
                </div>

                {/* Results list */}
                <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
                    {results.length > 0 ? (
                        results.map((result, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelect(result)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                                    value?.label === result.label
                                        ? "bg-brand-primary-1 text-brand-primary-6"
                                        : "hover:bg-brand-neutral-1 text-brand-neutral-8"
                                )}
                            >
                                {/* Flag / icon */}
                                <span className="text-base shrink-0">
                                    {result.flag || '📍'}
                                </span>

                                <div className="min-w-0">
                                    <p className={cn(
                                        "text-xs font-medium truncate",
                                        value?.label === result.label
                                            ? "text-brand-primary-6"
                                            : "text-brand-secondary-8"
                                    )}>
                                        {result.type === 'city'
                                            ? result.city
                                            : result.state}
                                    </p>
                                    <p className="text-[10px] text-brand-neutral-7 truncate">
                                        {result.label.split(',').slice(1).join(',').trim()}
                                    </p>
                                </div>

                                {/* Type badge */}
                                <span className={cn(
                                    "ml-auto shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
                                    result.type === 'city'
                                        ? "bg-brand-accent-1 text-brand-accent-7"
                                        : "bg-brand-primary-1 text-brand-primary-6"
                                )}>
                                    {result.type === 'city' ? 'City' : 'State'}
                                </span>
                            </button>
                        ))
                    ) : search.trim().length >= 2 ? (
                        <p className="py-8 text-center text-xs text-brand-neutral-7">
                            No locations found for "{search}"
                        </p>
                    ) : (
                        <p className="py-8 text-center text-xs text-brand-neutral-7">
                            Start typing to search locations
                        </p>
                    )}
                </div>



                <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-neutral-2">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex-1 h-10 text-brand-secondary-8 max-w-36 border border-brand-neutral-6 rounded-full font-medium text-sm transition-all hover:bg-brand-neutral-2 hover:shadow-sm active:scale-[0.98]"
                    >
                        Clear
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}