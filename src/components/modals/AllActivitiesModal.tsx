'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { AnimatedDialog } from '@/components/custom-utils/dialogs/AnimatedDialog'
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import RecentActivityItem from '@/components/slots/activity/RecentActivityItem'
import { getAdminActivities } from '@/actions/dashboard'
import { space_grotesk } from '@/lib/fonts'


const FILTER_OPTIONS = [
    { label: "Sales", value: "sale" },
    { label: "Check-ins", value: "checkin" },
    { label: "Refunds", value: "refund" },
    { label: "Withdrawals", value: "withdrawal" },
]

export default function AllActivitiesModal({ initialData }: { initialData?: AdminActivitiesData }) {
    const router = useRouter()

    const [open, setOpen] = useState(true)
    const [filterValue, setFilterValue] = useState<string>("all")
    const [activities, setActivities] = useState<AdminActivity[]>(initialData?.results ?? [])
    const [currentPage, setCurrentPage] = useState(initialData?.page ?? 1)
    const [hasMore, setHasMore] = useState(!!initialData?.next)
    const [isPending, startTransition] = useTransition()

    const filtered = activities.filter(a => filterValue === 'all' || a.activity_type === filterValue)

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => router.back(), 300)
    }

    const handleLoadMore = () => {
        startTransition(async () => {
            const res = await getAdminActivities(currentPage + 1)
            if (res.success && res.data) {
                setActivities(prev => [...prev, ...res.data!.results])
                setCurrentPage(res.data.page)
                setHasMore(!!res.data.next)
            }
        })
    }

    return (
        <AnimatedDialog
            open={open}
            onOpenChange={(v) => { if (!v) handleClose() }}
            showCloseButton={false}
            className="md:max-w-md"
            childrenContainerStyles="px-0"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-brand-neutral-2">
                <DialogHeader>
                    <DialogTitle className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>
                        All Activity
                    </DialogTitle>
                    <DialogDescription className="text-xs text-brand-neutral-7">
                        Full log of recent activity across your account
                    </DialogDescription>
                </DialogHeader>

                <button
                    onClick={handleClose}
                    className="text-brand-neutral-7/80  hover:text-brand-neutral-6"
                    aria-label="Close modal"
                >
                    <Icon icon="line-md:close-circle-filled" className="size-6" />
                </button>
            </div>

            {/* Filter */}
            <div className="px-6 pt-4 pb-2 flex items-center gap-2">
                <Select
                    value={filterValue}
                    onValueChange={(v) => setFilterValue(v === filterValue ? "" : v)}
                >
                    <SelectTrigger className={cn(
                        "border-brand-neutral-8 font-medium text-xs w-fit bg-white rounded-lg",
                        "hover:border-brand-neutral-5 focus:border-brand-primary-6"
                    )}>
                        <Icon icon="hugeicons:sliders-horizontal" width="20" height="20" className="shrink-0" />
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" className="text-xs font-medium">
                            All
                        </SelectItem>
                        {FILTER_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Clear badge — shows when a filter is active */}
                {filterValue !== "all" && (
                    <button
                        onClick={() => setFilterValue("all")}
                        className="flex items-center gap-1 text-[11px] font-medium text-brand-primary-6 bg-brand-primary-1 px-2 py-1 rounded-full hover:bg-brand-primary-2 transition-colors"
                    >
                        {FILTER_OPTIONS.find(o => o.value === filterValue)?.label}
                        <Icon icon="hugeicons:cancel-01" className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* List */}
            <div className="space-y-2 px-6 pb-2">
                {filtered.length > 0 ? (
                    filtered.map((activity) => (
                        <RecentActivityItem key={activity.id} activity={activity} />
                    ))
                ) : (
                    <div className="py-16 text-center">
                        <Icon icon="hugeicons:clock-01" className="w-12 h-12 text-brand-neutral-6 mx-auto mb-3" />
                        <p className="text-sm text-brand-neutral-7">No activity found</p>
                    </div>
                )}
            </div>

            {/* Load more skeleton */}
            {isPending && (
                <div className="space-y-2 px-6 pb-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-16 w-full rounded-lg bg-brand-neutral-2 animate-pulse" />
                    ))}
                </div>
            )}

            {/* Load more button */}
            {hasMore && (
                <div className="px-6 pb-4 pt-1">
                    <button
                        onClick={handleLoadMore}
                        disabled={isPending}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold",
                            "border border-brand-neutral-3 text-brand-primary-6",
                            "hover:bg-brand-neutral-1 transition-colors",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        {isPending ? (
                            <Icon icon="hugeicons:loading-03" className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <span>Load More</span>
                                <Icon icon="hugeicons:arrow-down-01" className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </AnimatedDialog>
    )
}