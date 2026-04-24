"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/helper-fns/date-utils"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "../../empty-state"
import PaginationControls from "../../tools/PaginationControl"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"
import Image from "next/image"
import { useAppSelector } from "@/lib/redux/hooks"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { formatPrice } from "@/helper-fns/formatPrice"

const STATUS_CONFIG: Record<string, { text: string; bg: string; border: string }> = {
    active:    { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    sold:      { text: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
    cancelled: { text: "text-red-600",     bg: "bg-red-50",     border: "border-red-200" },
    expired:   { text: "text-brand-secondary-5", bg: "bg-brand-neutral-2", border: "border-brand-neutral-3" },
}

interface AdminMarketplaceTableProps {
    items: AdminMarketplaceListing[]
    isLoading: boolean
    isLoadingMore: boolean
    isEmpty: boolean
    isError: boolean
    search: string
    currentPage: number
    totalPages: number
    count: number
    fetchPage: (page: number) => void
    hasNext: boolean
    onLoadMore: () => void
}

export default function AdminMarketplaceTable({
    items, isLoading, isLoadingMore, isEmpty, isError,
    search, currentPage, totalPages, count, fetchPage,
}: AdminMarketplaceTableProps) {
    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()


    if (isLoading) return <TableLoader />
    if (isError) return <EmptyTicketsState title="Something went wrong" text="Failed to load resale orders." />
    if (isEmpty) return (
        <EmptyTicketsState
            title={search ? "No results found" : "No resale listings"}
            text={search ? `No listings matching "${search}"` : "No tickets have been listed for resale yet."}
        />
    )

    return (
        <div className="w-full space-y-4">
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-brand-neutral-3">
                <table className="w-full text-sm text-brand-secondary-9">
                    <thead className="bg-brand-neutral-3">
                        <tr className="text-brand-secondary-8 text-sm border-b border-brand-neutral-3">
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Event</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Reseller</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Listing Price</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Listed Date</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-neutral-2 bg-white">
                        {items.map(listing => {
                            const cfg = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG.active
                            return (
                                <tr key={listing.listing_id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            {listing.event.featured_image ? (
                                                <div className="size-9 shrink-0 rounded-lg overflow-hidden border border-brand-neutral-3">
                                                    <Image src={listing.event.featured_image} alt={listing.event.title} width={36} height={36} className="object-cover w-full h-full" />
                                                </div>
                                            ) : (
                                                <div className="size-9 shrink-0 rounded-lg bg-brand-neutral-3 flex items-center justify-center text-[10px] text-brand-neutral-6">IMG</div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-brand-secondary-9 truncate max-w-48">{listing.event.title}</p>
                                                <p className="text-[11px] text-brand-secondary-6">{listing.event.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <CustomAvatar name={listing.reseller.name} id={String(listing.listing_id)} profileImg={listing.reseller.profile_picture ?? undefined} size="size-8 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-brand-secondary-9 truncate">{listing.reseller.name}</p>
                                                <p className="text-[11px] text-brand-secondary-6 truncate">{listing.reseller.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-bold whitespace-nowrap">{isMounted && formatPrice(Number(listing.listing_price), user?.currency)}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">{formatDateTime(listing.listing_date)}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <Badge className={cn("px-2 py-1 rounded-md border-[0.8px] capitalize font-medium text-[11px]", cfg.text, cfg.bg, cfg.border)}>
                                            {listing.status}
                                        </Badge>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3">
                {items.map(listing => {
                    const cfg = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG.active
                    return (
                        <div key={listing.listing_id} className="border border-brand-neutral-3 rounded-2xl p-4 bg-white">
                            <div className="flex items-center gap-3 mb-3">
                                {listing.event.featured_image ? (
                                    <div className="size-10 shrink-0 rounded-lg overflow-hidden border border-brand-neutral-3">
                                        <Image src={listing.event.featured_image} alt={listing.event.title} width={40} height={40} className="object-cover w-full h-full" />
                                    </div>
                                ) : (
                                    <div className="size-10 shrink-0 rounded-lg bg-brand-neutral-3" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-brand-secondary-9 truncate">{listing.event.title}</p>
                                    <p className="text-[11px] text-brand-secondary-6">{listing.event.category}</p>
                                </div>
                                <Badge className={cn("px-2 py-0.5 rounded-md border-[0.8px] capitalize font-medium text-[10px]", cfg.text, cfg.bg, cfg.border)}>
                                    {listing.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-secondary-7 border-t border-brand-neutral-2 pt-3">
                                <div><span className="font-bold">Reseller:</span> {listing.reseller.name}</div>
                                <div><span className="font-bold">Price:</span> {isMounted && formatPrice(Number(listing.listing_price), user?.currency)}</div>
                                <div className="col-span-2"><span className="font-bold">Listed:</span> {formatDateTime(listing.listing_date)}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls currentPage={currentPage} totalPages={totalPages} hasNextPage={currentPage < totalPages} hasPreviousPage={currentPage > 1} onNextPage={() => fetchPage(currentPage + 1)} onPreviousPage={() => fetchPage(currentPage - 1)} isLoadingMore={isLoadingMore} startIndex={(currentPage - 1) * 10 + 1} endIndex={Math.min(currentPage * 10, count)} totalItems={count} />
        </div>
    )
}
