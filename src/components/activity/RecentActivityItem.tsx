'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import getActivityTypeText from '@/helper-fns/getActivityTypeText'
import Timer02 from '../Svg-Icons/Timer02'
import { EVENT_PROFILE } from '@/enums/navigation'

const activityIcons: Record<string, { icon: string; bgColor: string; iconColor: string }> = {
    new_sale: {
        icon: 'hugeicons:shopping-bag-02',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
    },
    check_in: {
        icon: 'hugeicons:tick-double-02',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600'
    },
    low_stock: {
        icon: 'hugeicons:alert-02',
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600'
    },
    payout: {
        icon: 'hugeicons:money-send-02',
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600'
    },
    reminder: {
        icon: 'hugeicons:alarm-clock',
        bgColor: 'bg-yellow-50',
        iconColor: 'text-yellow-600'
    }
}

interface RecentActivityItemProps {
    activity: ActivityItem
}

export default function RecentActivityItem({ activity }: RecentActivityItemProps) {
    const iconConfig = activityIcons[activity.type] || activityIcons.new_sale

    return (
        <div className="shadow-[0px_5.8px_23.17px_0px_#3326AE14] py-2 space-y-1 border-b border-brand-neutral-2 last:border-0 px-4 rounded-lg">
            <div className='flex w-full justify-between gap-4'>
                <span className='text-[11px] text-brand-neutral-7'>{getActivityTypeText(activity.type)}</span>
                <div className="flex items-center gap-1 text-[11px] text-brand-neutral-7">
                    <Timer02 />
                    <span>{activity.timestamp}</span>
                </div>
            </div>
            <div className='flex w-full gap-4'>
                <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                    iconConfig.bgColor
                )}>
                    <Icon
                        icon={iconConfig.icon}
                        className={cn("w-5 h-5", iconConfig.iconColor)}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs text-brand-secondary-8 font-medium mb-0.5">
                        {activity.title}
                    </p>

                    {activity.subtitle && (
                        <p className="text-[11px] text-brand-secondary-8">
                            {activity.subtitle}
                        </p>
                    )}

                    {activity.eventId && (
                        <Link
                           href={EVENT_PROFILE.href.replace('[event_id]', activity.eventId ?? '')}
                            className="inline-flex items-center gap-1 text-xs text-brand-primary-6 hover:text-brand-primary-7 font-semibold mt-1"
                        >
                            View Event
                            <Icon icon="hugeicons:arrow-right-01" className="w-3 h-3" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
