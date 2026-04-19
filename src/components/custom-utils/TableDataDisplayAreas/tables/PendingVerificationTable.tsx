'use client'

import { usePagination } from "@/custom-hooks/PaginationHook"
import PaginationControls from "../tools/PaginationControl"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/helper-fns/date-utils"
import { mockSignupRequest } from '@/components-data/demo-data'
import UserInfo from '../../users/UserInfo'
import TableItemDropdown from '../../dropdown/TableItemDropdown'
import { pendingHostsActions } from '../../dropdown/resources/management-actions'



export default function HostSignupRequestsTable() {


    const pagination = usePagination(mockSignupRequest, 5)

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
                            {pagination.currentItems.map((request) => (
                                <tr key={request.id} className="hover:bg-brand-neutral-3/70 transition-colors group">
                                    {/* Business Name */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-medium text-brand-secondary-9">{request.businessName}</p>
                                    </td>

                                    {/* Owner Info */}
                                    <td className="py-4 px-5">
                                        <UserInfo user={{
                                            email: request.owner.email,
                                            id: request.id, 
                                            name: request.owner.name
                                        }} />
                                    </td>

                                    {/* Signup Date */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                            {formatDateTime(request.signupDate)}
                                        </p>
                                    </td>

                                    {/* Account Type */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-9">{request.accountType}</p>
                                    </td>

                                    {/* Status - Pending Badge */}
                                    <td className="py-4 px-5">
                                        <Badge className="px-2 py-1 rounded-md text-[10px] font-medium border-[0.8px] capitalize text-orange-500 bg-orange-50 border-orange-200">
                                            {request.status}
                                        </Badge>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-5 text-right">
                                        <TableItemDropdown actions={pendingHostsActions} id={request.id} />
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
                totalItems={mockSignupRequest.length}
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