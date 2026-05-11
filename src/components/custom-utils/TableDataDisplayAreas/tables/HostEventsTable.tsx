"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { formatDateTime } from "@/helper-fns/date-utils"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "../empty-state"
import PaginationControls from "../tools/PaginationControl"
import HostEventActionDropdown from "@/components/custom-utils/dropdown/HostEventActionDropdown"
import { Icon } from "@iconify/react"
import { useAppSelector } from "@/lib/redux/hooks"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { formatPrice } from "@/helper-fns/formatPrice"
import TableCheckbox from "../tools/TableCheckbox"

const EVENT_STATUS_CONFIG: Record<string, { text: string; bg: string }> = {
    active: { text: "text-emerald-700", bg: "bg-emerald-50" },
    draft: { text: "text-amber-600", bg: "bg-amber-50" },
    ended: { text: "text-brand-secondary-5", bg: "bg-brand-neutral-2" },
    cancelled: { text: "text-red-600", bg: "bg-red-50" },
}

interface HostEventsTableProps {
    items: HostEvent[]
    isLoading: boolean
    isLoadingMore: boolean
    hasNext: boolean
    count: number
    onLoadMore: () => void
    isEmpty: boolean
    isError: boolean
    search: string
    currentPage: number
    activeTab: string
    totalPages: number
    fetchPage: (page: number) => void
    onRefresh?: () => void
    selectedIds?: string[]
    onSelectionChange?: (ids: string[]) => void
}

