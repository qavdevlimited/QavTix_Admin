'use client'

import { cn } from '@/lib/utils'

interface QuickQuantityButtonsProps {
    selectedMax: number
    onSelect: (value: number) => void
}

export function QuickQuantityButtons({
    selectedMax,
    onSelect,
}: QuickQuantityButtonsProps) {
    const quickQuantities = [
        { label: 'Single (1)', value: 1 },
        { label: 'Small (10)', value: 10 },
        { label: 'Medium (50)', value: 50 },
        { label: 'Large (100+)', value: 100 },
    ]

    return (
        <div className="flex flex-wrap gap-3">
            {quickQuantities.map((item) => {
                const isSelected = selectedMax === item.value

                return (
                    <button
                        key={item.value}
                        onClick={() => onSelect(item.value)}
                        className={cn(
                            'px-4 py-3 rounded-lg h-10 flex justify-center items-center text-xs font-medium transition-all',
                            isSelected
                                ? 'bg-primary-1 text-brand-neutral-8 border border-brand-primary-6'
                                : 'bg-white text-brand-neutral-7 border border-brand-neutral-4 hover:border-brand-neutral-6'
                        )}
                    >
                        {item.label}
                    </button>
                )
            })}
        </div>
    )
}