"use client"

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface EventBulkAction {
    id: string
    label: string
    icon: string
    variant?: "danger"
}

/** Only suspend makes sense for active events — derive dynamically */
function deriveEventActions(items: Array<{ status: string }>): EventBulkAction[] {
    const hasSuspendable = items.some(i => i.status === "active")
    const actions: EventBulkAction[] = []
    if (hasSuspendable) actions.push({ id: "bulk-suspend", label: "Suspend", icon: "hugeicons:pause-circle", variant: "danger" })
    actions.push({ id: "bulk-export", label: "Export", icon: "hugeicons:download-01" })
    return actions
}

interface HostEventsBulkActionsBarProps {
    selectedCount: number
    /** Actual selected event data — used to derive eligible actions */
    selectedItems?: Array<{ status: string }>
    onAction: (actionId: string) => Promise<void>
    onClearSelection: () => void
}

export default function HostEventsBulkActionsBar({
    selectedCount,
    selectedItems = [],
    onAction,
    onClearSelection,
}: HostEventsBulkActionsBarProps) {
    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const actions = deriveEventActions(selectedItems)
    const suspendableCount = selectedItems.filter(i => i.status === "active").length

    useEffect(() => {
        if (selectedCount > 0) {
            containerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }
    }, [selectedCount])

    if (selectedCount === 0) return null

    const handleAction = async (actionId: string) => {
        if (loadingAction) return
        setLoadingAction(actionId)
        try { await onAction(actionId) } finally { setLoadingAction(null) }
    }

    return (
        <div
            ref={containerRef}
            className="flex items-center gap-3 flex-wrap px-4 md:px-5 py-3 bg-brand-primary-1 border border-brand-primary-3 rounded-xl mb-4 animate-in slide-in-from-top-2 duration-200"
        >
            <div className="flex items-center gap-2 mr-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary-6 text-white text-xs font-bold">
                    {selectedCount}
                </span>
                <span className="text-sm font-medium text-brand-secondary-8 whitespace-nowrap">
                    {selectedCount === 1 ? "event selected" : "events selected"}
                </span>
            </div>

            <div className="hidden sm:block w-px h-5 bg-brand-neutral-4" />

            <div className="flex items-center gap-2 flex-wrap">
                {actions.map((action) => {
                    const isLoading  = loadingAction === action.id
                    const isDisabled = loadingAction !== null
                    // Hint: show how many will be suspended if mixed selection
                    const hint = (action.id === "bulk-suspend" && selectedCount > 1 && suspendableCount < selectedCount)
                        ? `${suspendableCount} eligible`
                        : null

                    return (
                        <button
                            key={action.id}
                            disabled={isDisabled}
                            onClick={() => handleAction(action.id)}
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
