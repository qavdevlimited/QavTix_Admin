import EventProfilePageCW from "@/components/page-content-wrappers/EventProfilePageCW"
import { getAdminEventDetail, getAdminEventAttendees } from "@/actions/events"

interface Props {
    params: Promise<{ event_id: string }>
}

export default async function EventProfilePage({ params }: Props) {
    const { event_id } = await params

    const [{ data: event }, initialAttendees] = await Promise.all([
        getAdminEventDetail(event_id),
        getAdminEventAttendees(event_id),
    ])

    return (
        <EventProfilePageCW
            eventId={event_id}
            initialEvent={event}
            initialAttendees={initialAttendees}
        />
    )
}