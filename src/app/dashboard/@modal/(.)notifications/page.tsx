import { getAdminNotifications } from "@/actions/notifications/index"
import AllNotificationsModal from "@/components/modals/AllNotificationsModal"

export default async function NotificationsModalPage() {
    const res = await getAdminNotifications({ page: 1 })
    return <AllNotificationsModal initialData={res.data} />
}
