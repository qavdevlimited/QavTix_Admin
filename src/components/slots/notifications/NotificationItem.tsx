'use client'

import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

const TYPE_CONFIG: Record<string, { dot: string; icon: string }> = {
    event_update: { dot: 'bg-blue-500', icon: 'hugeicons:calendar-02' },
    ticket: { dot: 'bg-purple-500', icon: 'hugeicons:ticket-02' },
    refund: { dot: 'bg-red-500', icon: 'hugeicons:money-send-02' },
    system: { dot: 'bg-gray-500', icon: 'hugeicons:settings-02' },
    reminder: { dot: 'bg-yellow-500', icon: 'hugeicons:clock-01' },
}

interface NotificationItemProps {
    notification: AdminNotification
}

export default function NotificationItem({ notification }: NotificationItemProps) {
    const config = TYPE_CONFIG[notification.notification_type] ?? TYPE_CONFIG.system
    const isUnread = !notification.is_read
    const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })

    return (
        <div className={cn(
            'flex items-start gap-3 py-4 border-b border-brand-neutral-2 last:border-0',
            'px-4 -mx-4 rounded-lg transition-colors',
            isUnread ? 'bg-brand-primary-1 hover:bg-brand-primary-2/50' : 'hover:bg-brand-neutral-1'
        )}>
            {/* Type icon */}
            <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5',
                isUnread ? 'bg-brand-primary-2' : 'bg-brand-neutral-2'
            )}>
                <Icon
                    icon={config.icon}
                    className={cn('w-4 h-4', isUnread ? 'text-brand-primary-6' : 'text-brand-neutral-7')}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                    {isUnread && (
                        <span className={cn('w-2 h-2 rounded-full shrink-0', config.dot)} />
                    )}
                    <p className="text-[11px] font-semibold text-brand-neutral-7 truncate">
                        {notification.title}
                    </p>
                </div>
                <p className={cn(
                    'text-xs leading-relaxed',
                    isUnread ? 'text-brand-secondary-8 font-medium' : 'text-brand-neutral-8 font-normal'
                )}>
                    {notification.message}
                </p>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-1 text-xs text-brand-neutral-6 shrink-0 mt-0.5">
                <Icon icon="hugeicons:clock-01" className="w-3.5 h-3.5 text-orange-400" />
                <span>{timeAgo}</span>
            </div>
        </div>
    )
}
