"use client"

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import UserInfo from "../../users/UserInfo"
import { usersTableStatusConfig, UserStatus } from "../resources/status-config"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { useRouter } from "next/navigation"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "../empty-state"
import AdminUserActionDropdown from "../../dropdown/AdminUserActionDropdown"
import { buildCustomerActions } from "../../dropdown/resources/customer-actions"
import { formatDateTime } from "@/helper-fns/date-utils"
import { formatPrice } from "@/helper-fns/formatPrice"
import { useAppSelector } from "@/lib/redux/hooks"

interface UsersTableProps {
    items: AdminCustomer[]
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

export default function UsersTable({
    items,
    isLoading,
    isLoadingMore,
    isError,
    search,
    currentPage,
    totalPages,
    fetchPage,
    count,
    onRefresh,
}: UsersTableProps) {

    const isMounted = useIsMounted()
    const router = useRouter()
    const currency = useAppSelector(s => s.authUser.user?.currency)

    if (isLoading) return <TableLoader />

    if (isError) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 gap-2">
                <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
                <p className="text-sm text-brand-secondary-6">Failed to load users. Please try again.</p>
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
                <EmptyTicketsState title="No Users" text="No users found for the selected filters." />
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
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Profile Info</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Location</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Phone</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Tickets Bought</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Total Spend</th>
                                <th className="text-left py-4 px-5 text-sm font-bold text-brand-secondary-8 capitalize whitespace-nowrap">Date Joined</th>
                                <th className="w-12 py-4 px-4 font-bold" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map((user) => {
                                const statusCfg = usersTableStatusConfig[user.status as UserStatus] ?? usersTableStatusConfig.active
                                const location = [user.city, user.state, user.country].filter(Boolean).join(", ") || "—"

                                return (
                                    <tr
                                        key={`user-${user.user_id}`}
                                        className="hover:bg-brand-neutral-3/70 transition-colors"
                                    >
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                <span className={cn("size-1.5 rounded-full shrink-0", statusCfg.dot)} />
                                                <span className={cn("text-xs font-medium capitalize", statusCfg.color)}>
                                                    {statusCfg.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            {isMounted && (
                                                <UserInfo
                                                    user={{
                                                        id: user.user_id,
                                                        name: user.full_name,
                                                        email: user.email,
                                                    }}
                                                    variant="desktop"
                                                />
                                            )}
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-6 min-w-32 max-w-40 whitespace-nowrap overflow-hidden text-ellipsis">
                                                {location}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                                {user.phone_number ?? "—"}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            <p className="text-sm font-medium text-brand-secondary-9 whitespace-nowrap">
                                                {user.tickets_bought}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                                {isMounted && formatPrice(Number(user.total_spend), currency)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-6 whitespace-nowrap">
                                                {formatDateTime(user.date_joined)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                                            <AdminUserActionDropdown
                                                actions={buildCustomerActions(user.user_id, user.status, router, user)}
                                                userID={user.user_id}
                                                userName={user.full_name}
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
            <div className="md:hidden grid grid-cols-1 gap-3">
                {items.map((user) => {
                    const statusCfg = usersTableStatusConfig[user.status as UserStatus] ?? usersTableStatusConfig.active
                    const location = [user.city, user.state, user.country].filter(Boolean).join(", ") || "—"

                    return (
                        <div
                            key={`mob-${user.user_id}`}
                            className="border border-brand-neutral-3 rounded-lg p-3"
                        >
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex justify-between text-brand-secondary-9 text-[10px] flex-wrap items-center gap-2 flex-1">
                                    <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full", statusCfg.color)}>
                                        <span className={cn("size-1.5 rounded-full shrink-0", statusCfg.dot)} />
                                        <span className={cn("text-[10px] font-medium capitalize", statusCfg.color)}>
                                            {statusCfg.label}
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1">
                                        <span className="font-bold">Tickets:</span>
                                        {user.tickets_bought}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="font-bold">Spent:</span>
                                        {isMounted && formatPrice(Number(user.total_spend), currency)}
                                    </span>
                                </div>
                                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <AdminUserActionDropdown
                                        actions={buildCustomerActions(user.user_id, user.status, router, user)}
                                        userID={user.user_id}
                                        userName={user.full_name}
                                        onRefresh={onRefresh}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start justify-between gap-3 mb-2">
                                {isMounted && (
                                    <UserInfo
                                        user={{ id: user.user_id, name: user.full_name, email: user.email }}
                                        variant="mobile"
                                        className="shrink-0"
                                    />
                                )}

                                <div className="flex flex-col gap-0.5 text-[11px] text-brand-secondary-9 min-w-0">
                                    <span>{user.phone_number}</span>
                                    <span className="text-brand-secondary-6">
                                        <span className="font-bold">Joined: </span>
                                        {formatDateTime(user.date_joined)}
                                    </span>
                                </div>
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