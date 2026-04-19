import { usePagination } from "@/custom-hooks/PaginationHook"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"
import { mockAuditLogs } from "@/components-data/demo-data"
import PaginationControls from "../tools/PaginationControl"

export default function AuditLogTable() {
    
    const pagination = usePagination(mockAuditLogs, 10)

    return (
        <div className="w-full space-y-4">
            <div className="border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Timestamp
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Admin
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    IP Address
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Action
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-5 bg-white">
                            {pagination.currentItems.map((log) => (
                                <tr 
                                    key={log.id}
                                    className="hover:bg-brand-neutral-3/70 transition-colors"
                                >
                                    <td className="p-4">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                            {log.timestamp}
                                            {log.timestampTime && (
                                                <span className="text-brand-secondary-6">
                                                    {' '}| {log.timestampTime}
                                                </span>
                                            )}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <CustomAvatar
                                                name={log.admin.name}
                                                id={log.admin.id}
                                                size="size-9 shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs text-brand-secondary-9 font-medium">
                                                    {log.admin.name}
                                                </p>
                                                <p className="text-[11px] text-brand-secondary-6 truncate">
                                                    {log.admin.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-xs text-brand-secondary-8 font-mono">
                                            {log.ipAddress}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-xs text-brand-secondary-9 font-semibold">
                                            {log.action}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-xs text-brand-secondary-8 max-w-md">
                                            {log.details}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <PaginationControls
                endIndex={pagination.endIndex}
                startIndex={pagination.startIndex}
                totalItems={mockAuditLogs.length}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onNextPage={pagination.nextPage}
                onPreviousPage={pagination.previousPage}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
            />
        </div>
    )
}