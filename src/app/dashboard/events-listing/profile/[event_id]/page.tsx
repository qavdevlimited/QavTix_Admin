import EventProfilePageCW from "@/components/page-content-wrappers/EventProfilePageCW"
import { getAdminEventDetail, getAdminEventAttendees } from "@/actions/events/index"
import { cookies } from "next/headers";

interface Props {
    params: Promise<{ event_id: string }>
}

export default async function EventProfilePage(props: Props) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;
    const { event_id } = await props.params

    const [{ data: event }, initialAttendees] = await Promise.all([
        getAdminEventDetail(token, event_id),
        getAdminEventAttendees(token, event_id),
    ])

    return (
        <EventProfilePageCW
            eventId={event_id}
            initialEvent={event}
            initialAttendees={initialAttendees}
        />
    )
}