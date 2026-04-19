'use client'

import { cn } from '@/lib/utils'
import RecentActivityTab from '../slots/activity/ActivityTabContent'

interface ActivityNotificationsProps {
  activitiesData?: AdminActivitiesData;
}

export default function ActivitySectionCW({
  activitiesData,
}: ActivityNotificationsProps) {

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-neutral-2 overflow-hidden w-full">
            <div className="border-b mx-4 border-brand-neutral-3">
                <h3
                    className={cn(
                    "flex-1 w-fit py-4 text-sm md:text-[13px] font-bold transition-colors relative",
                    "text-brand-primary-6"
                    )}
                >
                    Recent Activity
                    <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-brand-primary-6" />
                </h3>
            </div>

            {/* Tab Content */}
            <div className="py-3 w-full">
                <RecentActivityTab activities={activitiesData?.results || []} />
            </div>
        </div>
    )
}
