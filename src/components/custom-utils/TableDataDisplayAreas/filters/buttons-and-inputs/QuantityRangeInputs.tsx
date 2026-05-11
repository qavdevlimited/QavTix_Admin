'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'

interface QuantityRangeInputsProps {
    min: number
    max: number
    onMinChange: (value: number) => void
    onMaxChange: (value: number) => void
}

function QuantityInput({ value, label, placeholder, onChange }: {
    value: number
    label: string
    placeholder: string
    onChange: (value: number) => void
}) {
    const [text, setText] = useState(value > 0 ? String(value) : '')
    const internalRef = useRef(value)

    useEffect(() => {
        if (value !== internalRef.current) {
            internalRef.current = value
            setText(value > 0 ? String(value) : '')
        }
    }, [value])

    return (
        <div className="relative">
            <Input
                type="text"
                inputMode="numeric"
                value={text}
                onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '')
                    setText(raw)
                    const num = raw === '' ? 0 : Number(raw)
                    internalRef.current = num
                    onChange(num)
                }}
                placeholder={placeholder}
                className="pl-4 pt-6 pb-2 h-16 placeholder:text-brand-neutral-6 rounded-xl border-2 border-brand-neutral-3 focus:outline-0 focus:outline-offset-0 focus:outline-none focus:ring-0 focus:border-brand-primary text-base"
            />
            <label className="absolute left-4 top-2 text-xs font-medium text-brand-neutral-7 pointer-events-none">
                {label}
            </label>
        </div>
    )
}

export function QuantityRangeInputs({ min, max, onMinChange, onMaxChange }: QuantityRangeInputsProps) {
    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <QuantityInput value={min} label="Min." placeholder="1" onChange={onMinChange} />
            <span className="text-brand-neutral-6 text-sm pb-4">to</span>
            <QuantityInput value={max} label="Max." placeholder="10" onChange={onMaxChange} />
        </div>
    )
}