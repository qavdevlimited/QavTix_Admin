"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { formatDateTime } from "@/helper-fns/date-utils"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "../../empty-state"
import PaginationControls from "../../tools/PaginationControl"
import AdminEventActionDropdown from "@/components/custom-utils/dropdown/AdminEventActionDropdown"
import { Icon } from "@iconify/react"
import { useAppSelector } from "@/lib/redux/hooks"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { formatPrice } from "@/helper-fns/formatPrice"
import EventInfo from "@/components/custom-utils/event/EventInfo"
import TableCheckbox from "../../tools/TableCheckbox"



const STATUS_CONFIG: Record<string, { text: string; bg: string }> = {
    active: { text: "text-emerald-700", bg: "bg-emerald-50" },
    live: { text: "text-emerald-700", bg: "bg-emerald-50" },
    draft: { text: "text-amber-600", bg: "bg-amber-50" },
    suspended: { text: "text-orange-600", bg: "bg-orange-50" },
    ended: { text: "text-brand-secondary-5", bg: "bg-brand-neutral-2" },
    cancelled: { text: "text-red-600", bg: "bg-red-50" },
    sold_out: { text: "text-blue-600", bg: "bg-blue-50" },
}

function formatLocation(loc: { city?: string; state?: string; country?: string } | string | null | undefined): string {
    if (!loc) return "—"
    if (typeof loc === "string") {
        const parts = loc.split(",").map(s => s.trim()).filter(Boolean)
        if (parts.length === 0) return "—"
        if (parts[0].startsWith("http:") || parts[0].startsWith("https:")) return "Virtual Event"
        return parts.join(", ")
    }
    return [loc.city, loc.state, loc.country].filter(Boolean).join(", ") || "—"
}

