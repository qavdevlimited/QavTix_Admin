import { getAdminNotifications } from "@/actions/notifications/index"
import AllNotificationsModal from "@/components/modals/AllNotificationsModal"
import { cookies } from "next/headers";

export default async function NotificationsModalPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_access_token")?.value;
    const searchParams = await props.searchParams;

    const params: Record<string, any> = { page: 1 }
    if (searchParams?.notification_type) params.notification_type = searchParams.notification_type

    const res = await getAdminNotifications(params)
    
    return <AllNotificationsModal initialData={res.data} />
}
