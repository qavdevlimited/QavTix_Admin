import EventsListingPageCW from "@/components/page-content-wrappers/EventsListingPageCW"
import { getAdminEvents, getAdminEventCards } from "@/actions/events"
import { getCategories } from "@/actions/filters"
import { cookies } from "next/headers";

export default async function EventsListingPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;
    const [
        { cards },
        categories,
        initialAllEvents,
        initialLiveEvents,
        initialSuspendedEvents,
        initialEndedEvents,
        initialCancelledEvents,
    ] = await Promise.all([
        getAdminEventCards(token),
        getCategories(token),
        getAdminEvents(token),
        getAdminEvents(token, "live"),
        getAdminEvents(token, "suspended"),
        getAdminEvents(token, "ended"),
        getAdminEvents(token, "cancelled"),
    ])

    return (
        <EventsListingPageCW
            initialCards={cards}
            categories={categories.data}
            initialAllEvents={initialAllEvents}
            initialLiveEvents={initialLiveEvents}
            initialSuspendedEvents={initialSuspendedEvents}
            initialEndedEvents={initialEndedEvents}
            initialCancelledEvents={initialCancelledEvents}
        />
    )
}