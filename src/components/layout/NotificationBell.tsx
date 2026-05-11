'use client'

import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { getAdminNotifications } from "@/actions/notifications/client"

interface NotificationBellProps {
    /** Custom click handler for opening a popup or navigating to a page */
    onClick?: () => void
    /** Optional additional classes for positioning */
    className?: string
}

export function NotificationBell({ onClick, className }: NotificationBellProps) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        getAdminNotifications({ page: 1 }).then((res) => {
            if (res.success && res.data) {
                setCount(res.data.unread_notifications_count)
            }
        })
    }, [])

    const isBadgeVisible = count > 0

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "relative flex items-center justify-center p-2 rounded-full transition-colors",
                "hover:bg-brand-neutral-1 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-5",
                className
            )}
            aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
        >
            {/* Bell Icon */}
            <Icon icon="lucide:bell" className="size-5.5 text-brand-neutral-7" />

            {/* Unread badge */}
            {isBadgeVisible && (
                <div className={cn(
                    "absolute top-0.5 right-1.5",
                    "size-4.5 px-1",
                    "flex items-center justify-center",
                    "bg-[#FF0000] text-white font-bold rounded-full",
                    "border-2 border-white",
                    "text-[10px] leading-none"
                )}>
                    {count > 99 ? '99+' : count}
                </div>
            )}
        </button>
    )
}