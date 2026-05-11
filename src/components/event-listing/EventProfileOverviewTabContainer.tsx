"use client"

import Image from "next/image"
import HostDetailsArea from "./HostDetailsArea"
import EventOverviewDetails from "./EventProfileOverviewDetails"
import { Icon } from "@iconify/react"
import Link from "next/link"
import TicketPricingArea from "./TicketPricingArea"
import { Badge } from "@/components/ui/badge"
import { EventIconActionButton } from "@/components/buttons/EventIconActionButton"
import { copyToClipboard } from "@/helper-fns/copyToClipboard"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import AdminEventActionDropdown from "@/components/custom-utils/dropdown/AdminEventActionDropdown"
import { useState } from "react"
import ShareEventModal from "../modals/ShareEventModal"
import { EVENT_DETAILS_LINK } from "@/enums/navigation"

const STATUS_CONFIG: Record<string, { text: string; bg: string; label?: string }> = {
    "filling-fast": { bg: "bg-warning-tertiary", text: "text-secondary-9", label: "Filling fast" },
    "selling-fast": { bg: "bg-warning-tertiary", text: "text-secondary-9", label: "Selling fast" },
    "near-capacity": { bg: "bg-danger-tertiary", text: "text-secondary-9", label: "Near capacity" },
    new: { bg: "bg-accent-6", text: "text-white", label: "New" },
    "sold-out": { bg: "bg-white border border-danger-default/20", text: "text-danger-default", label: "Sold out" },
    "starts-soon": { bg: "bg-primary-1", text: "text-primary-9", label: "Starts soon" },
    draft: { bg: "bg-neutral-3", text: "text-neutral-7", label: "Draft" },
    active: { bg: "bg-postive-tertiary", text: "text-postive-default", label: "Active" },
    live: { bg: "bg-postive-tertiary", text: "text-postive-default", label: "Live" },
    ended: { bg: "bg-neutral-3", text: "text-neutral-7", label: "Ended" },
    cancelled: { bg: "bg-white border border-danger-default/20", text: "text-danger-default", label: "Cancelled" },
    banned: { bg: "bg-white border border-danger-default/20", text: "text-danger-default", label: "Banned" },
    suspended: { bg: "bg-warning-tertiary", text: "text-secondary-9", label: "Suspended" },
}

interface EventProfileOverviewTabContainerProps {
    event: EventDetails
    eventId: string
}

