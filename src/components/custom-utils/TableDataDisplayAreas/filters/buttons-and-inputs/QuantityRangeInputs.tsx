'use client'

import { Input } from '@/components/ui/input'

interface QuantityRangeInputsProps {
    min: number
    max: number
    onMinChange: (value: number) => void
    onMaxChange: (value: number) => void
}

export function QuantityRangeInputs({
    min,
    max,
    onMinChange,
    onMaxChange,
}: QuantityRangeInputsProps) {
    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <div>
                <div className="relative">
                    <Input
                        type="number"
                        value={min || ''}
                        onChange={(e) => onMinChange(e.target.value === '' ? 1 : Number(e.target.value))}
                        placeholder="1"
                        className="pl-4 pt-6 pb-2 h-16 rounded-xl border-2 border-brand-neutral-3 focus:outline-0 focus:outline-offset-0 focus:outline-none focus:ring-0 focus:border-brand-primary text-base 
                        [appearance:textfield] 
                        [&::-webkit-outer-spin-button]:appearance-none 
                        [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <label className="absolute left-4 top-2 text-xs font-medium text-brand-neutral-7 pointer-events-none">
                        Min. quantity
                    </label>
                </div>
            </div>
            <span className="text-brand-neutral-6 text-sm pb-4">to</span>
            <div>
                <div className="relative">
                    <Input
                        type="number"
                        value={max || ''}
                        onChange={(e) => onMaxChange(e.target.value === '' ? 1 : Number(e.target.value))}
                        placeholder="10"
                        className="pl-4 pt-6 pb-2 h-16 rounded-xl border-2 border-brand-neutral-3 focus:outline-0 focus:outline-offset-0 focus:outline-none focus:ring-0 focus:border-brand-primary text-base 
                        [appearance:textfield] 
                        [&::-webkit-outer-spin-button]:appearance-none 
                        [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <label className="absolute left-4 top-2 text-xs font-medium text-brand-neutral-7 pointer-events-none">
                        Max. quantity
                    </label>
                </div>
            </div>
        </div>
    )
}