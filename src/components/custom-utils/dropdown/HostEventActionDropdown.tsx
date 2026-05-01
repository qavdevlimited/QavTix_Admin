"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { featureHostEvent, suspendHostEvent, deleteHostEvent } from "@/actions/host-management/client"
import FeaturedPlanModal from "@/components/modals/FeaturedPlanModal"

interface HostEventAction {
    id: "feature" | "suspend" | "delete"
    label: string
    icon: string
    variant?: "danger"
}

interface HostEventActionDropdownProps {
    eventId: string
    eventTitle: string
    eventStatus: string
    onRefresh?: () => void
}

function buildHostEventActions(status: string): HostEventAction[] {
    const actions: HostEventAction[] = []

    if (status !== "cancelled" && status !== "ended" && status !== "draft") {
        actions.push({ id: "feature", label: "Add to Featured", icon: "flowbite:rectangle-list-outline" })
    }

    if (status === "active") {
        actions.push({ id: "suspend", label: "Suspend Event", icon: "hugeicons:pause-circle", variant: "danger" })
    }

    actions.push({ id: "delete", label: "Delete Event", icon: "hugeicons:delete-02", variant: "danger" })

    return actions
}

export default function HostEventActionDropdown({
    eventId,
    eventTitle,
    eventStatus,
    onRefresh,
}: HostEventActionDropdownProps) {

    const dispatch = useAppDispatch()
    const { isConfirmed, lastConfirmedAction } = useAppSelector(s => s.confirmation)

    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [showFeaturedModal, setShowFeaturedModal] = useState(false)
    const [isFeaturing, setIsFeaturing] = useState(false)

    const pendingActionRef = useRef<string | null>(null)

    const actions = buildHostEventActions(eventStatus)

    const handleAction = (action: HostEventAction) => {
        setIsOpen(false)

        if (action.id === "feature") {
            setShowFeaturedModal(true)
            return
        }

        if (action.id === "suspend") {
            pendingActionRef.current = "suspend"
            dispatch(openConfirmation({
                actionType: "SUSPEND_EVENT",
                title: "Suspend Event",
                description: `Are you sure you want to suspend "${eventTitle}"? Ticket sales will be paused.`,
                confirmText: "Yes, Suspend",
            }))
            return
        }

        if (action.id === "delete") {
            pendingActionRef.current = "delete"
            dispatch(openConfirmation({
                actionType: "DELETE_EVENT",
                title: "Delete Event",
                description: `Are you sure you want to permanently delete "${eventTitle}"? This cannot be undone.`,
                confirmText: "Yes, Delete",
            }))
        }
    }

    const handleFeatureConfirm = async (planId: string) => {
        setIsFeaturing(true)
        const result = await featureHostEvent(eventId, planId)
        setIsFeaturing(false)
        setShowFeaturedModal(false)

        if (result.success) {
            dispatch(openSuccessModal({
                title: "Event Featured",
                description: `"${eventTitle}" has been added to featured events.`,
                variant: "success",
            }))
            onRefresh?.()
        } else {
            dispatch(showAlert({
                title: "Feature Failed",
                description: result.message || "Could not feature this event. Please try again.",
                variant: "destructive",
            }))
        }
    }

    useEffect(() => {
        if (!isConfirmed || !lastConfirmedAction) return
        if (!pendingActionRef.current) return
        if (lastConfirmedAction !== "SUSPEND_EVENT" && lastConfirmedAction !== "DELETE_EVENT") return

        const actionId = pendingActionRef.current
        pendingActionRef.current = null

        const run = async () => {
            setLoadingAction(actionId)
            let result: { success: boolean; message?: string } = { success: false }

            if (actionId === "suspend") result = await suspendHostEvent(eventId)
            if (actionId === "delete") result = await deleteHostEvent(eventId)

            dispatch(resetConfirmationStatus())

            if (result.success) {
                dispatch(openSuccessModal({
                    title: actionId === "suspend" ? "Event Suspended" : "Event Deleted",
                    description: actionId === "suspend"
                        ? `"${eventTitle}" has been suspended.`
                        : `"${eventTitle}" has been permanently deleted.`,
                    variant: "success",
                }))
                onRefresh?.()
            } else {
                dispatch(showAlert({
                    title: "Action Failed",
                    description: result.message || "Something went wrong. Please try again.",
                    variant: "destructive",
                }))
            }
            setLoadingAction(null)
        }

        run()
    }, [isConfirmed, lastConfirmedAction])

    return (
        <>
            <DropdownMenu modal={false} open={isOpen} onOpenChange={(v) => { !loadingAction && setIsOpen(v) }}>
                <DropdownMenuTrigger asChild>
                    <button
                        className="px-1 h-fit border border-brand-neutral-5 rounded-md transition-colors hover:bg-brand-neutral-2"
                    >
                        <Icon icon="tabler:dots" className="size-5 text-brand-secondary-9 hidden md:inline-block" />
                        <Icon icon="ix:context-menu" className="size-5 text-brand-secondary-9 md:hidden" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    side="bottom"
                    avoidCollisions
                    collisionPadding={16}
                    sideOffset={4}
                    className="w-44 flex flex-col text-brand-secondary-9 space-y-1.5"
                >
                    {actions.map(action => {
                        const isActionLoading = loadingAction === action.id
                        const isDisabled = !!loadingAction && !isActionLoading

                        return (
                            <DropdownMenuItem key={action.id} asChild onSelect={(e) => e.preventDefault()}>
                                <button
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => { if (!isDisabled) handleAction(action) }}
                                    className={cn(
                                        "w-full text-left flex items-center text-xs gap-2 font-normal cursor-pointer transition-colors px-2 py-1.5 rounded-sm",
                                        "hover:bg-brand-neutral-4 focus:bg-brand-neutral-4 focus:outline-none",
                                        action.variant === "danger" && "text-red-600 hover:bg-red-50 focus:bg-red-50",
                                        isDisabled && "opacity-40 cursor-not-allowed",
                                    )}
                                >
                                    {isActionLoading
                                        ? <Icon icon="eos-icons:three-dots-loading" className="size-4" />
                                        : <Icon icon={action.icon} className="size-4.5" />
                                    }
                                    {action.label}
                                </button>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            <FeaturedPlanModal
                open={showFeaturedModal}
                onClose={() => setShowFeaturedModal(false)}
                onConfirm={handleFeatureConfirm}
                isLoading={isFeaturing}
            />
        </>
    )
}