export default function HostEventsTable({
    items,
    isLoading,
    isLoadingMore,
    hasNext,
    activeTab,
    isEmpty,
    isError,
    search,
    currentPage,
    totalPages,
    fetchPage,
    onRefresh,
    selectedIds = [],
    onSelectionChange,
}: HostEventsTableProps) {
    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()

    const pageIds = items.map(e => e.event_id)
    const allPageSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id))
    const somePageSelected = pageIds.some(id => selectedIds.includes(id)) && !allPageSelected

    const toggleRow = (id: string) => {
        if (!onSelectionChange) return
        onSelectionChange(selectedIds.includes(id) ? selectedIds.filter(s => s !== id) : [...selectedIds, id])
    }

    const toggleAll = () => {
        if (!onSelectionChange) return
        if (allPageSelected) {
            onSelectionChange(selectedIds.filter(id => !pageIds.includes(id)))
        } else {
            onSelectionChange([...new Set([...selectedIds, ...pageIds])])
        }
    }



    if (isLoading) return <TableLoader />

    if (isError) return (
        <EmptyTicketsState
            title="Something went wrong"
            text="Failed to load events. Please try again."
        />
    )

    if (isEmpty) return (
        <EmptyTicketsState
            title={search ? "No results found" : "No events yet"}
            text={search ? `No events matching "${search}"` : `No ${activeTab} events yet`}
        />
    )

    return (
        <div className="w-full space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-brand-neutral-3">
                <table className="w-full text-sm text-brand-secondary-9">
                    <thead className="bg-brand-neutral-3">
                        <tr className="text-brand-secondary-8 text-sm border-b border-brand-neutral-3">
                            {onSelectionChange && (
                                <th className="py-4 pl-5 pr-2 w-8">
                                    <TableCheckbox
                                        checked={allPageSelected}
                                        indeterminate={somePageSelected}
                                        onChange={toggleAll}
                                        ariaLabel="Select all events on this page"
                                    />
                                </th>
                            )}
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Event</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Status</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Date</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Location</th>
                            <th className="py-4 px-5 text-center font-bold whitespace-nowrap">Tickets Sold</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Revenue</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Views</th>
                            <th className="py-4 px-4 text-right font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-neutral-2 bg-white">
                        {items.map(event => {
                            const statusCfg = EVENT_STATUS_CONFIG[event.status] ?? { text: "text-brand-secondary-6", bg: "bg-brand-neutral-2" }
                            const isSelected = selectedIds.includes(event.event_id)
                            return (
                                <tr
                                    key={event.event_id}
                                    onClick={() => toggleRow(event.event_id)}
                                    className={cn(
                                        "transition-colors",
                                        onSelectionChange && "cursor-pointer",
                                        isSelected
                                            ? "bg-brand-primary-1 hover:bg-brand-primary-2/40"
                                            : "hover:bg-brand-neutral-3/70"
                                    )}
                                >
                                    {onSelectionChange && (
                                        <td className="py-4 pl-5 pr-2" onClick={e => e.stopPropagation()}>
                                            <TableCheckbox
                                                checked={isSelected}
                                                onChange={() => toggleRow(event.event_id)}
                                                ariaLabel={`Select ${event.title}`}
                                            />
                                        </td>
                                    )}
                                    {/* Event Info */}
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3 max-w-72">
                                            <div className="relative size-10 rounded-lg overflow-hidden shrink-0 bg-brand-neutral-3">
                                                {event.featured_image ? (
                                                    <Image src={event.featured_image} alt={event.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Icon icon="solar:image-linear" className="size-4 text-brand-neutral-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-brand-secondary-9 truncate">{event.title}</p>
                                                <p className="text-[11px] text-brand-neutral-7 mt-0.5">{event.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Status */}
                                    <td className="py-4 px-5">
                                        <Badge className={cn("px-2 py-1 rounded-md border-[0.8px] capitalize border-brand-neutral-3 font-medium text-[11px]", statusCfg.text, statusCfg.bg)}>
                                            {event.status}
                                        </Badge>
                                    </td>
                                    {/* Date */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                            {formatDateTime(event.start_datetime)}
                                        </p>
                                    </td>
                                    {/* Location */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-7 max-w-36 truncate">{event.location}</p>
                                    </td>
                                    {/* Tickets sold */}
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-xs font-semibold">
                                            {event.tickets_sold}
                                            <span className="font-normal text-brand-neutral-6"> / {event.total_listed}</span>
                                        </p>
                                    </td>
                                    {/* Revenue */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-semibold whitespace-nowrap">
                                            {isMounted && formatPrice(Number(event.revenue), user?.currency)}
                                        </p>
                                    </td>
                                    {/* Views */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-7">{event.views_count.toLocaleString()}</p>
                                    </td>
                                    {/* Actions */}
                                    <td className="py-4 px-4 text-right" onClick={e => e.stopPropagation()}>
                                        <HostEventActionDropdown
                                            eventId={event.event_id}
                                            eventTitle={event.title}
                                            eventStatus={event.status}
                                            onRefresh={onRefresh}
                                        />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {items.map(event => {
                    const statusCfg = EVENT_STATUS_CONFIG[event.status] ?? { text: "text-brand-secondary-6", bg: "bg-brand-neutral-2" }
                    const isSelected = selectedIds.includes(event.event_id)
                    return (
                        <div
                            key={event.event_id}
                            onClick={() => toggleRow(event.event_id)}
                            className={cn(
                                "border rounded-2xl p-4 bg-white transition-colors",
                                onSelectionChange && "cursor-pointer",
                                isSelected
                                    ? "border-brand-primary-5 bg-brand-primary-1"
                                    : "border-brand-neutral-3"
                            )}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                {onSelectionChange && (
                                    <TableCheckbox
                                        checked={isSelected}
                                        onChange={() => toggleRow(event.event_id)}
                                        ariaLabel={`Select ${event.title}`}
                                        className="mt-1"
                                    />
                                )}
                                <div className="relative size-14 rounded-xl overflow-hidden shrink-0 bg-brand-neutral-3">
                                    {event.featured_image ? (
                                        <Image src={event.featured_image} alt={event.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Icon icon="solar:image-linear" className="size-5 text-brand-neutral-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-xs font-bold text-brand-secondary-9 truncate">{event.title}</h3>
                                        <div onClick={e => e.stopPropagation()}>
                                            <HostEventActionDropdown
                                                eventId={event.event_id}
                                                eventTitle={event.title}
                                                eventStatus={event.status}
                                                onRefresh={onRefresh}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-brand-neutral-7 mt-0.5">{event.category}</p>
                                    <Badge className={cn("mt-1 px-2 py-0.5 rounded-md border-[0.8px] capitalize border-brand-neutral-3 font-medium text-[10px]", statusCfg.text, statusCfg.bg)}>
                                        {event.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-secondary-7 border-t border-brand-neutral-2 pt-3">
                                <div><span className="font-bold">Date:</span> {formatDateTime(event.start_datetime)}</div>
                                <div><span className="font-bold">Tickets:</span> {event.tickets_sold}/{event.total_listed}</div>
                                <div><span className="font-bold">Revenue:</span> {isMounted && formatPrice(Number(event.revenue), user?.currency)}</div>
                                <div><span className="font-bold">Views:</span> {event.views_count}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={hasNext}
                hasPreviousPage={currentPage > 1}
                onNextPage={() => fetchPage(currentPage + 1)}
                onPreviousPage={() => fetchPage(currentPage - 1)}
                isLoadingMore={isLoadingMore}
                startIndex={0}
                endIndex={0}
                totalItems={0}
            />
        </div>
    )
}
