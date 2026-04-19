import { usePagination } from "@/custom-hooks/PaginationHook"
import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import { mockCustomerOrders } from "@/components-data/demo-data"
import Image from "next/image"
import { formatDateTime } from "@/helper-fns/date-utils"
import { Badge } from "@/components/ui/badge"
import EventInfo from "../../event/EventInfo"


export default function UserPurchaseHistoryTable() {

    const pagination = usePagination(mockCustomerOrders, 5)

    return (
        <div className="w-full space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden!">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-2 border-b border-brand-neutral-3">
                            <tr>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Event ID</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Event</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Purchase date</th>
                                <th className="text-center py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Quantity</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Amount</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-2 bg-white">
                            {pagination.currentItems.map((order) => {                                
                                return (
                                    <tr 
                                        key={order.order_id} 
                                        className={cn(
                                            "hover:bg-brand-neutral-3/70 transition-colors",
                                        )}
                                    >
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-9">{order.event.id}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <EventInfo {...order.event} variant="desktop" />
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                                {formatDateTime(order.purchase_date)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                                {order.quantity}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                                ₦{order.amount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={cn(
                                                "p-2 rounded-md border-[0.8px] capitalize border-neutral-4",
                                                order.status === "successful" ? "text-postive-default bg-green-50" :
                                                order.status === "cancelled" ? "text-brand-secondary-4 bg-brand-secondary-1" : ""
                                            )}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {pagination.currentItems.map((order) => {
                        return (
                            <div 
                                key={order.order_id} 
                                className="border-b border-brand-neutral-5 p-4"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-1 items-center text-brand-secondary-9 pt-2 text-[11px] border-t border-brand-neutral-2">
                                            <span className="font-bold">Amount:</span>
                                            <span>
                                                ₦{order.amount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-1 items-center text-brand-secondary-9 pt-2 text-[11px] border-t border-brand-neutral-2">
                                            <span className="font-bold">Quantity:</span>
                                            <span>
                                                {order.quantity}
                                            </span>
                                        </div>
                                        <Badge className={cn(
                                            "p-1 text-[11px] rounded-sm my-0 border-[0.8px] capitalize border-neutral-4",
                                            order.status === "successful" ? "text-postive-default bg-green-50" :
                                            order.status === "cancelled" ? "text-brand-secondary-4 bg-brand-secondary-1" : ""
                                        )}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2 justify-between">
                                        <div className="flex items-start gap-2">
                                            <div className="relative size-12 rounded-lg overflow-hidden shrink-0">
                                                <Image
                                                    src={order.event.image}
                                                    alt={order.event.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-xs text-brand-secondary-9 mb-1">
                                                    {order.event.title}
                                                </h3>
                                                <p className="text-xs text-brand-neutral-6 mb-1">
                                                    {order.event.category}
                                                </p>

                                            </div>
                                        </div>
                                        <div className="flex flex-col text-brand-secondary-8">
                                            <span className="text-xs font-bold">Purchase Date:</span>
                                            <span className="text-xs">
                                                {formatDateTime(order.purchase_date, )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-brand-secondary-9">
                                        <span className="text-xs font-bold">Event ID:</span>
                                        <span className="text-xs">
                                            {order.event.id}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
            </div>

            <PaginationControls
                endIndex={pagination.endIndex}
                startIndex={pagination.startIndex}
                totalItems={mockCustomerOrders.length}
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