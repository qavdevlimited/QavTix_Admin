'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { SelectValue } from '@radix-ui/react-select'
import RecentActivityItem from './RecentActivityItem'

interface RecentActivityTabProps {
  activities: ActivityItem[]
}

export default function RecentActivityTab({ activities }: RecentActivityTabProps) {

    const [filterValue,setFilterValue] = useState<string>("")

    const filterTypes = [
        {
            name: "Low Sale",
            value: "low_sale"
        },
        {
            name: "Tickets",
            value: "tickets"
        }
    ]

    return (
        <div className="space-y-2 w-full">
            {/* Filter Button */}
            <div className="flex items-center justify-between px-4">
                <Select 
                    value={filterValue} 
                    onValueChange={(v) => setFilterValue(v)}
                >
                    <SelectTrigger
                        className={cn(
                            "border-brand-neutral-8 font-medium disabled:cursor-not-allowed disabled:opacity-65 text-xs w-fit bg-white rounded-lg border-neutral-4 hover:border-brand-neutral-5 focus:border-brand-primary-6",
                        )}
                    >
                        <Icon icon="hugeicons:sliders-horizontal" width="24" height="24" className='shrink-0' />
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterTypes.map((v) => (
                            <SelectItem key={v.value} value={v.value} className='text-xs'>
                                <span>{v.name}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Activity List */}
            <div className="space-y-2 px-4">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                    <RecentActivityItem key={activity.id} activity={activity} />
                ))
                ) : (
                    <div className="py-12 text-center">
                        <Icon icon="hugeicons:clock-01" className="w-12 h-12 border-brand-neutral-4 mx-auto mb-3" />
                        <p className="text-sm border-brand-neutral-6">No recent activity</p>
                    </div>
                )}
            </div>
        </div>
    )
}