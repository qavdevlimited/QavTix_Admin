'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import { AnimatedDialog } from '@/components/custom-utils/dialogs/AnimatedDialog'
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import NotificationItem from '@/components/slots/notifications/NotificationItem'
import { getAdminNotifications, markAdminNotificationsAsRead } from '@/actions/notifications/client'

const FILTER_OPTIONS = [
    { label: 'Event Updates', value: 'event_update' },
    { label: 'Tickets',       value: 'ticket' },
    { label: 'Refunds',       value: 'refund' },
    { label: 'System',        value: 'system' },
    { label: 'Reminders',     value: 'reminder' },
]

interface Props {
    initialData?: AdminNotificationsData
}

export default function AllNotificationsModal({ initialData }: Props) {
    const router       = useRouter()
    const searchParams = useSearchParams()

    const [open, setOpen]                   = useState(true)
    const [notifications, setNotifications] = useState<AdminNotification[]>(initialData?.notifications ?? [])
    const [isFiltering, startFiltering]     = useTransition()
    const [isMarkingRead, startMarkRead]    = useTransition()

    const filterValue       = searchParams.get('notification_type') ?? ''
    const [optimisticFilter, setOptimisticFilter] = useState(filterValue)
    const hasUnread         = notifications.some(n => !n.is_read)
    const isCompletelyEmpty = notifications.length === 0 && !filterValue

    // Reset open state and notifications on mount or when initialData changes
    useEffect(() => {
        setOpen(true)
        if (initialData?.notifications) {
            setNotifications(initialData.notifications)
        }
    }, [initialData])

    // Keep optimistic filter in sync with URL when transition settles
    useEffect(() => {
        if (!isFiltering) setOptimisticFilter(filterValue)
    }, [filterValue, isFiltering])

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => router.back(), 300)
    }

    const handleFilterChange = (v: string) => {
        const newValue = v === filterValue ? '' : v
        setOptimisticFilter(newValue)

        const params = new URLSearchParams(searchParams.toString())
        if (newValue) params.set('notification_type', newValue)
        else params.delete('notification_type')

        startFiltering(async () => {
            const res = await getAdminNotifications({ notification_type: newValue || undefined })
            if (res.success && res.data) {
                setNotifications(res.data.notifications)
            }
            router.push(`?${params.toString()}`, { scroll: false })
        })
    }

    const handleMarkAllRead = () => {
        startMarkRead(async () => {
            const res = await markAdminNotificationsAsRead()
            if (res.success) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
            }
        })
    }

    return (
        <div className="w-full">
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
                        <DialogTitle className={cn(space_grotesk.className, 'text-lg font-bold text-brand-secondary-9')}>
                            Notifications
                        </DialogTitle>
                        <DialogDescription className="text-xs text-brand-neutral-7">
                            Your recent platform notifications
                        </DialogDescription>
                    </DialogHeader>

                    <button
                        onClick={handleClose}
                        className="text-brand-neutral-7/80 hover:text-brand-neutral-6"
                        aria-label="Close notifications"
                    >
                        <Icon icon="line-md:close-circle-filled" className="size-6" />
                    </button>
                </div>

                {/* Filter bar */}
                {!isCompletelyEmpty && (
                    <div className="px-6 pt-4 pb-2 flex items-center justify-between gap-2">
                        <Select
                            value={optimisticFilter}
                            onValueChange={handleFilterChange}
                            disabled={isFiltering}
                        >
                            <SelectTrigger className={cn(
                                'border-brand-neutral-8 font-medium text-xs w-fit bg-white rounded-lg',
                                'hover:border-brand-neutral-5 focus:border-brand-primary-6',
                                'disabled:cursor-not-allowed disabled:opacity-65'
                            )}>
                                <Icon icon="hugeicons:sliders-horizontal" width={20} height={20} className="shrink-0" />
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                {FILTER_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                            {/* Active filter clear pill */}
                            {optimisticFilter && (
                                <button
                                    onClick={() => handleFilterChange(optimisticFilter)}
                                    className="flex items-center gap-1 text-[11px] font-medium text-brand-primary-6 bg-brand-primary-1 px-2 py-1 rounded-full hover:bg-brand-primary-2 transition-colors"
                                >
                                    {FILTER_OPTIONS.find(o => o.value === optimisticFilter)?.label}
                                    <Icon icon="hugeicons:cancel-01" className="w-3 h-3" />
                                </button>
                            )}

                            {/* Mark all read */}
                            {hasUnread && !optimisticFilter && (
                                <button
                                    onClick={handleMarkAllRead}
                                    disabled={isMarkingRead}
                                    className="text-xs text-brand-primary-6 hover:text-brand-primary-7 font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
                                >
                                    {isMarkingRead ? 'Marking...' : 'Mark all as read'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="space-y-1 px-6 pb-4 pt-2 min-h-[120px]">
                    {isFiltering ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-[72px] bg-brand-neutral-3 w-full rounded-xl" />
                        ))
                    ) : notifications.length > 0 ? (
                        notifications.map((n) => (
                            <NotificationItem key={n.id} notification={n} />
                        ))
                    ) : (
                        <div className="py-14 text-center">
                            <Icon icon="hugeicons:notification-02" className="w-12 h-12 text-brand-neutral-5 mx-auto mb-3" />
                            <p className="text-sm font-medium text-brand-neutral-7">No notifications</p>
                            <p className="text-xs text-brand-neutral-6 mt-1">
                                {filterValue ? 'No notifications match this filter' : "You're all caught up!"}
                            </p>
                        </div>
                    )}
                </div>
            </AnimatedDialog>
        </div>
    )
}
