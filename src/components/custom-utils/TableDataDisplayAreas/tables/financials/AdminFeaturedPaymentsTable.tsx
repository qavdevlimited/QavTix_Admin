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
    pending: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    active: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    expired: { text: "text-brand-secondary-5", bg: "bg-brand-neutral-2", border: "border-brand-neutral-3" },
    cancelled: { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
}

const PLAN_COLORS: Record<string, string> = {
    basic: "text-emerald-600",
    standard: "text-blue-600",
    advanced: "text-violet-600",
    premium: "text-amber-600",
}

interface AdminFeaturedPaymentsTableProps {
    items: AdminFeaturedPayment[]
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

export default function AdminFeaturedPaymentsTable({
    items, isLoading, isLoadingMore, isEmpty, isError,
    search, currentPage, totalPages, count, fetchPage,
}: AdminFeaturedPaymentsTableProps) {
    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()


    if (isLoading) return <TableLoader />
    if (isError) return <EmptyTicketsState title="Something went wrong" text="Failed to load featured payments." />
    if (isEmpty) return (
        <EmptyTicketsState
            title={search ? "No results found" : "No featured payments"}
            text={search ? `No payments matching "${search}"` : "No events have been featured yet."}
        />
    )

    return (
        <div className="w-full space-y-4">
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-brand-neutral-3">
                <table className="w-full text-sm text-brand-secondary-9">
                    <thead className="bg-brand-neutral-3">
                        <tr className="text-brand-secondary-8 text-sm border-b border-brand-neutral-3">
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Event</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Host</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Plan Type</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Amount</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Payment Date</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Method</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-neutral-2 bg-white">
                        {items.map(payment => {
                            const cfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.pending
                            const planColor = PLAN_COLORS[payment.package.slug] ?? "text-brand-secondary-8"
                            return (
                                <tr key={payment.payment_id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            {payment.event.featured_image ? (
                                                <div className="size-9 shrink-0 rounded-lg overflow-hidden border border-brand-neutral-3">
                                                    <Image src={payment.event.featured_image} alt={payment.event.title} width={36} height={36} className="object-cover w-full h-full" />
                                                </div>
                                            ) : (
                                                <div className="size-9 shrink-0 rounded-lg bg-brand-neutral-3" />
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-brand-secondary-9 truncate max-w-40">{payment.event.title}</p>
                                                <p className="text-[11px] text-brand-secondary-6">{payment.event.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-2">
                                            <CustomAvatar name={payment.host.name} id={payment.payment_id} profileImg={payment.host.profile_picture ?? undefined} size="size-7 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-brand-secondary-9 truncate">{payment.host.business_name}</p>
                                                <p className="text-[11px] text-brand-secondary-6 truncate">{payment.host.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className={cn("text-xs font-semibold capitalize", planColor)}>{payment.package.slug}</p>
                                        <p className="text-[11px] text-brand-secondary-6">{payment.package.duration_days}d</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-bold whitespace-nowrap">{isMounted && formatPrice(Number(payment.amount), user?.currency)}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">{formatDateTime(payment.payment_date)}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-7 capitalize">{payment.payment_method?.replace("_", " ") ?? "—"}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <Badge className={cn("px-2 py-1 rounded-md border-[0.8px] capitalize font-medium text-[11px]", cfg.text, cfg.bg, cfg.border)}>
                                            {payment.status}
                                        </Badge>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3">
                {items.map(payment => {
                    const cfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.pending
                    const planColor = PLAN_COLORS[payment.package.slug] ?? "text-brand-secondary-8"
                    return (
                        <div key={payment.payment_id} className="border border-brand-neutral-3 rounded-2xl p-4 bg-white">
                            <div className="flex items-center gap-3 mb-3">
                                {payment.event.featured_image ? (
                                    <div className="size-10 shrink-0 rounded-lg overflow-hidden border border-brand-neutral-3">
                                        <Image src={payment.event.featured_image} alt={payment.event.title} width={40} height={40} className="object-cover w-full h-full" />
                                    </div>
                                ) : (
                                    <div className="size-10 shrink-0 rounded-lg bg-brand-neutral-3" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-brand-secondary-9 truncate">{payment.event.title}</p>
                                    <p className={cn("text-[11px] font-semibold capitalize", planColor)}>{payment.package.slug} · {payment.package.duration_days}d</p>
                                </div>
                                <Badge className={cn("px-2 py-0.5 rounded-md border-[0.8px] capitalize font-medium text-[10px]", cfg.text, cfg.bg, cfg.border)}>
                                    {payment.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-secondary-7 border-t border-brand-neutral-2 pt-3">
                                <div><span className="font-bold">Host:</span> {payment.host.business_name}</div>
                                <div><span className="font-bold">Amount:</span> {isMounted && formatPrice(Number(payment.amount), user?.currency)}</div>
                                <div><span className="font-bold">Method:</span> {payment.payment_method?.replace("_", " ") ?? "—"}</div>
                                <div><span className="font-bold">Date:</span> {formatDateTime(payment.payment_date)}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls currentPage={currentPage} totalPages={totalPages} hasNextPage={currentPage < totalPages} hasPreviousPage={currentPage > 1} onNextPage={() => fetchPage(currentPage + 1)} onPreviousPage={() => fetchPage(currentPage - 1)} isLoadingMore={isLoadingMore} startIndex={(currentPage - 1) * 10 + 1} endIndex={Math.min(currentPage * 10, count)} totalItems={count} />
        </div>
    )
}
