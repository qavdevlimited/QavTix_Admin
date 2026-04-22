"use client"

import { useState, useEffect, useRef } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { approvePayout, declinePayout, forcePayout } from "@/actions/financials"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import { toggleHostAutoPayout } from "@/actions/host-management"
import { CONFIRMATION_ACTION_TYPES } from "@/components/modals/resources/confirmationActions"

// ─── Types ────────────────────────────────────────────────────────────────────

type PayoutActionId = "approve" | "decline" | "force" | "auto-payout"

interface PayoutAction {
    id: PayoutActionId
    label: string
    icon: string
    variant?: "danger"
}

interface PayoutActionDropdownProps {
    payoutId: string
    hostId?: string
    sellerName: string
    status: string
    role?: "host" | "affiliate"
    autoPayout?: boolean
    onRefresh?: () => void
}


export default function PayoutActionDropdown({
    payoutId,
    hostId,
    sellerName,
    status,
    role,
    autoPayout,
    onRefresh,
}: PayoutActionDropdownProps) {
    const dispatch = useAppDispatch()
    const { isConfirmed, lastConfirmedAction } = useAppSelector(s => s.confirmation)
    const { trigger } = useRevalidate("financials")

    const [isOpen, setIsOpen] = useState(false)
    const [loadingAction, setLoadingAction] = useState<PayoutActionId | null>(null)
    const pendingRef = useRef<PayoutActionId | null>(null)

    const isPending = status === "pending"

    const actions: PayoutAction[] = [
        ...(isPending ? [
            { id: "approve" as const, label: "Approve Payout", icon: "prime:check-square" },
            { id: "decline" as const, label: "Decline Payout", icon: "iconoir:cancel", variant: "danger" as const },
        ] : []),
        { id: "force", label: "Force Payout", icon: "hugeicons:dollar-square" },
        ...(role === "host" ? [
            { id: "auto-payout" as const, label: autoPayout ? "Disable Auto Payout" : "Enable Auto Payout", icon: "hugeicons:wallet-done-02" },
        ] : []),
    ]

    // Block close while an action is running
    const handleOpenChange = (next: boolean) => {
        if (loadingAction) return
        setIsOpen(next)
    }

    // ─── Action handler ───────────────────────────────────────────────────────

    const handleAction = (id: PayoutActionId) => {
        setIsOpen(false)

        if (id === "approve") {
            pendingRef.current = "approve"
            dispatch(openConfirmation({
                actionType: CONFIRMATION_ACTION_TYPES.APPROVE_PAYOUT,
                title: "Approve Payout",
                description: `Approve payout for ${sellerName}? This will initiate the bank transfer.`,
                confirmText: "Yes, Approve",
            }))
        } else if (id === "decline") {
            pendingRef.current = "decline"
            dispatch(openConfirmation({
                actionType: CONFIRMATION_ACTION_TYPES.DECLINE_PAYOUT,
                title: "Decline Payout",
                description: `Decline payout request from ${sellerName}? They will be notified.`,
                confirmText: "Yes, Decline",
            }))
        } else if (id === "force") {
            pendingRef.current = "force"
            dispatch(openConfirmation({
                actionType: CONFIRMATION_ACTION_TYPES.FORCE_PAYOUT,
                title: "Force Payout",
                description: `Force an immediate payout for ${sellerName}? This bypasses the normal schedule.`,
                confirmText: "Yes, Force",
            }))
        } else if (id === "auto-payout" && role === "host") {
            pendingRef.current = "auto-payout"
            dispatch(openConfirmation({
                actionType: CONFIRMATION_ACTION_TYPES.TOGGLE_AUTO_PAYOUT,
                title: autoPayout ? "Disable Auto Payout" : "Enable Auto Payout",
                description: `${autoPayout ? "Disable" : "Enable"} auto-payout for ${sellerName}?`,
                confirmText: "Yes, Confirm",
            }))
        }
    }


    useEffect(() => {
        if (!isConfirmed || !lastConfirmedAction || !pendingRef.current) return

        const validActions = [
            CONFIRMATION_ACTION_TYPES.APPROVE_PAYOUT,
            CONFIRMATION_ACTION_TYPES.DECLINE_PAYOUT,
            CONFIRMATION_ACTION_TYPES.FORCE_PAYOUT,
            CONFIRMATION_ACTION_TYPES.TOGGLE_AUTO_PAYOUT,
        ] as string[]
        if (!validActions.includes(lastConfirmedAction)) return

        const actionId = pendingRef.current
        pendingRef.current = null

        const run = async () => {
            setLoadingAction(actionId)
            let result: { success: boolean; message?: string } = { success: false }

            if (actionId === "approve") result = await approvePayout(payoutId)
            else if (actionId === "decline") result = await declinePayout(payoutId)
            else if (actionId === "force") result = await forcePayout(payoutId)
            else if (actionId === "auto-payout") result = await toggleHostAutoPayout(hostId!, !autoPayout)

            dispatch(resetConfirmationStatus())

            if (result.success) {
                const titles: Record<PayoutActionId, string> = {
                    approve: "Payout Approved",
                    decline: "Payout Declined",
                    force: "Payout Forced",
                    "auto-payout": autoPayout ? "Auto-Payout Disabled" : "Auto-Payout Enabled",
                }
                dispatch(openSuccessModal({
                    title: titles[actionId],
                    description: `Action completed for ${sellerName}.`,
                    variant: "success",
                }))
                trigger()
                onRefresh?.()
            } else {
                dispatch(showAlert({
                    title: "Action Failed",
                    description: result.message ?? "Something went wrong.",
                    variant: "destructive",
                }))
            }
            setLoadingAction(null)
        }

        run()
    }, [isConfirmed, lastConfirmedAction])


    return (
        <DropdownMenu modal={false} open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-lg hover:bg-brand-neutral-2 transition-colors">
                    <Icon icon="tabler:dots" className="size-5 text-brand-secondary-9 hidden md:inline-block" />
                    <Icon icon="ix:context-menu" className="size-5 text-brand-secondary-9 md:hidden" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="w-52 p-1.5 rounded-xl shadow-xl bg-white border border-brand-neutral-2 z-50"
            >
                {actions.map(action => {
                    const isActionLoading = loadingAction === action.id
                    const isDisabled = !!loadingAction && !isActionLoading

                    return (
                        <DropdownMenuItem key={action.id} asChild onSelect={(e) => e.preventDefault()}>
                            <button
                                type="button"
                                disabled={isDisabled}
                                onClick={() => { if (!isDisabled) handleAction(action.id) }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                                    action.variant === "danger"
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-brand-secondary-8 hover:bg-brand-neutral-2",
                                    isDisabled && "opacity-40 cursor-not-allowed",
                                )}
                            >
                                {isActionLoading
                                    ? <Icon icon="eos-icons:three-dots-loading" className="size-4 shrink-0" />
                                    : <Icon icon={action.icon} className={cn("size-4.5 shrink-0", action.variant === "danger" ? "text-red-500" : "text-brand-neutral-7")} />
                                }
                                {action.label}
                            </button>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}