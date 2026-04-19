"use client"

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import { withdrawalStatusConfig } from "../resources/status-config"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "../empty-state"
import { v4 as randomUUID } from "uuid"
import { formatDateTime } from "@/helper-fns/date-utils"

interface WithdrawalsTableProps {
    items:         AdminWithdrawal[]
    isLoading:     boolean
    isLoadingMore: boolean
    hasNext:       boolean
    count:         number
    onLoadMore:    () => void
    isEmpty:       boolean
    isError:       boolean
    search:        string
    currentPage:   number
    totalPages:    number
    fetchPage:     (page: number) => void
}

export default function WithdrawalsTable({
    items,
    isLoading,
    isLoadingMore,
    isError,
    search,
    currentPage,
    totalPages,
    fetchPage,
    count,
}: WithdrawalsTableProps) {

    if (isLoading) return <TableLoader className="my-0" />

    if (isError) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 gap-2">
                <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
                <p className="text-sm text-brand-secondary-6">Failed to load withdrawal history. Please try again.</p>
            </div>
        )
    }

    if (!items.length) {
        if (search) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="p-3 rounded-full bg-brand-neutral-2">
                    <Icon icon="mage:search" className="size-6 text-brand-neutral-6" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">No results for &ldquo;{search}&rdquo;</p>
                <p className="text-xs text-brand-secondary-5">Try a different query or clear the search</p>
            </div>
        )

        return (
            <div className="my-10">
                <EmptyTicketsState title="No Withdrawals" text="No withdrawal history found." />
            </div>
        )
    }

    return (
        <div className="w-full space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden!">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Recipient</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Bank Account</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Amount</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Date</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Payment ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map((withdrawal) => {
                                const statusCfg = withdrawalStatusConfig[withdrawal.status] ?? withdrawalStatusConfig.pending

                                return (
                                    <tr
                                        key={`${randomUUID()}-${withdrawal.payment_id}`}
                                        className="hover:bg-brand-neutral-3/70 transition-colors"
                                    >
                                        <td className="py-4 px-5">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                                statusCfg.color,
                                                statusCfg.bg,
                                            )}>
                                                {statusCfg.label}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-xs font-medium text-brand-secondary-9 whitespace-nowrap">
                                                    {withdrawal.profile.full_name}
                                                </p>
                                                <p className="text-[11px] text-brand-secondary-5">
                                                    {withdrawal.profile.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-xs font-medium text-brand-secondary-9 whitespace-nowrap">
                                                    {withdrawal.bank_account.bank_name}
                                                </p>
                                                <p className="text-[11px] text-brand-secondary-5">
                                                    {withdrawal.bank_account.account_number} · {withdrawal.bank_account.account_name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                                ₦{Number(withdrawal.amount).toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-6 whitespace-nowrap">
                                                {formatDateTime(withdrawal.withdrawal_date)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-[11px] text-brand-secondary-5 font-mono">
                                                {withdrawal.payment_id.slice(0, 8)}…
                                            </p>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-3">
                {items.map((withdrawal) => {
                    const statusCfg = withdrawalStatusConfig[withdrawal.status] ?? withdrawalStatusConfig.pending

                    return (
                        <div
                            key={`mob-${randomUUID()}-${withdrawal.payment_id}`}
                            className="border border-brand-neutral-3 rounded-lg p-3"
                        >
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-xs font-medium text-brand-secondary-9">
                                        {withdrawal.profile.full_name}
                                    </p>
                                    <p className="text-[11px] text-brand-secondary-5">{withdrawal.profile.email}</p>
                                </div>
                                <span className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                                    statusCfg.color,
                                    statusCfg.bg,
                                )}>
                                    {statusCfg.label}
                                </span>
                            </div>

                            <div className="flex flex-col gap-0.5 mb-2">
                                <p className="text-xs font-medium text-brand-secondary-8">{withdrawal.bank_account.bank_name}</p>
                                <p className="text-[11px] text-brand-secondary-5">
                                    {withdrawal.bank_account.account_number} · {withdrawal.bank_account.account_name}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-brand-secondary-9">
                                <span><span className="font-bold">Amount:</span> ₦{Number(withdrawal.amount).toLocaleString()}</span>
                                <span><span className="font-bold">Date:</span> {formatDateTime(withdrawal.withdrawal_date)}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={count}
                startIndex={(currentPage - 1) * 10 + 1}
                endIndex={Math.min(currentPage * 10, count)}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                onNextPage={() => fetchPage(currentPage + 1)}
                onPreviousPage={() => fetchPage(currentPage - 1)}
                isLoadingMore={isLoadingMore}
            />
        </div>
    )
}
