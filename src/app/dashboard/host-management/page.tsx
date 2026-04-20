import HostmanagementPageCW from "@/components/page-content-wrappers/HostManagementPageCW"
import { getAdminHosts, getAdminHostCards, getAdminPendingHosts } from "@/actions/host-management"

export default async function HostManagementPage() {

    const [initialHosts, { cards: initialHostCards }, initialPendingHosts] = await Promise.all([
        getAdminHosts(),
        getAdminHostCards(),
        getAdminPendingHosts(),
    ])

    return (
        <HostmanagementPageCW
            initialHosts={initialHosts}
            initialHostCards={initialHostCards}
            initialPendingHosts={initialPendingHosts}
        />
    )
}