interface AdminEventsTableProps {
    items: AdminEvent[]
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

export default function AdminEventsTable({
    items,
    isLoading,
    isLoadingMore,
    activeTab,
    isEmpty,
    isError,
    search,
    currentPage,
    totalPages,
    count,
    fetchPage,
    onRefresh,
    selectedIds = [],
    onSelectionChange,
}: AdminEventsTableProps) {

    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()

    const allIds = items.map(i => i.event_id)
    const isAllSelected = items.length > 0 && allIds.every(id => selectedIds.includes(id))
    const isSomeSelected = items.length > 0 && allIds.some(id => selectedIds.includes(id)) && !isAllSelected

    const handleSelectAll = (checked: boolean) => {
        if (!onSelectionChange) return
        if (checked) {
            const newIds = new Set([...selectedIds, ...allIds])
            onSelectionChange(Array.from(newIds))
        } else {
            const newIds = selectedIds.filter(id => !allIds.includes(id))
            onSelectionChange(newIds)
        }
    }

    const handleSelectRow = (id: string, checked: boolean) => {
        if (!onSelectionChange) return
        if (checked) {
            onSelectionChange([...selectedIds, id])
        } else {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id))
        }
    }

    const handleRowClick = (id: string, e: React.MouseEvent) => {
        if (!onSelectionChange) return
        // Prevent row selection if clicking inside the dropdown or buttons
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="menu"]')) return
        
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id))
        } else {
            onSelectionChange([...selectedIds, id])
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
            text={search ? `No events matching "${search}"` : `No ${activeTab === "all" ? "" : activeTab + " "}events found`}
        />
    )

    return (
        <div className="w-full space-y-4">

            <div className="hidden md:block overflow-x-auto rounded-2xl border border-brand-neutral-3">
                <table className="w-full text-sm text-brand-secondary-9">
                    <thead className="bg-brand-neutral-3">
                        <tr className="text-brand-secondary-8 text-sm border-b border-brand-neutral-3">
                            <th className="py-4 px-5 text-left w-10">
                                {onSelectionChange && (
                                    <TableCheckbox
                                        checked={isAllSelected}
                                        indeterminate={isSomeSelected}
                                        onChange={handleSelectAll}
                                        ariaLabel="Select all events on this page"
                                    />
                                )}
                            </th>
                            <th className="py-4 px-2 text-left font-bold whitespace-nowrap">Status</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Event</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Date</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Location</th>
                            <th className="py-4 px-5 text-center font-bold whitespace-nowrap">Tickets</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Revenue</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Views</th>
                            <th className="py-4 px-4 text-right font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-neutral-2 bg-white">
                        {items.map(event => {
                            const cfg = STATUS_CONFIG[event.status] ?? { text: "text-brand-secondary-6", bg: "bg-brand-neutral-2" }
                            const isSelected = selectedIds.includes(event.event_id)
                            return (
                                <tr 
                                    key={event.event_id} 
                                    onClick={(e) => handleRowClick(event.event_id, e)}
                                    className={cn(
                                        "transition-colors",
                                        onSelectionChange && "cursor-pointer",
                                        isSelected ? "bg-brand-primary-1 hover:bg-brand-primary-2" : "hover:bg-brand-neutral-3/70"
                                    )}
                                >
                                    <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                                        {onSelectionChange && (
                                            <TableCheckbox
                                                checked={isSelected}
                                                onChange={(checked) => handleSelectRow(event.event_id, checked === true)}
                                                aria-label={`Select event ${event.title}`}
                                            />
                                        )}
                                    </td>
                                    <td className="py-4 px-2">
                                        <p className={cn("px-2 py-0.5 flex items-center rounded-full capitalize font-medium text-[10px]", cfg.text)}>
                                            <span className={cn("size-1.5 rounded-full mr-1 inline-block bg-current")} />
                                            {event.status}
                                        </p>
                                    </td>
                                    {/* Event */}
                                    <td className="py-4 px-5">
                                        <EventInfo
                                            title={event.title}
                                            image={event.featured_image}
                                            category={event.category}
                                        />
                                    </td>

                                    {/* Date */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">{formatDateTime(event.start_datetime)}</p>
                                    </td>

                                    {/* Location */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-7 max-w-40 truncate">{formatLocation(event.location)}</p>
                                    </td>

                                    {/* Tickets */}
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-xs font-semibold">
                                            {event.tickets_sold}
                                            <span className="font-normal text-brand-neutral-6"> / {event.total_listed}</span>
                                        </p>
                                    </td>

                                    {/* Revenue */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-semibold whitespace-nowrap">{isMounted && formatPrice(Number(event.revenue), user?.currency)}</p>
                                    </td>

                                    {/* Views */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-7">{event.views_count.toLocaleString()}</p>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-4 text-right">
                                        <AdminEventActionDropdown
                                            eventId={event.event_id}
                                            eventTitle={event.title}
                                            eventStatus={event.status}
                                            isFeatured={event.is_featured}
                                        />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile Cards ──────────────────────────────────── */}
            <div className="md:hidden space-y-3">
                {items.map(event => {
                    const cfg = STATUS_CONFIG[event.status] ?? { text: "text-brand-secondary-6", bg: "bg-brand-neutral-2", dot: "bg-brand-secondary-6" }
                    const isSelected = selectedIds.includes(event.event_id)
                    return (
                        <div 
                            key={event.event_id} 
                            onClick={(e) => handleRowClick(event.event_id, e)}
                            className={cn(
                                "border rounded-2xl p-4 space-y-3 transition-colors",
                                onSelectionChange && "cursor-pointer",
                                isSelected ? "border-brand-primary-5 bg-brand-primary-1" : "border-brand-neutral-3 bg-white"
                            )}
                        >
                            <div className="flex items-center gap-3 flex-wrap justify-between">
                                <div className="flex items-center gap-4 flex-wrap">
                                    {onSelectionChange && (
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <TableCheckbox
                                                checked={isSelected}
                                                onChange={(checked) => handleSelectRow(event.event_id, checked === true)}
                                                aria-label={`Select event ${event.title}`}
                                            />
                                        </div>
                                    )}
                                    <p className={cn("px-2 py-0.5 flex items-center rounded-full capitalize font-medium text-[10px]", cfg.text)}>
                                        <span className={cn("size-1.5 rounded-full mr-1 inline-block bg-current")} />
                                        {event.status}
                                    </p>
                                    <span className="text-[11px] text-brand-secondary-9">
                                        <span className="font-bold">Saves:</span> {event.saves_count ?? 0}
                                    </span>
                                    <span className="text-[11px] text-brand-secondary-9">
                                        <span className="font-bold">Views:</span> {event.views_count}
                                    </span>
                                </div>
                                <AdminEventActionDropdown
                                    eventId={event.event_id}
                                    eventTitle={event.title}
                                    eventStatus={event.status}
                                    isFeatured={event.is_featured}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative size-14 rounded-xl overflow-hidden shrink-0 bg-brand-neutral-3">
                                    {event.featured_image ? (
                                        <Image src={event.featured_image} alt={event.title} fill className="object-cover" unoptimized />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Icon icon="solar:image-linear" className="size-5 text-brand-neutral-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="text-xs font-bold text-brand-secondary-9 truncate">{event.title}</h3>
                                        <p className="text-[11px] text-brand-neutral-7 mt-0.5">{event.host_name}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-[11px] font-bold text-brand-secondary-9">Date & Time:</p>
                                        <p className="text-[11px] text-brand-secondary-7">{formatDateTime(event.start_datetime)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap text-[11px] text-brand-secondary-9">
                                <span>
                                    <span className="font-bold">Tickets Sold:</span>{" "}
                                    {event.tickets_sold} of {event.total_listed}{" "}
                                    ({event.total_listed > 0 ? Math.round((event.tickets_sold / event.total_listed) * 100) : 0}%)
                                </span>
                                <span>
                                    <span className="font-bold">Revenue:</span>{" "}
                                    {isMounted && formatPrice(Number(event.revenue), user?.currency)}
                                </span>
                            </div>

                            {/* Row 4 — Address */}
                            <p className="text-[11px] text-brand-neutral-6">{formatLocation(event.location)}</p>
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
