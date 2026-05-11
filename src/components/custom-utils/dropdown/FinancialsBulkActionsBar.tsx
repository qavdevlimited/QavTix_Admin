"use client"

import { Icon }  from "@iconify/react"
import { cn }    from "@/lib/utils"
import { useEffect, useRef, useState } from "react"


const PENDING_PAYOUTS_ACTIONS: BulkFinancialsAction[] = [
    { id: "bulk-approve", label: "Approve",  icon: "hugeicons:checkmark-circle-01"              },
    { id: "bulk-decline", label: "Decline",  icon: "hugeicons:cancel-circle",  variant: "danger" },
    { id: "bulk-export",  label: "Export",   icon: "hugeicons:download-01"                       },
]

const EXPORT_ONLY_ACTIONS: BulkFinancialsAction[] = [
    { id: "bulk-export",  label: "Export",   icon: "hugeicons:download-01" },
]

const TAB_LABELS: Record<string, string> = {
    "pending-payout":    "pending payout",
    "payout-history":    "payout",
    "resale-orders":     "order",
    "featured-payments": "payment",
    "subscriptions":     "subscription",
}

export function getBulkFinancialsActionsForTab(tab: string): BulkFinancialsAction[] {
    if (tab === "pending-payout") return PENDING_PAYOUTS_ACTIONS
    return EXPORT_ONLY_ACTIONS
}


interface FinancialsBulkActionsBarProps {
    selectedCount:    number
    tab:              string
    onAction:         (actionId: BulkFinancialsActionId) => Promise<void>
    onClearSelection: () => void
}

export default function FinancialsBulkActionsBar({
    selectedCount,
    tab,
    onAction,
    onClearSelection,
}: FinancialsBulkActionsBarProps) {

    const [loadingAction, setLoadingAction] = useState<BulkFinancialsActionId | null>(null)
    const actions = getBulkFinancialsActionsForTab(tab)

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (selectedCount > 0 && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }
    }, [selectedCount])

    if (selectedCount === 0 || actions.length === 0) return null

    const handleAction = async (action: BulkFinancialsAction) => {
        if (loadingAction) return
        setLoadingAction(action.id)
        try {
            await onAction(action.id)
        } finally {
            setLoadingAction(null)
        }
    }

    const singular = TAB_LABELS[tab] ?? "item"
    const entityLabel = selectedCount === 1 ? `${singular} selected` : `${singular}s selected`

    return (
        <div
            ref={containerRef}
            className="flex items-center gap-3 flex-wrap px-4 md:px-5 py-3 bg-brand-primary-1 border border-brand-primary-3 rounded-xl mb-4 animate-in slide-in-from-top-2 duration-200"
        >
            {/* Count badge */}
            <div className="flex items-center gap-2 mr-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary-6 text-white text-xs font-bold">
                    {selectedCount}
                </span>
                <span className="text-sm font-medium text-brand-secondary-8 whitespace-nowrap">
                    {entityLabel}
                </span>
            </div>

            <div className="hidden sm:block w-px h-5 bg-brand-neutral-4" />

            <div className="flex items-center gap-2 flex-wrap">
                {actions.map((action) => {
                    const isLoading  = loadingAction === action.id
                    const isDisabled = loadingAction !== null

                    return (
                        <button
                            key={action.id}
                            disabled={isDisabled}
                            onClick={() => handleAction(action)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                                action.variant === "danger"
                                    ? "border-red-200 text-red-600 bg-white hover:bg-red-50"
                                    : "border-brand-neutral-4 text-brand-secondary-8 bg-white hover:bg-brand-neutral-2",
                                isDisabled && "opacity-40 cursor-not-allowed"
                            )}
                        >
                            {isLoading
                                ? <Icon icon="eos-icons:three-dots-loading" className="size-4" />
                                : <Icon icon={action.icon} className="size-3.5" />
                            }
                            {action.label}
                        </button>
                    )
                })}
            </div>

            <button
                onClick={onClearSelection}
                className="ml-auto flex items-center gap-1 text-xs text-brand-secondary-5 hover:text-brand-secondary-8 transition-colors"
            >
                <Icon icon="lucide:x" className="size-3.5" />
                Clear
            </button>
        </div>
    )
}
