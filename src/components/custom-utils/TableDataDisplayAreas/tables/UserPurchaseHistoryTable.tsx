import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import Image from "next/image"
import { formatDateTime } from "@/helper-fns/date-utils"
import { Badge } from "@/components/ui/badge"
import EventInfo from "../../event/EventInfo"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "../empty-state"
import { orderStatusConfig } from "../resources/status-config"
import { formatPrice } from "@/helper-fns/formatPrice"
import { useAppSelector } from "@/lib/redux/hooks"

interface UserPurchaseHistoryTableProps {
    items: UserPurchaseOrder[]
    isLoading: boolean
    isLoadingMore: boolean
    hasNext: boolean
    count: number
    onLoadMore: () => void
    isEmpty: boolean
    isError: boolean
    search: string
    currentPage: number
    totalPages: number
    fetchPage: (page: number) => void
}

export default function UserPurchaseHistoryTable({
    items,
    isLoading,
    isLoadingMore,
    count,
    isEmpty,
    isError,
    search,
    currentPage,
    totalPages,
    fetchPage,
}: UserPurchaseHistoryTableProps) {

    const { user } = useAppSelector(store => store.authUser)

    if (isLoading) return <TableLoader />

    if (isError) {
        return (
            <EmptyTicketsState
                title="Something went wrong"
                text="Failed to load purchase history. Please try again."
            />
        )
    }

    if (isEmpty) {
        return (
            <EmptyTicketsState
                title={search ? "No results found" : "No purchase history"}
                text={search ? `No orders matching "${search}"` : "This user hasn't made any purchases yet."}
            />
        )
    }

    if (!items.length) {
        return (
            <EmptyTicketsState
                title="No orders"
                text="No purchase orders available for the selected filters."
            />
        )
    }

    return (
        <div className="w-full space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden!">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3">
                            <tr className="text-brand-secondary-8 text-sm border-b border-brand-neutral-3">
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Event ID</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Event</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Purchase date</th>
                                <th className="text-center py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Quantity</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Amount</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-2 bg-white">
                            {items.map((order) => {
                                const statusCfg = orderStatusConfig[order.status.toLowerCase()] ?? { text: "text-brand-secondary-6", bg: "bg-brand-neutral-2" }

                                return (
                                    <tr
                                        key={order.order_id}
                                        className="hover:bg-brand-neutral-3/70 transition-colors"
                                    >
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-9">{order.order_id}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <EventInfo category={order.event_category} title={order.event_name} image={order.event_image} variant="desktop" />
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
                                                {formatPrice(Number(order.amount), user?.currency)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={cn(
                                                "px-2 py-1 rounded-md border-[0.8px] capitalize border-brand-neutral-4 font-medium text-xs",
                                                statusCfg.text,
                                                statusCfg.bg,
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
                {items.map((order) => {
                    const statusCfg = orderStatusConfig[order.status] ?? { text: "text-brand-secondary-6", bg: "bg-brand-neutral-2" }

                    return (
                        <div
                            key={order.order_id}
                            className="border-b border-brand-neutral-5 p-4"
                        >
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1 items-center text-brand-secondary-9 pt-2 text-[11px] border-t border-brand-neutral-2">
                                        <span className="font-bold">Amount:</span>
                                        <span>{formatPrice(Number(order.amount), user?.currency)}</span>
                                    </div>
                                    <div className="flex gap-1 items-center text-brand-secondary-9 pt-2 text-[11px] border-t border-brand-neutral-2">
                                        <span className="font-bold">Quantity:</span>
                                        <span>{order.quantity}</span>
                                    </div>
                                    <Badge className={cn(
                                        "px-2 py-1 rounded-md border-[0.8px] capitalize border-brand-neutral-4 font-medium text-xs",
                                        statusCfg.text,
                                        statusCfg.bg,
                                    )}>
                                        {order.status}
                                    </Badge>
                                </div>
                                <div className="flex gap-2 justify-between">
                                    <div className="flex items-start gap-2">
                                        <div className="relative size-12 rounded-lg overflow-hidden shrink-0">
                                            <Image
                                                src={order.event_image}
                                                alt={order.event_name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-xs text-brand-secondary-9 mb-1">
                                                {order.event_name}
                                            </h3>
                                            <p className="text-xs text-brand-neutral-6 mb-1">
                                                {order.event_category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-brand-secondary-8">
                                        <span className="text-xs font-bold">Purchase Date:</span>
                                        <span className="text-xs">
                                            {formatDateTime(order.purchase_date)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center text-brand-secondary-9">
                                    <span className="text-xs font-bold">Event ID:</span>
                                    <span className="text-xs">{order.order_id}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls
                endIndex={Math.min(currentPage * 10, count)}
                startIndex={(currentPage - 1) * 10 + 1}
                totalItems={count}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                onNextPage={() => fetchPage(currentPage + 1)}
                onPreviousPage={() => fetchPage(currentPage - 1)}
                currentPage={currentPage}
                totalPages={totalPages}
                isLoadingMore={isLoadingMore}
            />
        </div>
    )
}