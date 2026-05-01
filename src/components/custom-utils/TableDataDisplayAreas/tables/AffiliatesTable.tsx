"use client"

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import UserInfo from "../../users/UserInfo"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "../empty-state"
import { v4 as randomUUID } from "uuid"
import { formatDateTime } from "@/helper-fns/date-utils"
import { formatPrice } from "@/helper-fns/formatPrice"
import { useAppSelector } from "@/lib/redux/hooks"

interface AffiliatesTableProps {
    items: AdminAffiliate[]
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

export default function AffiliatesTable({
    items,
    isLoading,
    isLoadingMore,
    isError,
    search,
    currentPage,
    totalPages,
    fetchPage,
    count,
}: AffiliatesTableProps) {

    const isMounted = useIsMounted()
    const currency = useAppSelector(s => s.authUser.user?.currency)

    if (isLoading) return <TableLoader />

    if (isError) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 gap-2">
                <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
                <p className="text-sm text-brand-secondary-6">Failed to load affiliates. Please try again.</p>
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
                <EmptyTicketsState title="No Affiliates" text="No affiliates found for the selected filters." />
            </div>
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
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Affiliate</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Referral ID</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Clicks</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Signups</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Conversion</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Commission Earned</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map((affiliate) => (
                                <tr
                                    key={`${randomUUID()}-${affiliate.referral_id}`}
                                    className="hover:bg-brand-neutral-3/70 transition-colors"
                                >
                                    <td className="py-4 px-5">
                                        {isMounted && (
                                            <UserInfo
                                                user={{
                                                    id: affiliate.referral_id,
                                                    name: affiliate.affiliate_name,
                                                    email: affiliate.affiliate_email,
                                                    profileImg: affiliate.profile_picture || undefined,
                                                }}
                                                variant="desktop"
                                            />
                                        )}
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 max-w-48 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {affiliate.referral_id}
                                        </p>
                                    </td>
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-sm font-medium text-brand-secondary-9">
                                            {affiliate.clicks.toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-sm font-medium text-brand-secondary-9">
                                            {affiliate.signups.toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="py-4 px-5 text-center">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                            affiliate.conversion >= 10
                                                ? "bg-green-50 text-green-700"
                                                : affiliate.conversion >= 5
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "bg-red-50 text-red-700"
                                        )}>
                                            {affiliate.conversion}%
                                        </span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                            {isMounted && formatPrice(Number(affiliate.commission_earned), currency)}
                                        </p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-6 whitespace-nowrap">
                                            {formatDateTime(affiliate.last_activity)}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-3">
                {items.map((affiliate) => (
                    <div
                        key={`mob-${randomUUID()}-${affiliate.referral_id}`}
                        className="border border-brand-neutral-3 rounded-lg p-3"
                    >
                        <div className="flex justify-between text-[10px] text-brand-secondary-9 items-center mb-3">
                            <p>Referral ID: <span className="font-bold">{affiliate.referral_id}</span></p>
                            <p>Commission Earned: <span className="font-bold">{isMounted && formatPrice(Number(affiliate.commission_earned), currency)}</span></p>
                        </div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                            {isMounted && (
                                <UserInfo
                                    user={{
                                        id: affiliate.referral_id,
                                        name: affiliate.affiliate_name,
                                        email: affiliate.affiliate_email,
                                        profileImg: affiliate.profile_picture || undefined,
                                    }}
                                    variant="mobile"
                                    className="flex-1"
                                />
                            )}
                            <p className="font-bold text-brand-secondary-9 text-[10px]">
                                Last Active: <span className="block">{formatDateTime(affiliate.last_activity)}</span>
                            </p>
                        </div>


                        <div className="flex justify-between flex-wrap gap-x-4 gap-y-1 text-[11px] text-brand-secondary-9">
                            <span><span className="font-bold">Clicks:</span> {affiliate.clicks.toLocaleString()}</span>
                            <span><span className="font-bold">Signups:</span> {affiliate.signups.toLocaleString()}</span>
                            <span><span className="font-bold">Commission:</span> {isMounted && formatPrice(Number(affiliate.commission_earned), currency)}</span>
                        </div>
                    </div>
                ))}
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
