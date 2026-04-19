'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'
import FilterButtonsActions1 from './buttons-and-inputs/FilterActionButtons1'
import { MobileBottomSheet } from '../../dialogs/EventFilterDropdownMobileBottomSheet'
import { useMediaQuery } from '@/custom-hooks/UseMediaQuery'
import { QuantityRangeInputs } from './buttons-and-inputs/QuantityRangeInputs'
import { QuickQuantityButtons } from './buttons-and-inputs/QuickQuantityButtons'

interface QuantityRange {
    min: number
    max: number
}

interface QuantityFilterProps {
    value?: QuantityRange | null
    onChange: (value: QuantityRange | null) => void
    icon?: string
    label?: string
}

export default function QuantityFilter({
    value,
    onChange,
    icon,
    label = 'Quantity',
}: QuantityFilterProps) {
    
    const [isOpen, setIsOpen] = useState(false)
    const isTablet = useMediaQuery('(min-width: 768px)')
    
    const defaultMax = 100
    const [quantityRange, setQuantityRange] = useState<QuantityRange>(
        value || { min: 1, max: 10 }
    )

    const hasActiveFilter = value && (value.min > 1 || value.max < defaultMax)
    const displayText = hasActiveFilter
        ? `${value.min} - ${value.max} pcs`
        : label

    const handleApply = () => {
        onChange(quantityRange)
        setIsOpen(false)
    }

    const handleClear = () => {
        setQuantityRange({ min: 1, max: 10 })
        onChange(null)
    }

    const handleQuickQuantity = (qty: number) => {
        setQuantityRange({ min: 1, max: qty })
    }

    const handleSliderChange = (values: number[]) => {
        setQuantityRange({ min: values[0], max: values[1] })
    }

    const filterContent = (
        <>
            <QuickQuantityButtons
                selectedMax={quantityRange.max}
                onSelect={handleQuickQuantity}
            />

            <div className="pt-4 pb-2">
                <Slider
                    min={1}
                    max={defaultMax}
                    step={1}
                    value={[quantityRange.min, quantityRange.max]}
                    onValueChange={handleSliderChange}
                />
            </div>

            <QuantityRangeInputs
                min={quantityRange.min}
                max={quantityRange.max}
                onMinChange={(v) => setQuantityRange(prev => ({ ...prev, min: v }))}
                onMaxChange={(v) => setQuantityRange(prev => ({ ...prev, max: v }))}
            />

            <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
        </>
    )

    return (
        <>
            {!isTablet && (
                <>
                    <EventFilterTypeBtn 
                        onClick={() => setIsOpen(true)}
                        displayText={displayText} 
                        icon={icon}
                        hasActiveFilter={!!hasActiveFilter}
                    />

                    <MobileBottomSheet
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Quantity"
                    >
                        {filterContent}
                    </MobileBottomSheet>
                </>
            )}

            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <EventFilterTypeBtn 
                                displayText={displayText} 
                                icon={icon}
                                hasActiveFilter={!!hasActiveFilter}
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        className={cn(
                            "w-[25em] z-100 p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
                            "data-[state=open]:animate-in",
                            "data-[state=open]:fade-in-0",
                            "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
                            "data-[state=open]:zoom-in-90",
                            "data-[state=open]:slide-in-from-top-4",
                            "data-[state=closed]:animate-out",
                            "data-[state=closed]:fade-out-0",
                            "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
                            "data-[state=closed]:zoom-out-90",
                            "data-[state=closed]:slide-out-to-top-4"
                        )}
                        align="start"
                    >
                        <div className="space-y-6">
                            {filterContent}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}