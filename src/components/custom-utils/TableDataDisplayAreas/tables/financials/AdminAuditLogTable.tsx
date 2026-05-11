"use client"

import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"
import TableLoader from "@/components/loaders/TableLoader"
import EmptyTicketsState from "@/components/custom-utils/TableDataDisplayAreas/empty-state"
import PaginationControls from "@/components/custom-utils/TableDataDisplayAreas/tools/PaginationControl"
import UserInfo from "@/components/custom-utils/users/UserInfo"


const ACTION_CONFIG: Record<string, { text: string; bg: string; border: string; icon: string }> = {
    event_suspend: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: "hugeicons:pause-circle" },
    event_unsuspend: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: "hugeicons:play-circle" },
    event_feature: { text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: "hugeicons:star" },
    event_delete: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: "hugeicons:delete-02" },
    host_approve: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: "hugeicons:checkmark-circle-01" },
    host_decline: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: "hugeicons:cancel-circle" },
    host_reject: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: "hugeicons:cancel-circle" },
    host_suspend: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: "hugeicons:pause-circle" },
    user_suspend: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: "hugeicons:pause-circle" },
    user_unsuspend: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: "hugeicons:play-circle" },
    user_ban: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: "hugeicons:block" },
    payout_approve: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: "hugeicons:money-receive-02" },
    payout_decline: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: "hugeicons:money-remove-02" },
    payout_force: { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: "hugeicons:money-send-02" },
    withdrawal_approve: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: "hugeicons:money-receive-02" },
    withdrawal_reject: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: "hugeicons:money-remove-02" },
    auto_payout: { text: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200", icon: "hugeicons:refresh" },
    badge_gift: { text: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200", icon: "hugeicons:gift" },
}

const DEFAULT_ACTION_CFG = { text: "text-brand-secondary-7", bg: "bg-brand-neutral-2", border: "border-brand-neutral-3", icon: "hugeicons:information-circle" }

interface AdminAuditLogTableProps {
    items: AdminAuditLog[]
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

export default function AdminAuditLogTable({
    items, isLoading, isLoadingMore, isEmpty, isError,
    search, currentPage, totalPages, count, fetchPage,
}: AdminAuditLogTableProps) {

    if (isLoading) return <TableLoader />
    if (isError) return <EmptyTicketsState title="Something went wrong" text="Failed to load audit logs." />
    if (isEmpty) return (
        <EmptyTicketsState
            title={search ? "No results found" : "No audit logs"}
            text={search ? `No logs matching "${search}"` : "No admin actions recorded yet."}
        />
    )

    return (
        <div className="w-full space-y-4">

            {/* ── Desktop table ──────────────────────────────────── */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-brand-neutral-3">
                <table className="w-full text-sm">
                    <thead className="bg-brand-neutral-3">
                        <tr className="text-brand-secondary-8 text-sm border-b border-brand-neutral-3">
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Timestamp</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Admin</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">IP Address</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Action</th>
                            <th className="py-4 px-5 text-left font-bold whitespace-nowrap">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-neutral-2 bg-white">
                        {items.map(log => {
                            const cfg = ACTION_CONFIG[log.action] ?? DEFAULT_ACTION_CFG
                            const ts = (() => { try { return parseISO(log.timestamp) } catch { return null } })()
                            return (
                                <tr key={log.id} className="hover:bg-brand-neutral-3/60 transition-colors">
                                    <td className="py-4 px-5 whitespace-nowrap">
                                        {ts ? (
                                            <div className="text-xs text-brand-secondary-9">
                                                <p >{format(ts, "MMM d, yyyy")} | {format(ts, "h:mm:ss a")}</p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-brand-secondary-6">—</p>
                                        )}
                                    </td>
                                    <td className="py-4 px-5">
                                        <UserInfo
                                            user={{
                                                id: log.id,
                                                name: log.admin_name,
                                                email: log.admin_email,
                                                profileImg: ""
                                            }}
                                            variant="desktop"
                                        />
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs  text-brand-secondary-7 whitespace-nowrap">{log.ip_address}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <Badge className={cn("px-2 py-1 rounded-md border-[0.8px] text-[11px] font-medium flex items-center gap-1 w-fit whitespace-nowrap", cfg.text, cfg.bg, cfg.border)}>
                                            <Icon icon={cfg.icon} className="size-3 shrink-0" />
                                            {log.action_label || log.action}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-5 max-w-xs">
                                        <p className="text-xs text-brand-secondary-7 truncate">
                                            {log.details || <span className="text-brand-neutral-5 italic">—</span>}
                                        </p>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3">
                {items.map(log => {
                    const cfg = ACTION_CONFIG[log.action] ?? DEFAULT_ACTION_CFG
                    const ts = (() => { try { return parseISO(log.timestamp) } catch { return null } })()
                    return (
                        <div key={log.id} className="border border-brand-neutral-3 rounded-2xl p-4 bg-white space-y-3">

                            <p className="text-[11px] text-brand-secondary-9">
                                <span className="font-bold">Timestamp: </span>
                                {ts && (
                                    <>
                                        {format(ts, "MMM d, yyyy")}
                                        <span className="text-brand-neutral-5 mx-2">|</span>
                                        {format(ts, "h:mm a")}
                                    </>
                                )}
                            </p>

                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <CustomAvatar name={log.admin_name} id={log.id} size="size-9 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-brand-secondary-9 truncate">{log.admin_name}</p>
                                        <p className="text-[11px] font-bold text-brand-secondary-7 truncate">{log.admin_email}</p>
                                    </div>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-[11px] font-bold text-brand-secondary-9">IP Address:</p>
                                    <p className="text-[11px] text-brand-secondary-7">{log.ip_address}</p>
                                </div>
                            </div>

                            {(log.details || log.action) && (
                                <p className="text-[10px] text-brand-secondary-9">
                                    <span className="font-bold">{log.action_label || log.action}</span>:
                                    <span> {log.details}</span>
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                onNextPage={() => fetchPage(currentPage + 1)}
                onPreviousPage={() => fetchPage(currentPage - 1)}
                isLoadingMore={isLoadingMore}
                startIndex={(currentPage - 1) * 10 + 1}
                endIndex={Math.min(currentPage * 10, count)}
                totalItems={count}
            />
        </div>
    )
}
