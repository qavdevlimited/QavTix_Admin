import EventsListingPageCW from "@/components/page-content-wrappers/EventsListingPageCW"
import { getAdminEvents, getAdminEventCards } from "@/actions/events"
import { getCategories } from "@/actions/filters"

export default async function EventsListingPage() {
    const [
        { cards },
        categories,
        initialAllEvents,
        initialLiveEvents,
        initialSuspendedEvents,
        initialEndedEvents,
        initialCancelledEvents,
    ] = await Promise.all([
        getAdminEventCards(),
        getCategories(),
        getAdminEvents(),
        getAdminEvents("live"),
        getAdminEvents("suspended"),
        getAdminEvents("ended"),
        getAdminEvents("cancelled"),
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