'use client'

import { useRouter } from 'next/navigation'
import { NotificationBell } from './NotificationBell'

/**
 * Wires the self-fetching NotificationBell to navigate to the notifications modal route.
 */
export default function NotificationBellLink() {
    const router = useRouter()
    return (
        <NotificationBell onClick={() => router.push('/dashboard/notifications')} />
    )
}
