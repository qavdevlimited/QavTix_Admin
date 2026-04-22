"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { EventProfileTabNFilterOptions, AdminEventAttendeeFilterOptions, TableDataDisplayFilter } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import EventAttendeesTable from "@/components/custom-utils/TableDataDisplayAreas/tables/events-listing/EventAttendeesTable"
import EventProfileOverviewTabContainer from "@/components/event-listing/EventProfileOverviewTabContainer"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { useDataDisplay, TabSlice } from "@/custom-hooks/UseDataDisplay"
import { ADMIN_EVENT_ATTENDEES_ENDPOINT } from "@/endpoints"
import { Icon } from "@iconify/react"

interface EventProfilePageCWProps {
    eventId: string
    initialEvent: EventDetails | null
    initialAttendees: TabSlice<AdminEventAttendee>
}

export default function EventProfilePageCW({
    eventId,
    initialEvent,
    initialAttendees,
}: EventProfilePageCWProps) {

    const { tabList } = EventProfileTabNFilterOptions
    const { filterOptions: attendeeFilterOptions } = AdminEventAttendeeFilterOptions

    const [activeTab, setActiveTab] = useState<typeof tabList[number]["value"]>("overview")
    const [attendeeFilters, setAttendeeFilters] = useState<Partial<FilterValues>>({})

    const { tabStates } = useDataDisplay<AdminEventAttendee>(
        {
            endpoint: ADMIN_EVENT_ATTENDEES_ENDPOINT(eventId),
            tabs: [
                { key: "attendee-list", initialData: initialAttendees, staticParams: {} },
            ],
            activeTab: "attendee-list",
        },
        attendeeFilters,
    )

    const attendeeState = tabStates["attendee-list"]

    return (
        <main className="pb-10">
            <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4 mt-10 lg:mt-4")}>
                Event Profile
            </h2>

            <div className="mt-4">
                <DataDisplayTableWrapper
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    tabs={tabList}
                    filterOptions={
                        activeTab === "attendee-list"
                            ? (attendeeFilterOptions as readonly TableDataDisplayFilter[])
                            : []
                    }
                    filters={activeTab === "attendee-list" ? attendeeFilters : undefined}
                    setFilters={
                        activeTab === "attendee-list"
                            ? (setAttendeeFilters as Dispatch<SetStateAction<Partial<FilterValues>>>)
                            : undefined
                    }
                    showSearch={activeTab === "attendee-list"}
                    searchPlaceholder="Search attendees…"
                    onSearch={activeTab === "attendee-list" ? attendeeState?.handleSearch : undefined}
                    currentSearch={attendeeState?.search ?? ""}
                    isLoading={activeTab === "attendee-list" ? attendeeState?.isLoading : false}
                >
                    {activeTab === "overview" && (
                        initialEvent ? (
                            <EventProfileOverviewTabContainer
                                event={initialEvent}
                                eventId={eventId}
                            />
                        ) : (
                            <div className="py-20 text-center">
                                <Icon icon="solar:sad-square-linear" className="size-10 text-brand-neutral-6 mx-auto mb-3" />
                                <p className="text-sm text-brand-neutral-7">Event not found.</p>
                            </div>
                        )
                    )}

                    {/* ── Attendees Tab ──────────────────────────── */}
                    {activeTab === "attendee-list" && (
                        <EventAttendeesTable
                            items={attendeeState?.items ?? []}
                            isLoading={attendeeState?.isLoading ?? false}
                            isLoadingMore={attendeeState?.isLoadingMore ?? false}
                            hasNext={attendeeState?.hasNext ?? false}
                            count={attendeeState?.count ?? 0}
                            onLoadMore={attendeeState?.loadMore ?? (() => { })}
                            isEmpty={attendeeState?.isEmpty ?? false}
                            isError={attendeeState?.isError ?? false}
                            search={attendeeState?.search ?? ""}
                            currentPage={attendeeState?.currentPage ?? 1}
                            totalPages={attendeeState?.totalPages ?? 1}
                            fetchPage={attendeeState?.fetchPage ?? (() => { })}
                        />
                    )}
                </DataDisplayTableWrapper>
            </div>
        </main>
    )
}