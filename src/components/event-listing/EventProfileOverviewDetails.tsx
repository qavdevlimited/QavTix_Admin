import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import MapEmbed from "../custom-utils/maps/MapEmbed"

interface EventOverviewDetailsProps {
    className?: string
    description: string
    location?: EventLocation | null
}

export default function EventOverviewDetails({
    className,
    description,
    location,
}: EventOverviewDetailsProps) {
    const mapQuery = location
        ? [location.venue_name, location.city, location.state, location.country].filter(Boolean).join(", ")
        : null

    return (
        <section className={cn(className, "mt-4 md:mt-0 max-w-4xl")}>
            {/* Event Overview */}
            <article className="mt-12">
                <h2 className={`${space_grotesk.className} font-bold text-xl uppercase text-brand-secondary-9 leading-5.5`}>
                    EVENT OVERVIEW
                </h2>
                <p className="mt-7 leading-relaxed text-brand-neutral-8 whitespace-pre-line">
                    {description || "No description provided."}
                </p>
            </article>

            {mapQuery && (
                <MapEmbed location={mapQuery} className="mt-14 rounded-4xl" />
            )}
        </section>
    )
}