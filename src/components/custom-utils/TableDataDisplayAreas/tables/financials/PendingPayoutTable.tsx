import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { usePagination } from "@/custom-hooks/PaginationHook"
import TableItemDropdown from "@/components/custom-utils/dropdown/TableItemDropdown"
import { Dispatch, SetStateAction } from "react"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"
import { mockPayouts } from "@/components-data/demo-data"
import PaginationControls from "../../tools/PaginationControl"
import { getPendingPayoutActions } from "@/components/custom-utils/dropdown/resources/management-actions"

interface PayoutsTableProps {
    selectedPayouts: string[]
    setSelectedPayouts: Dispatch<SetStateAction<string[]>>
}

export default function PendingPayoutsTable({ selectedPayouts, setSelectedPayouts }: PayoutsTableProps) {
    
    const pagination = usePagination(mockPayouts, 5)

    const isAllSelected = pagination.currentItems.length > 0 && 
        pagination.currentItems.every(payout => selectedPayouts.includes(payout.id))

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedPayouts([])
        } else {
            setSelectedPayouts(pagination.currentItems.map(p => p.id))
        }
    }

    const toggleSelection = (id: string) => {
        setSelectedPayouts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const isSelected = (id: string) => selectedPayouts.includes(id)

    return (
        <div className="w-full space-y-4">
            <div className="border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="w-12 p-4">
                                    <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                                </th>
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
                                    Request Date
                                </th>
                                <th className="w-12 py-4 px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-5 bg-white">
                            {pagination.currentItems.map((payout) => (
                                <tr 
                                    key={payout.id}
                                    className={cn(
                                        "hover:bg-brand-neutral-3/70 transition-colors",
                                        isSelected(payout.id) && "bg-brand-primary-1 hover:bg-brand-primary-1"
                                    )}
                                    onClick={() => toggleSelection(payout.id)}
                                >
                                    <td className="p-4">
                                        <Checkbox 
                                            checked={selectedPayouts.includes(payout.id)} 
                                            onClick={(e) => e.stopPropagation()}
                                            onCheckedChange={() => toggleSelection(payout.id)} 
                                        />
                                    </td>
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
                                            {payout.requestDate}
                                            {payout.requestTime && (
                                                <span className="text-brand-secondary-6">
                                                    {' '}| {payout.requestTime}
                                                </span>
                                            )}
                                        </p>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <TableItemDropdown 
                                            id={payout.id} 
                                            actions={getPendingPayoutActions(payout.id)} 
                                        />
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
                totalItems={mockPayouts.length}
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