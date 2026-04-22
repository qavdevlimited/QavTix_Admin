"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/helper-fns/date-utils"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "../../empty-state"
import PaginationControls from "../../tools/PaginationControl"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"

const STATUS_CONFIG: Record<string, { text: string; bg: string; border: string }> = {
    active: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    expired: { text: "text-brand-secondary-5", bg: "bg-brand-neutral-2", border: "border-brand-neutral-3" },
    cancelled: { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
}

const PLAN_COLORS: Record<string, string> = {
    pro: "text-orange-600",
    enterprise: "text-rose-600",
}

interface AdminSubscriptionsTableProps {
    items: AdminSubscription[]
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

export default function AdminSubscriptionsTable({
    items, isLoading, isLoadingMore, isEmpty, isError,
    search, currentPage, totalPages, count, fetchPage,
}: AdminSubscriptionsTableProps) {

    if (isLoading) return <TableLoader />
    if (isError) return <EmptyTicketsState title="Something went wrong" text="Failed to load subscriptions." />
    if (isEmpty) return (
        <EmptyTicketsState
            title={search ? "No results found" : "No subscriptions"}
            text={search ? `No subscriptions matching "${search}"` : "No subscription payments found."}
        />
    )

    return (
        <div className="w-full space-y-4">
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-brand-neutral-3">
                <table className="w-full text-sm text-brand-secondary-9">
                    <thead>
                        <tr className="bg-brand-neutral-2/60 text-brand-secondary-6 text-xs border-b border-brand-neutral-3">
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Subscriber</th>
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Plan</th>
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Billing</th>
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Amount</th>
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Started</th>
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Expires</th>
                            <th className="py-4 px-5 text-left font-medium whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-neutral-2 bg-white">
                        {items.map(sub => {
                            const cfg = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.expired

                            return (
                                <tr key={sub.payment_id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <CustomAvatar name={sub.profile.name} id={sub.payment_id} profileImg={sub.profile.profile_picture ?? undefined} size="size-8 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-brand-secondary-9 truncate">{sub.profile.business_name}</p>
                                                <p className="text-[11px] text-brand-secondary-6 truncate">{sub.profile.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className={cn("text-xs font-semibold capitalize text-brand-secondary-8")}>{sub.plan.name}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 capitalize">{sub.billing_cycle}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-bold whitespace-nowrap">₦{Number(sub.amount).toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">{formatDateTime(sub.timeline.started_at)}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">{formatDateTime(sub.timeline.expires_at)}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <Badge className={cn("px-2 py-1 rounded-md border-[0.8px] capitalize font-medium text-[11px]", cfg.text, cfg.bg, cfg.border)}>
                                            {sub.status}
                                        </Badge>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3">
                {items.map(sub => {
                    const cfg = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.expired
                    return (
                        <div key={sub.payment_id} className="border border-brand-neutral-3 rounded-2xl p-4 bg-white">
                            <div className="flex items-center gap-3 mb-3">
                                <CustomAvatar name={sub.profile.name} id={sub.payment_id} profileImg={sub.profile.profile_picture ?? undefined} size="size-10 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-brand-secondary-9 truncate">{sub.profile.business_name}</p>
                                    <p className={cn("text-[11px] font-semibold capitalize text-brand-secondary-8")}>{sub.plan.name} · {sub.billing_cycle}</p>
                                </div>
                                <Badge className={cn("px-2 py-0.5 rounded-md border-[0.8px] capitalize font-medium text-[10px]", cfg.text, cfg.bg, cfg.border)}>
                                    {sub.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-secondary-7 border-t border-brand-neutral-2 pt-3">
                                <div><span className="font-bold">Amount:</span> ₦{Number(sub.amount).toLocaleString()}</div>
                                <div><span className="font-bold">Currency:</span> {sub.currency}</div>
                                <div><span className="font-bold">Started:</span> {formatDateTime(sub.timeline.started_at)}</div>
                                <div><span className="font-bold">Expires:</span> {formatDateTime(sub.timeline.expires_at)}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls currentPage={currentPage} totalPages={totalPages} hasNextPage={currentPage < totalPages} hasPreviousPage={currentPage > 1} onNextPage={() => fetchPage(currentPage + 1)} onPreviousPage={() => fetchPage(currentPage - 1)} isLoadingMore={isLoadingMore} startIndex={(currentPage - 1) * 10 + 1} endIndex={Math.min(currentPage * 10, count)} totalItems={count} />
        </div>
    )
}
