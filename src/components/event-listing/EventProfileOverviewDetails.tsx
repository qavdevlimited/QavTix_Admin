import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";
import MapEmbed from "../custom-utils/maps/MapEmbed";

export default function EventOverviewDetails({ className }:{ className?: string }){
    return (
        <section className={cn(
            className,
            "mt-4 md:mt-0 max-w-4xl"
        )}>
            {/* Event Overview [Temp] */}
            <article className="mt-12">
                <h2 className={`${space_grotesk.className} font-bold text-xl uppercase text-brand-secondary-9 leading-5.5`}>EVENT OVERVIEW</h2>

                <p className="mt-7 leading-relaxed text-brand-neutral-8">
                    Lagos, get ready!
                    On Saturday, December 13, 2025, the city comes alive as Burna Boy — the global icon, Grammy-winning artist, and pioneer of Afro Fusion — returns home for the most anticipated concert of the year.
                    This isn’t just a show.
                    It’s a movement, a celebration, and an unforgettable night of sound, culture, and pure African excellence.
                    From the booming bass to the synchronized lights and electrifying dance performances, everything is designed to pull you into a world where music becomes emotion and energy becomes connection.
                    Step into a night where:
                    Thousands of voices sing along to every line
                    The lights shimmer across the Lagos skyline
                    Special guest artists take the stage for surprise performances
                    Burna Boy delivers a show crafted to shake the city to its core
                    If you’ve ever wanted to experience a concert that leaves you speechless, energized, and inspired — this is the one.
                </p>
            </article>

            <MapEmbed location="Lagos, NG" className="mt-14 rounded-4xl" />
        </section>
    )
}