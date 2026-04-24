"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/helper-fns/date-utils"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "../../empty-state"
import PaginationControls from "../../tools/PaginationControl"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"
import { useAppSelector } from "@/lib/redux/hooks"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { formatPrice } from "@/helper-fns/formatPrice"

const TICKET_STATUS_CONFIG: Record<string, { text: string; bg: string; border: string }> = {
    active: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    used: { text: "text-brand-secondary-5", bg: "bg-brand-neutral-2", border: "border-brand-neutral-3" },
    cancelled: { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
    resold: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
}

interface EventAttendeesTableProps {
    items: AdminEventAttendee[]
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

export default function EventAttendeesTable({
    items,
    isLoading,
    isLoadingMore,
    isEmpty,
    isError,
    search,
    currentPage,
    totalPages,
    count,
    fetchPage,
}: EventAttendeesTableProps) {
    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()


    if (isLoading) return <TableLoader />

    if (isError) return (
        <EmptyTicketsState
            title="Something went wrong"
            text="Failed to load attendees. Please try again."
        />
    )

    if (isEmpty) return (
        <EmptyTicketsState
            title={search ? "No results found" : "No attendees yet"}
            text={search ? `No attendees matching "${search}"` : "No tickets have been sold for this event."}
        />
    )

    return (
        <div className="w-full space-y-4">

            {/* ── Desktop Table ──────────────────────────────────── */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-brand-neutral-3">
                <table className="w-full text-sm text-brand-secondary-9">
                    <thead className="bg-brand-neutral-3">
                        <tr className="text-brand-secondary-8 text-sm border-b border-brand-neutral-3">
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Ticket ID</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Attendee</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Ticket Type</th>
                            <th className="py-4 px-5 text-center font-bold whitespace-nowrap">Qty</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Amount</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Purchase Date</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-neutral-2 bg-white">
                        {items.map(ticket => {
                            const cfg = TICKET_STATUS_CONFIG[ticket.status?.toLowerCase()] ?? { text: "text-brand-secondary-6", bg: "bg-brand-neutral-2", border: "border-brand-neutral-3" }
                            return (
                                <tr key={ticket.ticket_id} className="hover:bg-brand-neutral-3/70 transition-colors">

                                    {/* Ticket ID */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs  text-brand-secondary-8 truncate max-w-36">{ticket.ticket_id}</p>
                                    </td>

                                    {/* Attendee */}
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <CustomAvatar
                                                name={ticket.attendee_name || "A"}
                                                id={ticket.ticket_id}
                                                profileImg={ticket.profile_picture ?? undefined}
                                                size="size-8 shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-brand-secondary-9 truncate">{ticket.attendee_name || "—"}</p>
                                                <p className="text-[11px] text-brand-secondary-6 truncate">{ticket.attendee_email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Ticket Type */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 font-medium">{ticket.ticket_type || "—"}</p>
                                    </td>

                                    {/* Qty */}
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-xs font-semibold">{ticket.quantity}</p>
                                    </td>

                                    {/* Amount */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-semibold whitespace-nowrap">{isMounted && formatPrice(Number(ticket.amount), user?.currency)}</p>
                                    </td>

                                    {/* Purchase Date */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">{formatDateTime(ticket.purchase_date)}</p>
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-5">
                                        <Badge className={cn("px-2 py-1 rounded-md border-[0.8px] capitalize font-medium text-[11px]", cfg.text, cfg.bg, cfg.border)}>
                                            {ticket.status}
                                        </Badge>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile Cards ──────────────────────────────────── */}
            <div className="md:hidden space-y-3">
                {items.map(ticket => {
                    const cfg = TICKET_STATUS_CONFIG[ticket.status?.toLowerCase()] ?? { text: "text-brand-secondary-6", bg: "bg-brand-neutral-2", border: "border-brand-neutral-3" }
                    return (
                        <div key={ticket.ticket_id} className="border border-brand-neutral-3 rounded-2xl p-4 bg-white">
                            <div className="flex items-center gap-3 mb-3">
                                <CustomAvatar
                                    name={ticket.attendee_name || "A"}
                                    id={ticket.ticket_id}
                                    profileImg={ticket.profile_picture ?? undefined}
                                    size="size-10 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-brand-secondary-9 truncate">{ticket.attendee_name || "—"}</p>
                                    <p className="text-[11px] text-brand-secondary-6 truncate">{ticket.attendee_email}</p>
                                </div>
                                <Badge className={cn("px-2 py-0.5 rounded-md border-[0.8px] capitalize font-medium text-[10px]", cfg.text, cfg.bg, cfg.border)}>
                                    {ticket.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-secondary-7 border-t border-brand-neutral-2 pt-3">
                                <div><span className="font-bold">Type:</span> {ticket.ticket_type || "—"}</div>
                                <div><span className="font-bold">Qty:</span> {ticket.quantity}</div>
                                <div><span className="font-bold">Amount:</span> {isMounted && formatPrice(Number(ticket.amount), user?.currency)}</div>
                                <div><span className="font-bold">Date:</span> {formatDateTime(ticket.purchase_date)}</div>
                                <div className="col-span-2">
                                    <span className="font-bold">ID:</span>{" "}
                                    <span className=" text-[10px]">{ticket.ticket_id}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                onNextPage={() => fetchPage(currentPage + 1)}
                onPreviousPage={() => fetchPage(currentPage - 1)}
                isLoadingMore={isLoadingMore}
                startIndex={(currentPage - 1) * 10 + 1}
                endIndex={Math.min(currentPage * 10, count)}
                totalItems={count}
            />
        </div>
    )
}
