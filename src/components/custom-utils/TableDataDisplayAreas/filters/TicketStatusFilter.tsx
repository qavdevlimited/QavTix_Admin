'use client'

import { useState } from 'react'
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'

const TICKET_STATUS_OPTIONS = [
  { value: 'active',   label: 'Active',   color: 'bg-green-500' },
  { value: 'used',     label: 'Used',     color: 'bg-brand-neutral-5' },
  { value: 'cancelled',label: 'Cancelled',color: 'bg-red-500' },
  { value: 'resold',   label: 'Resold',   color: 'bg-amber-400' },
] as const

interface TicketStatusFilterProps {
  value?: string[]
  onChange: (value: string[]) => void
  icon: string
  label?: string
}

export function TicketStatusFilter({ value, onChange, icon, label = "Ticket Status" }: TicketStatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(value || [])

  const handleToggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter(v => v !== val)
      : [...selected, val]
    setSelected(next)
    onChange(next)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <EventFilterTypeBtn
          icon={icon}
          displayText={label}
          onClick={() => setIsOpen(true)}
          hasActiveFilter={selected.length > 0}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={5}
        className={cn(
          "w-full z-200! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
          "data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-4",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
          "data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-top-4",
        )}
      >
        <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-brand-neutral-5">
          Filter by {label}
        </p>

        {TICKET_STATUS_OPTIONS.map(opt => {
          const isSelected = selected.includes(opt.value)
          return (
            <DropdownMenuItem
              key={opt.value}
              onSelect={(e) => { e.preventDefault(); handleToggle(opt.value) }}
              className={cn(
                "flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-colors outline-none",
                "focus:bg-brand-neutral-1 active:scale-[0.98]",
                isSelected ? "bg-brand-primary-1/40" : "",
              )}
            >
              <div className={cn("size-1.5 rounded-full shrink-0 shadow-sm", opt.color)} />
              <span className={cn(
                "text-xs flex-1",
                isSelected ? "font-semibold text-brand-primary-9" : "text-brand-secondary-8",
              )}>
                {opt.label}
              </span>
              {isSelected && (
                <Icon icon="iconamoon:check-bold" className="text-brand-primary-6 size-3" />
              )}
            </DropdownMenuItem>
          )
        })}

        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator className="my-1 bg-brand-neutral-2" />
            <button
              onClick={(e) => { e.stopPropagation(); setSelected([]); onChange([]) }}
              className="w-full text-center py-1.5 text-[11px] font-medium text-brand-neutral-6 hover:text-red-500 transition-colors"
            >
              Reset Filters
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
