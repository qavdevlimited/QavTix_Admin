import { getServerAxios } from "@/lib/axios"
import { ADMIN_NOTIFICATIONS_ENDPOINT } from "@/endpoints"

interface NotificationParams {
    page?: number
    notification_type?: string
    mark_read?: boolean
}

export async function getAdminNotifications(
    params: NotificationParams = {},
): Promise<{ success: boolean; data?: AdminNotificationsData; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_NOTIFICATIONS_ENDPOINT}`, { params })
        return { success: true, data: data?.data ?? data }
    } catch {
        return { success: false, message: "Failed to load notifications." }
    }
}

export async function markAdminNotificationsAsRead(): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.get(`/${ADMIN_NOTIFICATIONS_ENDPOINT}`, { params: { mark_read: true } })
        return { success: true }
    } catch {
        return { success: false, message: "Failed to mark notifications as read." }
    }
}
