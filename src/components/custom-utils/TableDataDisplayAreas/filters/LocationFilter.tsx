'use client'

import { useState, useEffect } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'
import FilterButtonsActions1 from './buttons-and-inputs/FilterActionButtons1'
import { useMediaQuery } from '@/custom-hooks/UseMediaQuery'
import { MobileBottomSheet } from '../../dialogs/EventFilterDropdownMobileBottomSheet'

interface LocationFilterProps {
    value?: string | null
    onChange: (value: string | null) => void
    icon?: string
}

export default function LocationFilter({ value, onChange, icon }: LocationFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const isTablet = useMediaQuery('(min-width: 768px)')
    
    // Internal state to hold the input before "Apply" is clicked
    const [searchInput, setSearchInput] = useState<string>(value || '')

    // Sync internal state if external value changes (e.g., cleared from parent)
    useEffect(() => {
        setSearchInput(value || '')
    }, [value])

    const hasActiveFilter = !!value && value.trim().length > 0

    const displayText = hasActiveFilter ? value : 'Location'

    const handleApply = () => {
        // Only trigger the change if there is actual content
        onChange(searchInput.trim() ? searchInput.trim() : null)
        setIsOpen(false)
    }

    const handleClear = () => {
        setSearchInput('')
        onChange(null)
        // Optionally keep open or close based on UX preference
    }

    const filterContent = (
        <div className="relative w-full">
            <Search 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] w-5 h-5" 
            />
            <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Location here"
                className={cn(
                    "w-full h-14 pl-12 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none",
                    "focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]/10 transition-all",
                    "text-brand-secondary-9 placeholder:text-[#94A3B8]"
                )}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            />
        </div>
    )

    return (
        <>
            {/* Mobile View */}
            {!isTablet && (
                <>
                    <EventFilterTypeBtn 
                        icon={icon}
                        onClick={() => setIsOpen(true)}
                        displayText={displayText} 
                        hasActiveFilter={hasActiveFilter}
                    />

                    <MobileBottomSheet
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Location"
                    >
                        <div className="space-y-6 pt-2">
                            {filterContent}
                            <FilterButtonsActions1
                                onApply={handleApply}
                                onClear={handleClear}
                            />
                        </div>
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet/Desktop View */}
            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <EventFilterTypeBtn 
                            icon={icon}
                            displayText={displayText} 
                            hasActiveFilter={hasActiveFilter}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        className={cn(
                            "w-[25em] p-6 rounded-[24px] shadow-[0px_10px_30px_rgba(0,0,0,0.08)] border-none",
                            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                        )}
                        align="start"
                    >
                        <div className="space-y-8">
                            {filterContent}
                            <FilterButtonsActions1
                                onApply={handleApply}
                                onClear={handleClear}
                            />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}