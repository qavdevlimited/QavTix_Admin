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
import CustomAvatar from '../../avatars/CustomAvatar'
import { mockPayouts } from '@/components-data/demo-data'


interface UserFilterProps {
  users?: AuthUser[]
  value?: string[]
  onChange: (value: string[]) => void
  icon: string
  label?: string
}

export function UserFilter({ 
  users = [{ full_name: "James Norman", email: "james@gmail.com", address: "Lagos , NG", id: "2", phone: "+234559373773", profile_img: "/images/demo-images"}], 
  value, 
  onChange, 
  icon,
  label = "User"
}: UserFilterProps) {

    const [isOpen, setIsOpen] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<string[]>(value || [])

    const handleToggle = (userId: string) => {
        const next = selectedUsers.includes(userId)
        ? selectedUsers.filter(v => v !== userId)
        : [...selectedUsers, userId]
        
        setSelectedUsers(next)
        onChange(next)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                icon={icon}
                displayText={label}
                onClick={() => setIsOpen(true)}
                hasActiveFilter={selectedUsers.length > 0}
                />
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
                align="start" 
                sideOffset={5}
                className={cn(
                "w-72 z-200! p-2 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
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
                <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-brand-neutral-5">
                    Filter by {label}
                </p>
                
                {
                    users?.length ? users.map(user => {
                    const isSelected = selectedUsers.includes(user.id.toString())
                    return (
                        <DropdownMenuItem
                            key={user.id}
                            onSelect={(e) => {
                                e.preventDefault()
                                handleToggle(user.id.toString())
                            }}
                            className={cn(
                                "flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer transition-colors outline-none",
                                "focus:bg-brand-neutral-1 active:scale-[0.98]",
                                isSelected ? "bg-brand-primary-1/40" : "bg-brand-neutral-3"
                            )}
                        >
                            <CustomAvatar
                                name={user.full_name}
                                id={user.id as string}
                                size="size-8 shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-xs",
                                    isSelected ? "font-semibold text-brand-primary-9" : "text-brand-secondary-9"
                                    )}
                                >
                                    {user.full_name}
                                </p>
                                <p className="text-[11px] text-brand-secondary-9 font-bold truncate">
                                    {user.email}
                                </p>
                            </div>

                            {isSelected && (
                                <Icon icon="iconamoon:check-bold" className="text-brand-primary-6 size-3 shrink-0" />
                            )}
                        </DropdownMenuItem>
                    )})
                    : null
                }
                
                {selectedUsers.length > 0 && (
                    <>
                        <DropdownMenuSeparator className="my-1 bg-brand-neutral-2" />
                        <button 
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedUsers([])
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