// Admin notification types

interface AdminNotification {
    id:                string  // UUID
    notification_type: "event_update" | "ticket" | "refund" | "system" | "reminder" | string
    title:             string
    message:           string
    is_read:           boolean
    metadata:          Record<string, unknown>
    created_at:        string
}

interface AdminNotificationsData {
    notifications:              AdminNotification[]
    unread_notifications_count: number
}
