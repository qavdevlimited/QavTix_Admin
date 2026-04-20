'use client'

import { Icon } from '@iconify/react'
import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import { Badge } from "@/components/ui/badge"
import UserInfo from '../../users/UserInfo'
import { useRouter } from 'next/navigation'
import HostActionDropdown from '../../dropdown/HostActionDropdown'
import { buildHostActions } from '../../dropdown/resources/host-actions'
import TableLoader from '@/components/loaders/TableLoader'
import EmptyTicketsState from '../empty-state'
import { formatDateTime } from '@/helper-fns/date-utils'

interface BusinessManagementTableProps {
    items: AdminHost[]
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

const hostStatusConfig: Record<string, { label: string; className: string }> = {
    active: { label: "Active", className: "text-green-600 bg-green-50 border-green-200" },
    verified: { label: "Verified", className: "text-blue-600 bg-blue-50 border-blue-200" },
    suspended: { label: "Suspended", className: "text-amber-600 bg-amber-50 border-amber-200" },
    banned: { label: "Banned", className: "text-red-600 bg-red-50 border-red-200" },
}

export default function BusinessManagementTable({
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
}: BusinessManagementTableProps) {

    const router = useRouter()

    if (isLoading) return <TableLoader />

    if (isEmpty || isError) {
        return (
            <EmptyTicketsState
                title={isError ? "Something went wrong" : search ? "No results found" : "No hosts yet"}
                text={isError ? "Failed to load hosts" : search ? `No hosts matching "${search}"` : "No hosts have been registered yet"}
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
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Business Name</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Owner</th>
                                <th className="text-center py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Events</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Revenue</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Joined</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Status</th>
                                <th className="text-right py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-5 bg-white">
                            {items.map((host) => {
                                const statusCfg = hostStatusConfig[host.status] ?? { label: host.status, className: "text-brand-neutral-7 bg-brand-neutral-2 border-brand-neutral-4" }
                                const actions = buildHostActions(host, router)

                                return (
                                    <tr key={host.host_id} className="hover:bg-brand-neutral-3/70 transition-colors group">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-medium text-brand-secondary-9">{host.business_name}</p>
                                                {host.verified && (
                                                    <Icon icon="hugeicons:checkmark-badge-01" className="size-4 text-blue-500 shrink-0" />
                                                )}
                                            </div>
                                            {host.business_type && (
                                                <p className="text-[10px] text-brand-neutral-7 mt-0.5">{host.business_type}</p>
                                            )}
                                        </td>

                                        <td className="py-4 px-5">
                                            <UserInfo user={{
                                                email: host.owner_email,
                                                id: String(host.host_id),
                                                name: host.owner_name,
                                                profileImg: host.profile_picture ?? undefined,
                                            }} />
                                        </td>

                                        <td className="py-4 px-5 text-center">
                                            <p className="text-xs text-brand-secondary-9">{host.event_count}</p>
                                        </td>

                                        <td className="py-4 px-5">
                                            <p className="text-xs font-bold text-brand-secondary-9">
                                                ₦{Number(host.total_revenue).toLocaleString()}
                                            </p>
                                        </td>

                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                                {formatDateTime(host.date_joined)}
                                            </p>
                                        </td>

                                        <td className="py-4 px-5">
                                            <Badge className={cn(
                                                "px-2 py-1 rounded-sm text-[10px] font-medium border-[0.8px] capitalize",
                                                statusCfg.className
                                            )}>
                                                {statusCfg.label}
                                            </Badge>
                                        </td>

                                        <td className="py-4 px-5 text-right">
                                            <HostActionDropdown
                                                actions={actions}
                                                hostId={host.host_id}
                                                hostName={host.business_name || host.owner_name}
                                                hostData={host}
                                                onRefresh={onRefresh}
                                            />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {items.map((host) => {
                    const statusCfg = hostStatusConfig[host.status] ?? { label: host.status, className: "text-brand-neutral-7 bg-brand-neutral-2 border-brand-neutral-4" }
                    const actions = buildHostActions(host, router)

                    return (
                        <div key={host.host_id} className="border border-brand-neutral-3 rounded-xl p-4 bg-white">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-semibold text-brand-secondary-9">{host.business_name}</p>
                                        {host.verified && <Icon icon="hugeicons:checkmark-badge-01" className="size-4 text-blue-500" />}
                                    </div>
                                    <p className="text-xs text-brand-neutral-7">{host.owner_email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={cn("px-2 py-0.5 text-[10px] border-[0.8px] capitalize", statusCfg.className)}>
                                        {statusCfg.label}
                                    </Badge>
                                    <HostActionDropdown
                                        actions={actions}
                                        hostId={host.host_id}
                                        hostName={host.business_name || host.owner_name}
                                        hostData={host}
                                        onRefresh={onRefresh}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 text-xs text-brand-secondary-8">
                                <span><span className="font-bold">{host.event_count}</span> events</span>
                                <span>₦{Number(host.total_revenue).toLocaleString()} revenue</span>
                            </div>
                        </div>
                    )
                })}
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