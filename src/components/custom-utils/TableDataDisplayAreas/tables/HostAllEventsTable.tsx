import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { usePagination } from "@/custom-hooks/PaginationHook"
import PaginationControls from "../tools/PaginationControl"
import TableItemDropdown from "../../dropdown/TableItemDropdown"
import { Dispatch, SetStateAction } from "react"
import { mockUpcomingEvents } from "@/components-data/demo-data"
import getStatusConfig from "@/helper-fns/getStatusColor"
import { eventsStatusConfig } from "../resources/status-config"
import EventInfo from "../../event/EventInfo"
import { EventStatus, getHostProfileActions } from "../../dropdown/resources/management-actions"


interface EventsTableProps {
    selectedEvents: string[];
    setSelectedEvents: Dispatch<SetStateAction<string[]>>;
}

export default function HostAllEventsTable({ selectedEvents, setSelectedEvents }: EventsTableProps) {
    
    const pagination = usePagination(mockUpcomingEvents, 10)

    const isAllSelected = pagination.currentItems.length > 0 && 
        pagination.currentItems.every(event => selectedEvents.includes(event.id))

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedEvents([])
        } else {
            setSelectedEvents(pagination.currentItems.map(e => e.id))
        }
    }

    const toggleSelection = (id: string) => {
        setSelectedEvents(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const isSelected = (id: string) =>  selectedEvents.includes(id)

    return (
        <div className="w-full space-y-4">
            <div className="border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="w-12 p-4">
                                    <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Event Name</th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Date & Time</th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Location</th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Tickets Sold</th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Revenue</th>
                                <th className="w-12 py-4 px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-5 bg-white">
                            {pagination.currentItems.map((event) => (
                                <tr 
                                    key={event.id}
                                    className={cn(
                                        "hover:bg-brand-neutral-3/70 transition-colors",
                                        isSelected(event.id) && "bg-brand-primary-1 hover:bg-brand-primary-1"
                                    )}
                                    onClick={() => toggleSelection(event.id)}

                                    >
                                    <td className="p-4">
                                        <Checkbox 
                                            checked={selectedEvents.includes(event.id)} 
                                            onClick={(e) => e.stopPropagation()}
                                            onCheckedChange={() => toggleSelection(event.id)} 
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Icon icon="mdi:circle" className={cn('w-2 h-2', getStatusConfig(event.status as EventStatus, eventsStatusConfig).color)} />
                                            <span className={cn('text-xs font-medium capitalize', getStatusConfig(event.status as EventStatus, eventsStatusConfig).color)}>
                                                {event.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <EventInfo 
                                            variant="desktop"
                                            category={event.category}
                                            image={event.image}
                                            title={event.title}
                                        />
                                    </td>
                                    <td className="p-4 text-xs text-brand-secondary-8 whitespace-nowrap">
                                        {event.date}
                                    </td>
                                    <td className="p-4">
                                        <p className="text-xs text-brand-secondary-6 max-w-50 line-clamp-2">
                                            {event.location}
                                        </p>
                                    </td>
                                    <td className="p-4 max-w-50">
                                        <div className="flex items-center flex-col text-[11px]">
                                            <span className="text-brand-secondary-9">
                                                {event.ticketsSold}/{event.totalTickets}
                                            </span>
                                            <span className="text-brand-secondary-6 whitespace-nowrap">
                                                <span className="font-bold">Views:</span> {event.ticketsSold * 4} | <span className="font-bold">Saves:</span> {Math.floor(event.ticketsSold / 2)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-xs text-brand-secondary-9">
                                        ₦{event.revenue.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <TableItemDropdown id={event.id} actions={getHostProfileActions(event.status as any, event.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <PaginationControls
                endIndex={pagination.endIndex}
                startIndex={pagination.startIndex}
                totalItems={mockUpcomingEvents.length}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onNextPage={pagination.nextPage}
                onPreviousPage={pagination.previousPage}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
            />
        </div>
    )
}