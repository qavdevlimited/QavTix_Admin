'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'
import { actionOptions } from '../resources/default-filter-options'
import { Icon } from '@iconify/react'


interface ActionsFilterProps {
  value?: string[]
  onChange: (value: string[]) => void
  icon: string
}

export function ActionsFilter({ value, onChange, icon }: ActionsFilterProps) {

  const [isOpen, setIsOpen] = useState(false)
  const [selectedActions, setSelectedActions] = useState<string[]>(value || [])

  const handleToggle = (actionValue: string) => {
    const next = selectedActions.includes(actionValue)
      ? selectedActions.filter(v => v !== actionValue)
      : [...selectedActions, actionValue]

    setSelectedActions(next)
    onChange(next)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <EventFilterTypeBtn
          icon={icon}
          displayText="Actions"
          onClick={() => setIsOpen(true)}
          hasActiveFilter={selectedActions.length > 0}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={5}
        className={cn(
          "w-100 z-200! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
          // Open animation
          "data-[state=open]:animate-in",
          "data-[state=open]:fade-in-0",
          "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
          "data-[state=open]:zoom-in-90",
          "data-[state=open]:slide-in-from-top-4",
          // Close animation
          "data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0",
          "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
          "data-[state=closed]:zoom-out-90",
          "data-[state=closed]:slide-out-to-top-4"
        )}
      >
        <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-brand-neutral-6">
          Filter by Actions
        </p>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {actionOptions.map(action => {
            const isSelected = selectedActions.includes(action.value)
            return (
              <DropdownMenuItem
                key={action.value}
                onSelect={(e) => {
                  e.preventDefault()
                  handleToggle(action.value)
                }}
                className={cn(
                  "flex items-center gap-2.5 px-2 py-2.5 rounded-md cursor-pointer transition-colors outline-none",
                  "focus:bg-brand-neutral-1 active:scale-[0.98]",
                )}
              >
                {isSelected ? (
                  <Icon
                    icon="mdi:checkbox-marked"
                    className="size-4 text-brand-primary-6 shrink-0"
                  />
                ) : (
                  <Icon
                    icon="mdi:checkbox-blank-outline"
                    className="size-4 text-brand-neutral-5 shrink-0"
                  />
                )}
                <span className={cn(
                  "text-xs flex-1 md:whitespace-nowrap",
                  isSelected ? "font-medium text-brand-secondary-9" : "text-brand-secondary-7"
                )}>
                  {action.label}
                </span>
              </DropdownMenuItem>
            )
          })}
        </div>

        {selectedActions.length > 0 && (
          <>
            <DropdownMenuSeparator className="my-2 bg-brand-neutral-2" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedActions([])
                onChange([])
              }}
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