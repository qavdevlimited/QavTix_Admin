import HostProfilePageCW from "@/components/page-content-wrappers/HostProfilePageCW"
import { getHostProfile, getHostEarningsCards, getHostChart, getHostEvents } from "@/actions/host-management"
import { getCategories } from "@/actions/filters"

interface HostProfilePageProps {
    params: Promise<{ host_id: string }>
}

export default async function HostProfilePage({ params }: HostProfilePageProps) {
    const { host_id } = await params

    const [{ data: profile }, { cards }, { chart }, categories, initialAllEvents, initialActiveEvents, initialDraftEvents, initialEndedEvents, initialCancelledEvents] = await Promise.all([
        getHostProfile(host_id),
        getHostEarningsCards(host_id),
        getHostChart(host_id, { chart_type: "revenue", year: new Date().getFullYear() }),
        getCategories(),
        getHostEvents(host_id),
        getHostEvents(host_id, "active"),
        getHostEvents(host_id, "draft"),
        getHostEvents(host_id, "ended"),
        getHostEvents(host_id, "cancelled"),
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