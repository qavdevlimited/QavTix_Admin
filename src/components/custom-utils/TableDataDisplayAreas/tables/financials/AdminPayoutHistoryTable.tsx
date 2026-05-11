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
import UserInfo from "@/components/custom-utils/users/UserInfo"
import { format, parseISO } from "date-fns"
import TableCheckbox from "../../tools/TableCheckbox"

const STATUS_CONFIG: Record<string, { text: string; bg: string; border: string }> = {
    pending: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    approved: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    declined: { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
    processing: { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
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
    selectedIds?: string[]
    onSelectionChange?: (ids: string[]) => void
}

export default function AdminPayoutHistoryTable({
    items, isLoading, isLoadingMore, isEmpty, isError,
    search, currentPage, totalPages, count, fetchPage,
    selectedIds = [], onSelectionChange,
}: AdminPayoutHistoryTableProps) {

    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()

    const allIds = items.map(i => i.payout_id)
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
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="menu"]')) return
        
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id))
        } else {
            onSelectionChange([...selectedIds, id])
        }
    }

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
                    <thead className="bg-brand-neutral-3">
                        <tr className="text-brand-secondary-8 text-sm border-b border-brand-neutral-3">
                            {onSelectionChange && (
                                <th className="py-4 px-5 text-left w-10">
                                    <TableCheckbox
                                        checked={isAllSelected}
                                        indeterminate={isSomeSelected}
                                        onChange={handleSelectAll}
                                        ariaLabel="Select all payouts on this page"
                                    />
                                </th>
                            )}
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Recipient</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Bank Details</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Amount</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Date</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-neutral-2 bg-white">
                        {items.map(payout => {
                            const cfg = STATUS_CONFIG[payout.status] ?? STATUS_CONFIG.approved
                            const sellerName = payout.seller.business_name ?? payout.seller.name
                            const isSelected = selectedIds.includes(payout.payout_id)
                            return (
                                <tr 
                                    key={payout.payout_id} 
                                    onClick={(e) => handleRowClick(payout.payout_id, e)}
                                    className={cn(
                                        "transition-colors",
                                        onSelectionChange && "cursor-pointer",
                                        isSelected ? "bg-brand-primary-1 hover:bg-brand-primary-2" : "hover:bg-brand-neutral-3/70"
                                    )}
                                >
                                    {onSelectionChange && (
                                        <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                                            <TableCheckbox
                                                checked={isSelected}
                                                onChange={(checked) => handleSelectRow(payout.payout_id, checked)}
                                                ariaLabel={`Select payout ${payout.payout_id}`}
                                            />
                                        </td>
                                    )}
                                    <td className="py-4 px-5">
                                        <UserInfo
                                            user={{
                                                id: payout.payout_id,
                                                name: sellerName,
                                                email: payout.seller.email,
                                                profileImg: payout.seller.profile_picture ?? "",
                                            }}
                                            variant="desktop"
                                        />
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-medium text-brand-secondary-8">{payout.bank_account.bank_name}</p>
                                        <p className="text-[11px] text-brand-secondary-6">{payout.bank_account.account_number}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-bold whitespace-nowrap">{isMounted && formatPrice(Number(payout.amount), user?.currency)}</p>
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
                    const isSelected = selectedIds.includes(payout.payout_id)
                    return (
                        <div 
                            key={payout.payout_id} 
                            onClick={(e) => handleRowClick(payout.payout_id, e)}
                            className={cn(
                                "border rounded-2xl p-4 space-y-3 transition-colors",
                                onSelectionChange && "cursor-pointer",
                                isSelected ? "border-brand-primary-5 bg-brand-primary-1" : "border-brand-neutral-3 bg-white"
                            )}
                        >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2">
                                    {onSelectionChange && (
                                        <div onClick={(e) => e.stopPropagation()} className="mr-1">
                                            <TableCheckbox
                                                checked={isSelected}
                                                onChange={(checked) => handleSelectRow(payout.payout_id, checked)}
                                                ariaLabel={`Select payout ${payout.payout_id}`}
                                            />
                                        </div>
                                    )}
                                    <span className="text-[10px] text-brand-secondary-9">
                                        <span className="font-bold">Payout ID: </span>{payout.payout_id}
                                    </span>
                                </div>
                                <span className="text-[10px] text-brand-secondary-9">
                                    <span className="font-bold">Amount: </span>
                                    {isMounted && formatPrice(parseFloat(payout.amount), user?.currency)}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[10px] font-bold text-brand-secondary-9">Business Name:</p>
                                    <p className="text-[10px] text-brand-secondary-7">{payout.seller.business_name ?? payout.seller.name}</p>
                                </div>
                                <UserInfo
                                    user={{
                                        id: payout.payout_id,
                                        name: sellerName,
                                        email: payout.seller.email,
                                        profileImg: payout.seller.profile_picture ?? "",
                                    }}
                                    variant="mobile"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <p className="text-[10px] text-brand-secondary-9">
                                    <span className="font-bold">Payment Date: </span>
                                    {format(parseISO(payout.request_date), "MMM d, yyyy")}
                                    <span className="text-brand-neutral-5 mx-2">|</span>
                                    {format(parseISO(payout.request_date), "h:mm a")}
                                </p>
                                <Badge className={cn(
                                    "px-3 py-1 rounded text-[10px] border-[0.8px] capitalize",
                                    cfg.bg, cfg.text, cfg.border
                                )}>
                                    {payout.status}
                                </Badge>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls currentPage={currentPage} totalPages={totalPages} hasNextPage={currentPage < totalPages} hasPreviousPage={currentPage > 1} onNextPage={() => fetchPage(currentPage + 1)} onPreviousPage={() => fetchPage(currentPage - 1)} isLoadingMore={isLoadingMore} startIndex={(currentPage - 1) * 10 + 1} endIndex={Math.min(currentPage * 10, count)} totalItems={count} />
        </div>
    )
}
