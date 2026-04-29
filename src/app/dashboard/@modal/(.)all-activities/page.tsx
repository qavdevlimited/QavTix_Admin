import { getAdminActivities } from "@/actions/dashboard"
import AllActivitiesModal from "@/components/modals/AllActivitiesModal"
import { cookies } from "next/headers";

export default async function AllActivitiesModalPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;
    const res = await getAdminActivities(token, 1)
    return <AllActivitiesModal initialData={res.data} />
}