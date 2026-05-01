import HostmanagementPageCW from "@/components/page-content-wrappers/HostManagementPageCW"
import { getAdminHosts, getAdminHostCards, getAdminPendingHosts } from "@/actions/host-management/index"
import { cookies } from "next/headers";

export default async function HostManagementPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;

    const [initialHosts, { cards: initialHostCards }, initialPendingHosts] = await Promise.all([
        getAdminHosts(token),
        getAdminHostCards(token),
        getAdminPendingHosts(token),
    ])

    return (
        <HostmanagementPageCW
            initialHosts={initialHosts}
            initialHostCards={initialHostCards}
            initialPendingHosts={initialPendingHosts}
        />
    )
}