export default function EventProfileOverviewTabContainer({
    event,
    eventId,
}: EventProfileOverviewTabContainerProps) {

    const featuredMedia = Array.isArray(event.event_media)
        ? event.event_media.find(m => m.is_featured) ?? event.event_media[0]
        : event.event_media
    const imageUrl = featuredMedia?.image_url ?? null
    const [showShare, setShowShare] = useState(false)
    const statusCfg = STATUS_CONFIG[event.event_status] ?? { text: "text-neutral-7", bg: "bg-neutral-2" }

    const eventUrl = EVENT_DETAILS_LINK.replace("[event_id]", event.id)

    const startDate = (() => {
        try { return format(parseISO(event.start_datetime), "eeee, MMM d, yyyy · h:mm a") } catch { return event.start_datetime }
    })()
    const endDate = (() => {
        try { return format(parseISO(event.end_datetime), "h:mm a") } catch { return event.end_datetime }
    })()

    const handleShare = () => {
        setShowShare(true)
    }

    const location = event.event_location
    const locationStr = location
        ? [location.venue_name, location.address, location.city, location.state].filter(Boolean).join(", ")
        : null

    const mapsUrl = locationStr
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationStr)}`
        : null

    return (
        <>
            <section>
                <div className="md:flex justify-between gap-8">

                    <div className="md:w-95">
                        <figure>
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={event.title}
                                    width={900}
                                    height={900}
                                    className="rounded-4xl h-60 object-cover md:h-75 w-full"
                                    unoptimized
                                />
                            ) : (
                                <div className="rounded-4xl h-60 md:h-75 w-full bg-brand-neutral-3 flex flex-col items-center justify-center gap-2 text-brand-neutral-5">
                                    <Icon icon="solar:image-linear" className="size-10" />
                                    <p className="text-xs">No image</p>
                                </div>
                            )}
                        </figure>
                        <HostDetailsArea
                            className="md:mt-8"
                            organizerName={event.organizer_display_name}
                            organizerDescription={event.organizer_description}
                            organizerId={event.organizer_id}
                            tags={event.tags ?? []}
                        />
                    </div>

                    <div className="flex-1 mt-6 md:mt-0">
                        {/* Title row */}
                        <div className="flex justify-between gap-5 items-start">
                            <h1 className={cn(space_grotesk.className, "font-bold text-xl md:text-2xl text-brand-secondary-9")}>
                                {event.title}
                            </h1>
                            <AdminEventActionDropdown
                                eventId={eventId}
                                eventTitle={event.title}
                                eventStatus={event.event_status}
                                isFeatured={event.is_featured}
                                actionsFor="event-profile"
                            />
                        </div>

                        {/* Status + action icons */}
                        <div className="flex items-center flex-wrap gap-8 gap-y-4 md:justify-between mt-3">
                            <div className="flex flex-wrap items-center gap-3">
                                {statusCfg && (
                                    <Badge
                                        variant="default"
                                        className={cn(
                                            "py-1 px-2 rounded-2xl text-center text-[14px] font-medium capitalize",
                                            statusCfg.bg, statusCfg.text,
                                        )}
                                    >
                                        {statusCfg.label ?? event.event_status}
                                    </Badge>
                                )}
                                {event.age_restriction && (
                                    <Badge className={cn(space_grotesk.className, "rounded-full p-2 text-xs bg-red-500 font-medium text-white size-7")}>
                                        18+
                                    </Badge>
                                )}
                            </div>

                            <div className="flex justify-end text-secondary-9 gap-3 items-center">
                                <EventIconActionButton
                                    icon="ph:link-bold"
                                    onClick={() => copyToClipboard(`${window.location.origin}/events/${eventId}`)}
                                    className="hover:text-white"
                                    feedback="Event link copied"
                                />
                                <EventIconActionButton
                                    icon="hugeicons:share-08"
                                    onClick={handleShare}
                                    className="hover:text-white"
                                    feedback=""
                                />
                            </div>
                        </div>

                        {/* Date / Location */}
                        <div className="space-y-3 mt-7">
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-0.5">
                                    <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-accent-6" />
                                    <hr className="w-px h-2 border border-neutral-6" />
                                    <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-accent-6" />
                                </div>
                                <span className="text-brand-neutral-7 text-sm truncate flex-1">
                                    {startDate} {endDate ? `– ${endDate}` : ""}
                                </span>
                            </div>

                            {locationStr && (
                                <div className="flex items-center gap-1">
                                    <Icon icon="hugeicons:location-01" className="size-4 shrink-0 text-accent-6" />
                                    {mapsUrl ? (
                                        <Link href={mapsUrl} target="_blank" className="flex-1 text-brand-neutral-7 flex items-center gap-1">
                                            <span className="text-sm truncate">{locationStr}</span>
                                            <Icon icon="system-uicons:arrow-top-right" width="21" height="21" />
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-brand-neutral-7 truncate flex-1">{locationStr}</span>
                                    )}
                                </div>
                            )}

                            {event.location_type === "online" && (
                                <div className="flex items-center gap-1">
                                    <Icon icon="hugeicons:internet" className="size-4 shrink-0 text-accent-6" />
                                    <span className="text-sm text-brand-neutral-7">Online Event</span>
                                </div>
                            )}
                        </div>

                        {/* Tickets */}
                        <TicketPricingArea
                            tickets={event.tickets ?? []}
                            currency={event.currency}
                        />
                    </div>
                </div>

                {/* Description + Map */}
                <EventOverviewDetails
                    className=""
                    description={event.full_description || event.short_description}
                    location={event.event_location}
                />
            </section>

            <ShareEventModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                shareUrl={eventUrl}
            />
        </>
    )
}