"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/helper-fns/date-utils"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "../../empty-state"
import PaginationControls from "../../tools/PaginationControl"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"
import Image from "next/image"

const STATUS_CONFIG: Record<string, { text: string; bg: string; border: string }> = {
    pending:    { text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
    approved:   { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    declined:   { text: "text-red-600",     bg: "bg-red-50",     border: "border-red-200" },
    processing: { text: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
}

interface AdminPayoutHistoryTableProps {
    items: AdminPayout[]
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

export default function AdminPayoutHistoryTable({
    items, isLoading, isLoadingMore, isEmpty, isError,
    search, currentPage, totalPages, count, fetchPage,
}: AdminPayoutHistoryTableProps) {

    if (isLoading) return <TableLoader />
    if (isError) return <EmptyTicketsState title="Something went wrong" text="Failed to load payout history." />
    if (isEmpty) return (
        <EmptyTicketsState
            title={search ? "No results found" : "No payout history"}
            text={search ? `No payouts matching "${search}"` : "No approved payouts yet."}
        />
    )

    return (
        <div className="w-full space-y-4">
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-brand-neutral-3">
                <table className="w-full text-sm text-brand-secondary-9">
                    <thead>
                        <tr className="bg-brand-neutral-2/60 text-brand-secondary-6 text-xs border-b border-brand-neutral-3">
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Recipient</th>
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Bank Details</th>
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Amount</th>
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Date</th>
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-neutral-2 bg-white">
                        {items.map(payout => {
                            const cfg = STATUS_CONFIG[payout.status] ?? STATUS_CONFIG.approved
                            const sellerName = payout.seller.business_name ?? payout.seller.name
                            return (
                                <tr key={payout.payout_id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <CustomAvatar name={payout.seller.name} id={payout.payout_id} profileImg={payout.seller.profile_picture ?? undefined} size="size-8 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-brand-secondary-9 truncate">{sellerName}</p>
                                                <p className="text-[11px] text-brand-secondary-6 truncate">{payout.seller.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-medium text-brand-secondary-8">{payout.bank_account.bank_name}</p>
                                        <p className="text-[11px] text-brand-secondary-6">{payout.bank_account.account_number}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-bold whitespace-nowrap">₦{Number(payout.amount).toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">{formatDateTime(payout.request_date)}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <Badge className={cn("px-2 py-1 rounded-md border-[0.8px] capitalize font-medium text-[11px]", cfg.text, cfg.bg, cfg.border)}>
                                            {payout.status}
                                        </Badge>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3">
                {items.map(payout => {
                    const cfg = STATUS_CONFIG[payout.status] ?? STATUS_CONFIG.approved
                    const sellerName = payout.seller.business_name ?? payout.seller.name
                    return (
                        <div key={payout.payout_id} className="border border-brand-neutral-3 rounded-2xl p-4 bg-white">
                            <div className="flex items-center gap-3 mb-3">
                                <CustomAvatar name={payout.seller.name} id={payout.payout_id} profileImg={payout.seller.profile_picture ?? undefined} size="size-10 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-brand-secondary-9 truncate">{sellerName}</p>
                                    <p className="text-[11px] text-brand-secondary-6 truncate">{payout.seller.email}</p>
                                </div>
                                <Badge className={cn("px-2 py-0.5 rounded-md border-[0.8px] capitalize font-medium text-[10px]", cfg.text, cfg.bg, cfg.border)}>
                                    {payout.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-secondary-7 border-t border-brand-neutral-2 pt-3">
                                <div><span className="font-bold">Amount:</span> ₦{Number(payout.amount).toLocaleString()}</div>
                                <div><span className="font-bold">Bank:</span> {payout.bank_account.bank_name}</div>
                                <div><span className="font-bold">Account:</span> {payout.bank_account.account_number}</div>
                                <div><span className="font-bold">Date:</span> {formatDateTime(payout.request_date)}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls currentPage={currentPage} totalPages={totalPages} hasNextPage={currentPage < totalPages} hasPreviousPage={currentPage > 1} onNextPage={() => fetchPage(currentPage + 1)} onPreviousPage={() => fetchPage(currentPage - 1)} isLoadingMore={isLoadingMore} startIndex={(currentPage - 1) * 10 + 1} endIndex={Math.min(currentPage * 10, count)} totalItems={count} />
        </div>
    )
}
