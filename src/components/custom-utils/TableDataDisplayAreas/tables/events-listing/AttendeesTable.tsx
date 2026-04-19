import { cn } from "@/lib/utils"
import { usePagination } from "@/custom-hooks/PaginationHook"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"
import { mockTickets } from "@/components-data/demo-data"
import { TicketStatus, ticketStatusConfig } from "../../resources/status-config"
import PaginationControls from "../../tools/PaginationControl"
import { Badge } from "@/components/ui/badge"

export default function AttendeesTable() {
    
    const pagination = usePagination(mockTickets, 10)

    return (
        <div className="w-full space-y-4">
            <div className="border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Ticket ID
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Attendee
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Ticket Type
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Qty
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Amount
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Purchase Date
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-5 bg-white">
                            {pagination.currentItems.map((ticket) => {
                                const statusInfo = ticketStatusConfig[ticket.status as TicketStatus]
                                
                                return (
                                    <tr 
                                        key={ticket.id}
                                        className="hover:bg-brand-neutral-3/70 transition-colors"
                                    >
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-8 font-medium">
                                                {ticket.ticketId}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <CustomAvatar
                                                    name={ticket.attendee.name}
                                                    id={ticket.attendee.id}
                                                    size="size-9 shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-brand-secondary-9 font-medium">
                                                        {ticket.attendee.name}
                                                    </p>
                                                    <p className="text-[11px] text-brand-secondary-6 truncate">
                                                        {ticket.attendee.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-8 font-medium">
                                                {ticket.ticketType}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-8">
                                                {ticket.quantity}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-9 font-bold">
                                                ₦{ticket.amount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                                {ticket.purchaseDate}
                                                {ticket.purchaseTime && (
                                                    <span className="text-brand-secondary-6">
                                                        {' '}| {ticket.purchaseTime}
                                                    </span>
                                                )}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={cn(
                                                "inline-flex items-center border px-3 py-1.5 rounded-sm text-[10px] font-medium",
                                                statusInfo.bgColor,
                                                statusInfo.borderColor,
                                                statusInfo.color
                                            )}>
                                                {statusInfo.label}
                                            </Badge>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <PaginationControls
                endIndex={pagination.endIndex}
                startIndex={pagination.startIndex}
                totalItems={mockTickets.length}
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