"use client"

import { Icon }  from "@iconify/react"
import { cn }    from "@/lib/utils"
import { useEffect, useRef, useState } from "react"


const USERS_BULK_ACTIONS: BulkUserAction[] = [
    { id: "bulk-suspend",   label: "Suspend",   icon: "hugeicons:user-block-01",   variant: "danger" },
    { id: "bulk-ban",       label: "Ban",        icon: "hugeicons:user-remove-01",  variant: "danger" },
    { id: "bulk-export",    label: "Export",     icon: "hugeicons:download-01"                        },
]

const AFFILIATES_BULK_ACTIONS: BulkUserAction[] = [
    { id: "bulk-export",    label: "Export",     icon: "hugeicons:download-01"   },
]

const WITHDRAWALS_BULK_ACTIONS: BulkUserAction[] = [
    { id: "bulk-export",    label: "Export",     icon: "hugeicons:download-01"   },
]

export function getBulkUserActionsForTab(tab: string): BulkUserAction[] {
    switch (tab) {
        case "users":       return USERS_BULK_ACTIONS
        case "affiliates":  return AFFILIATES_BULK_ACTIONS
        case "withdrawals": return WITHDRAWALS_BULK_ACTIONS
        default:            return []
    }
}


interface UserBulkActionsBarProps {
    selectedCount:    number
    tab:              string
    onAction:         (actionId: BulkUserActionId) => Promise<void>
    onClearSelection: () => void
}

export default function UserBulkActionsBar({
    selectedCount,
    tab,
    onAction,
    onClearSelection,
}: UserBulkActionsBarProps) {

    const [loadingAction, setLoadingAction] = useState<BulkUserActionId | null>(null)
    const actions = getBulkUserActionsForTab(tab)

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (selectedCount > 0 && containerRef.current) {
            containerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            })
        }
    }, [selectedCount])

    if (selectedCount === 0 || actions.length === 0) return null

    const handleAction = async (action: BulkUserAction) => {
        if (loadingAction) return
        setLoadingAction(action.id)
        try {
            await onAction(action.id)
        } finally {
            setLoadingAction(null)
        }
    }

    const entityLabel = tab === "users"
        ? selectedCount === 1 ? "user selected" : "users selected"
        : tab === "affiliates"
            ? selectedCount === 1 ? "affiliate selected" : "affiliates selected"
            : selectedCount === 1 ? "withdrawal selected" : "withdrawals selected"

    return (
        <div
            ref={containerRef}
            className="flex items-center gap-3 flex-wrap px-4 md:px-5 py-3 bg-brand-primary-1 border border-brand-primary-3 rounded-xl mb-4 animate-in slide-in-from-top-2 duration-200"
        >
            {/* Selection count badge */}
            <div className="flex items-center gap-2 mr-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary-6 text-white text-xs font-bold">
                    {selectedCount}
                </span>
                <span className="text-sm font-medium text-brand-secondary-8 whitespace-nowrap">
                    {entityLabel}
                </span>
            </div>

            {/* Divider */}
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
                            {isLoading ? (
                                <Icon icon="eos-icons:three-dots-loading" className="size-4" />
                            ) : (
                                <Icon icon={action.icon} className="size-3.5" />
                            )}
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
