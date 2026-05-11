"use client"

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

/** Derive which actions make sense for the current selection */
function deriveUserActions(items: Array<{ status: string }>): BulkUserAction[] {
    const statuses = new Set(items.map(i => i.status))
    const hasActive    = statuses.has("active")
    const hasSuspended = statuses.has("suspended")
    const hasBannable  = items.some(i => i.status !== "banned")

    const actions: BulkUserAction[] = []
    if (hasActive)    actions.push({ id: "bulk-suspend",   label: "Suspend",   icon: "hugeicons:user-block-01",  variant: "danger" })
    if (hasSuspended) actions.push({ id: "bulk-unsuspend", label: "Unsuspend", icon: "hugeicons:user-check-01"                    })
    if (hasBannable)  actions.push({ id: "bulk-ban",       label: "Ban",       icon: "hugeicons:user-remove-01", variant: "danger" })
    actions.push(       { id: "bulk-export",   label: "Export",    icon: "hugeicons:download-01"                        })
    return actions
}

const TAB_ENTITY: Record<string, { singular: string; plural: string }> = {
    users:       { singular: "user",        plural: "users"       },
    affiliates:  { singular: "affiliate",   plural: "affiliates"  },
    withdrawals: { singular: "withdrawal",  plural: "withdrawals" },
}

interface UserBulkActionsBarProps {
    selectedCount:    number
    tab:              string
    /** The actual data objects for selected rows — used to derive eligible actions */
    selectedItems?:   Array<{ status: string }>
    onAction:         (actionId: BulkUserActionId) => Promise<void>
    onClearSelection: () => void
}

export default function UserBulkActionsBar({
    selectedCount,
    tab,
    selectedItems = [],
    onAction,
    onClearSelection,
}: UserBulkActionsBarProps) {

    const [loadingAction, setLoadingAction] = useState<BulkUserActionId | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // For affiliates / withdrawals — only export makes sense
    const actions: BulkUserAction[] = tab === "users"
        ? deriveUserActions(selectedItems)
        : [{ id: "bulk-export", label: "Export", icon: "hugeicons:download-01" }]

    useEffect(() => {
        if (selectedCount > 0 && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }
    }, [selectedCount])

    if (selectedCount === 0 || actions.length === 0) return null

    const handleAction = async (action: BulkUserAction) => {
        if (loadingAction) return
        setLoadingAction(action.id)
        try { await onAction(action.id) } finally { setLoadingAction(null) }
    }

    const entity = TAB_ENTITY[tab] ?? { singular: "item", plural: "items" }
    const entityLabel = selectedCount === 1 ? `${entity.singular} selected` : `${entity.plural} selected`

    // Eligibility hints for mixed selections
    const suspendable  = selectedItems.filter(i => i.status === "active").length
    const unsuspendable = selectedItems.filter(i => i.status === "suspended").length
    const bannable     = selectedItems.filter(i => i.status !== "banned").length

    const hintForAction = (id: BulkUserActionId): string | null => {
        if (selectedCount <= 1) return null
        if (id === "bulk-suspend"   && suspendable   < selectedCount) return `${suspendable} eligible`
        if (id === "bulk-unsuspend" && unsuspendable < selectedCount) return `${unsuspendable} eligible`
        if (id === "bulk-ban"       && bannable       < selectedCount) return `${bannable} eligible`
        return null
    }

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

            <div className="hidden sm:block w-px h-5 bg-brand-neutral-4" />

            <div className="flex items-center gap-2 flex-wrap">
                {actions.map((action) => {
                    const isLoading  = loadingAction === action.id
                    const isDisabled = loadingAction !== null
                    const hint = hintForAction(action.id)

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
                            {hint && (
                                <span className="ml-0.5 opacity-60 font-normal">({hint})</span>
                            )}
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
