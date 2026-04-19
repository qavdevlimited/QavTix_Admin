import { ticketTiers } from "@/components-data/demo-data"
import { useState } from "react"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"

interface TicketPricingAreaProps {
  tickets?: Partial<TicketTier>[]
  initialVisibleCount?: number
  onGetTicket?: (ticket: TicketTier) => void
}

export default function TicketPricingArea({
  tickets = ticketTiers,
  initialVisibleCount = 4,
}: TicketPricingAreaProps) {

    const [showAll, setShowAll] = useState(false)

    const visibleTickets = showAll ? tickets : tickets.slice(0, initialVisibleCount)
    const hasMore = tickets.length > initialVisibleCount


    return (
        <section>
            <div className="w-full bg-brand-accent-1 mt-7 rounded-xl p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center flex-wrap gap-6 overflow-x-auto pb-2">
                        {visibleTickets.map((ticket) => (
                            <div key={ticket.id} className="shrink-0 border-e-[1.5px] pe-3 border-brand-accent-2">
                                <p className="text-sm text-brand-neutral-7 mb-2">{ticket.name}</p>
                                <p className="text-sm font-medium text-brand-neutral-10 tracking-[10%] md:tracking-[12%]">
                                    {ticket.currency}{ticket.price?.toLocaleString()}
                                </p>
                            </div>
                        ))}

                        {hasMore && !showAll && (
                            <button
                                onClick={() => setShowAll(true)}
                                className="shrink-0 text-sm text-brand-neutral-7 hover:text-brand-neutral-9 underline transition-colors"
                            >
                                See more
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <ActionButton1 buttonText="Download Attendee List" />
            </div>
        </section>
    )
}