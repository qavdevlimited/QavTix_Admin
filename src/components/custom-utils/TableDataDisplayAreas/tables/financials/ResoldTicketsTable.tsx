import { cn } from "@/lib/utils"
import { usePagination } from "@/custom-hooks/PaginationHook"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"
import { mockResoldTickets } from "@/components-data/demo-data"
import PaginationControls from "../../tools/PaginationControl"
import { PaymentStatus, paymentStatusConfig } from "../../resources/status-config"
import { Badge } from "@/components/ui/badge"

export default function ResoldTicketsTable() {
    
    const pagination = usePagination(mockResoldTickets, 10)

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
                                    Reseller
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Event
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Sold for
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Resale Date
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-5 bg-white">
                            {pagination.currentItems.map((ticket) => {
                                const statusInfo = paymentStatusConfig[ticket.status as PaymentStatus]
                                
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
                                                    name={ticket.reseller.name}
                                                    id={ticket.reseller.id}
                                                    size="size-9 shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-brand-secondary-9 font-medium">
                                                        {ticket.reseller.name}
                                                    </p>
                                                    <p className="text-[11px] text-brand-secondary-6 truncate">
                                                        {ticket.reseller.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={ticket.event.image} 
                                                    alt={ticket.event.title}
                                                    className="size-9 rounded-lg object-cover shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-brand-secondary-9 font-medium">
                                                        {ticket.event.title}
                                                    </p>
                                                    <p className="text-[11px] text-brand-secondary-6">
                                                        Ticket Type: {ticket.event.ticketType}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-9 font-bold">
                                                ₦{ticket.soldFor.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                                {ticket.resaleDate}
                                                {ticket.resaleTime && (
                                                    <span className="text-brand-secondary-6">
                                                        {' '}| {ticket.resaleTime}
                                                    </span>
                                                )}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={cn(
                                                "inline-flex items-center px-3 py-1.5 rounded-sm text-[10px] font-medium",
                                                statusInfo.className,
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
                totalItems={mockResoldTickets.length}
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