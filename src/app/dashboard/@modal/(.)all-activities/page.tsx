import { getAdminActivities } from "@/actions/dashboard"
import AllActivitiesModal from "@/components/modals/AllActivitiesModal"


export default async function AllActivitiesModalPage() {
    const res = await getAdminActivities(1)
    return <AllActivitiesModal initialData={res.data} />
}