'use client'

import PaginationControls from "../tools/PaginationControl"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/helper-fns/date-utils"
import UserInfo from '../../users/UserInfo'
import HostActionDropdown from '../../dropdown/HostActionDropdown'
import { pendingHostActions } from '../../dropdown/resources/host-actions'
import TableLoader from '@/components/loaders/TableLoader'
import EmptyTicketsState from '../empty-state'

interface PendingVerificationTableProps {
    items: AdminPendingHost[]
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
    onRefresh?: () => void
}

export default function HostSignupRequestsTable({
    items,
    isLoading,
    isLoadingMore,
    count,
    isEmpty,
    isError,
    search,
    currentPage,
    totalPages,
    fetchPage,
    onRefresh,
}: PendingVerificationTableProps) {

    if (isLoading) return <TableLoader />

    if (isEmpty || isError) {
        return (
            <EmptyTicketsState
                title={isError ? "Something went wrong" : search ? "No results found" : "No pending verifications"}
                text={isError ? "Failed to load verification requests" : search ? `No requests matching "${search}"` : "No verification requests at the moment"}
            />
        )
    }

    return (
        <div className="w-full space-y-4">
            <div className="hidden md:block border border-brand-neutral-3 rounded-xl overflow-hidden!">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Business Name</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Owner</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Signup Date</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Account Type</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                                <th className="text-right py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-5 bg-white">
                            {items.map((request) => (
                                <tr key={request.host_id} className="hover:bg-brand-neutral-3/70 transition-colors group">
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-medium text-brand-secondary-9">{request.business_name}</p>
                                    </td>

                                    <td className="py-4 px-5">
                                        <UserInfo user={{
                                            email: request.owner_email,
                                            id: String(request.host_id),
                                            name: request.owner_name,
                                            profileImg: request.profile_picture ?? undefined,
                                        }} />
                                    </td>

                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                            {formatDateTime(request.signup_date)}
                                        </p>
                                    </td>

                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-9">{request.account_type}</p>
                                    </td>

                                    <td className="py-4 px-5">
                                        <Badge className="px-2 py-1 rounded-md text-[10px] font-medium border-[0.8px] capitalize text-orange-500 bg-orange-50 border-orange-200">
                                            {request.status.replace(/_/g, " ")}
                                        </Badge>
                                    </td>

                                    <td className="py-4 px-5 text-right">
                                        <HostActionDropdown
                                            actions={pendingHostActions}
                                            hostId={request.host_id}
                                            hostName={request.business_name || request.owner_name}
                                            onRefresh={onRefresh}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-3">
                {items.map((request) => (
                    <div key={request.host_id} className="border border-brand-neutral-3 rounded-xl p-4 bg-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-brand-secondary-9">{request.business_name}</p>
                                <p className="text-xs text-brand-neutral-7">{request.owner_email}</p>
                                <p className="text-[11px] text-brand-neutral-6 mt-1">{request.account_type}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="px-2 py-0.5 text-[10px] border-[0.8px] capitalize text-orange-500 bg-orange-50 border-orange-200">
                                    {request.status.replace(/_/g, " ")}
                                </Badge>
                                <HostActionDropdown
                                    actions={pendingHostActions}
                                    hostId={request.host_id}
                                    hostName={request.business_name || request.owner_name}
                                    onRefresh={onRefresh}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-brand-secondary-8 mt-2">
                            Signed up: {formatDateTime(request.signup_date)}
                        </p>
                    </div>
                ))}
            </div>

            <PaginationControls
                endIndex={Math.min(currentPage * 10, count)}
                startIndex={(currentPage - 1) * 10 + 1}
                totalItems={count}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                onNextPage={() => fetchPage(currentPage + 1)}
                onPreviousPage={() => fetchPage(currentPage - 1)}
                currentPage={currentPage}
                totalPages={totalPages}
                isLoadingMore={isLoadingMore}
            />
        </div>
    )
}