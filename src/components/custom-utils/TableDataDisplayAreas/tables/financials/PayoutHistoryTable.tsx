import { cn } from "@/lib/utils"
import { usePagination } from "@/custom-hooks/PaginationHook"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"
import { mockPayoutHistory } from "@/components-data/demo-data"
import { PaymentStatus, paymentStatusConfig } from "../../resources/status-config"
import PaginationControls from "../../tools/PaginationControl"
import { Badge } from "@/components/ui/badge"

export default function PayoutHistoryTable() {
    
    const pagination = usePagination(mockPayoutHistory, 10)

    return (
        <div className="w-full space-y-4">
            <div className="border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Payout ID
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Business Name
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Seller/Owner
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Amount
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Payment Date
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-5 bg-white">
                            {pagination.currentItems.map((payout) => {
                                const statusInfo = paymentStatusConfig[payout.status as PaymentStatus]
                                
                                return (
                                    <tr 
                                        key={payout.id}
                                        className="hover:bg-brand-neutral-3/70 transition-colors"
                                    >
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-8 font-medium">
                                                {payout.payoutId}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-8 font-medium">
                                                {payout.businessName}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <CustomAvatar
                                                    name={payout.seller.name}
                                                    id={payout.seller.id}
                                                    size="size-9 shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-brand-secondary-9 font-medium">
                                                        {payout.seller.name}
                                                    </p>
                                                    <p className="text-[11px] text-brand-secondary-6 truncate">
                                                        {payout.seller.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-9 font-bold">
                                                ₦{payout.amount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                                {payout.paymentDate}
                                                {payout.paymentTime && (
                                                    <span className="text-brand-secondary-6">
                                                        {' '}| {payout.paymentTime}
                                                    </span>
                                                )}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={cn(
                                                "inline-flex items-center px-3 py-1.5 rounded-sm text-[10px] font-medium",
                                                statusInfo?.className
                                            )}>
                                                {statusInfo?.label}
                                            </Badge>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <PaginationControls
                endIndex={pagination.endIndex}
                startIndex={pagination.startIndex}
                totalItems={mockPayoutHistory.length}
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