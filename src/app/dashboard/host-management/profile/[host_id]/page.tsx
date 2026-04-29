import HostProfilePageCW from "@/components/page-content-wrappers/HostProfilePageCW"
import { getHostProfile, getHostEarningsCards, getHostChart, getHostEvents } from "@/actions/host-management"
import { getCategories } from "@/actions/filters"
import { cookies } from "next/headers";

interface HostProfilePageProps {
    params: Promise<{ host_id: string }>
}

export default async function HostProfilePage(props: HostProfilePageProps) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;
    const { host_id } = await props.params

    const [{ data: profile }, { cards }, { chart }, categories, initialAllEvents, initialActiveEvents, initialDraftEvents, initialEndedEvents, initialCancelledEvents] = await Promise.all([
        getHostProfile(token, host_id),
        getHostEarningsCards(token, host_id),
        getHostChart(token, host_id, { chart_type: "revenue", year: new Date().getFullYear() }),
        getCategories(token),
        getHostEvents(token, host_id),
        getHostEvents(token, host_id, "active"),
        getHostEvents(token, host_id, "draft"),
        getHostEvents(token, host_id, "ended"),
        getHostEvents(token, host_id, "cancelled"),
    ])

    return (
        <HostProfilePageCW
            hostId={host_id}
            initialProfile={profile}
            initialCards={cards}
            initialChart={chart}
            categories={categories.data}
            initialAllEvents={initialAllEvents}
            initialActiveEvents={initialActiveEvents}
            initialDraftEvents={initialDraftEvents}
            initialEndedEvents={initialEndedEvents}
            initialCancelledEvents={initialCancelledEvents}
        />
    )
}