'use client'

import { Icon } from '@iconify/react'
import { usePagination } from "@/custom-hooks/PaginationHook"
import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import { Badge } from "@/components/ui/badge"
import { mockHostBusinesses } from '@/components-data/demo-data'
import TableItemDropdown from '../../dropdown/TableItemDropdown'
import { EventStatus, getHostActions } from '../../dropdown/resources/management-actions'
import UserInfo from '../../users/UserInfo'
import { useRouter } from 'next/navigation'



export default function BusinessManagementTable() {
    
    const router = useRouter()
    const pagination = usePagination(mockHostBusinesses, 5)

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Icon 
                        key={i}
                        icon="ic:round-star" 
                        className={cn("size-4", i < Math.floor(rating) ? "text-[#FFC500]" : "text-brand-neutral-4")} 
                    />
                ))}
                <span className="text-xs text-brand-secondary-8 ml-1">({rating.toFixed(1)})</span>
            </div>
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
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Rating</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Status</th>
                                <th className="text-right py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-5 bg-white">
                            {pagination.currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-brand-neutral-3/70 transition-colors group">
                                    {/* Business Name */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-medium text-brand-secondary-9">{item.businessName}</p>
                                    </td>

                                    {/* Owner Info */}
                                    <td className="py-4 px-5">
                                        <UserInfo user={{
                                            email: item.owner.email,
                                            id: item.id, 
                                            name: item.owner.name
                                        }} />
                                    </td>

                                    {/* Events Count */}
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-xs text-brand-secondary-9">{item.events}</p>
                                    </td>

                                    {/* Revenue */}
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-bold text-brand-secondary-9">
                                            ₦{item.revenue.toLocaleString()}
                                        </p>
                                    </td>

                                    {/* Rating */}
                                    <td className="py-4 px-5">
                                        {renderStars(item.rating)}
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-5">
                                        <Badge className={cn(
                                            "px-2 py-1 rounded-sm text-[10px] font-medium border-[0.8px] capitalize",
                                            item.status === "active" 
                                                ? "text-green-600 bg-green-50 border-green-200" 
                                                : "border-brand-secondary-2 bg-brand-secondary-1 text-brand-secondary-4"
                                        )}>
                                            {item.status}
                                        </Badge>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-5 text-right">
                                        <TableItemDropdown actions={getHostActions(item.status as EventStatus, item.id, router)} id={item.id}  />
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
                totalItems={mockHostBusinesses.length}
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