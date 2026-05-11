"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { toggleHostSuspension, giftHostBadge, approveHostVerification, declineHostVerification, forceHostPayout } from "@/actions/host-management/client"
import { exportData } from "@/helper-fns/exportData"
import ReviewRequestModal from "@/components/modals/ReviewRequestModal"

interface HostActionDropdownProps {
    actions: UserAction[]
    hostId: number
    hostName?: string
    hostData?: AdminHost
    pendingHost?: AdminPendingHost
    disabled?: boolean
    onRefresh?: () => void
}

export default function HostActionDropdown({
    actions,
    hostId,
    hostName,
    hostData,
    pendingHost,
    disabled = false,
    onRefresh,
}: HostActionDropdownProps) {

    const dispatch = useAppDispatch()
    const { isConfirmed, lastConfirmedAction } = useAppSelector(s => s.confirmation)

    const [openReviewRequestModal, setOpenReviewRequestModal] = useState(false)
    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const pendingActionRef = useRef<string | null>(null)

    const confirm = (actionId: string, title: string, description: string, actionType: any) => {
        pendingActionRef.current = actionId
        dispatch(openConfirmation({ actionType, title, description }))
    }

    const handleAction = async (action: UserAction) => {
        if (loadingAction) return
        setIsOpen(false)

        switch (action.id) {
            case "suspend":
                confirm("suspend", "Suspend Host", `Are you sure you want to suspend ${hostName || "this host"}?`, "SUSPEND_HOST")
                break
            case "unsuspend":
                confirm("unsuspend", "Restore Host Access", `Are you sure you want to restore access for ${hostName || "this host"}?`, "SUSPEND_HOST")
                break
            case "gift-bluetick":
                confirm("gift-bluetick", "Gift Blue Tick", `Are you sure you want to gift a Blue Tick to ${hostName || "this host"}?`, "GIFT_BADGE")
                break
            case "approve":
                confirm("approve", "Approve Request", `Are you sure you want to approve this verification request?`, "APPROVE_HOST")
                break
            case "decline":
                confirm("decline", "Decline Request", `Are you sure you want to decline this verification request?`, "DECLINE_HOST")
                break
            case "review-documents":
                pendingHost && setOpenReviewRequestModal(true)
                break
            case "force-payout":
                confirm("force-payout", "Force Payout", `Are you sure you want to force a payout for ${hostName || "this host"}? This action cannot be undone.`, "FORCE_PAYOUT")
                break
            case "export":
                if (hostData) {
                    exportData({
                        data: [hostData as unknown as Record<string, unknown>],
                        format: "csv",
                        filename: `host_${hostId}_export`,
                        title: `Host Export – ${hostName}`,
                    })
                }
                break
            default:
                await action.onClick?.()
        }
    }

    useEffect(() => {
        if (!isConfirmed || !lastConfirmedAction) return
        if (!pendingActionRef.current) return

        const actionId = pendingActionRef.current
        pendingActionRef.current = null

        const run = async () => {
            setLoadingAction(actionId)
            let result: { success: boolean; message?: string } = { success: false }

            if (actionId === "suspend" || actionId === "unsuspend") {
                result = await toggleHostSuspension(hostId)
                if (result.success) {
                    dispatch(openSuccessModal({
                        title: actionId === "suspend" ? "Host Suspended" : "Access Restored",
                        description: actionId === "suspend"
                            ? `${hostName || "Host"} has been suspended successfully.`
                            : `${hostName || "Host"} access has been restored.`,
                        variant: "success",
                    }))
                    onRefresh?.()
                }
            }

            if (actionId === "gift-bluetick") {
                result = await giftHostBadge(hostId)
                if (result.success) {
                    dispatch(openSuccessModal({
                        title: "Blue Tick Gifted!",
                        description: `${hostName || "Host"} has been awarded a Blue Tick.`,
                        variant: "success",
                    }))
                    onRefresh?.()
                }
            }

            if (actionId === "approve") {
                result = await approveHostVerification(hostId)
                if (result.success) {
                    dispatch(openSuccessModal({
                        title: "Verification Approved",
                        description: `${hostName || "Host"}'s verification request has been approved.`,
                        variant: "success",
                    }))
                    onRefresh?.()
                }
            }

            if (actionId === "decline") {
                result = await declineHostVerification(hostId)
                if (result.success) {
                    dispatch(openSuccessModal({
                        title: "Request Declined",
                        description: `${hostName || "Host"}'s verification request has been declined.`,
                        variant: "success",
                    }))
                    setOpenReviewRequestModal(false)
                    onRefresh?.()
                }
            }

            if (actionId === "force-payout") {
                result = await forceHostPayout(hostId)
                if (result.success) {
                    dispatch(openSuccessModal({
                        title: "Payout Initiated",
                        description: `Payout for ${hostName || "host"} has been successfully initiated.`,
                        variant: "success",
                    }))
                    onRefresh?.()
                }
            }

            dispatch(resetConfirmationStatus())

            if (!result.success) {
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
            <DropdownMenu modal={false} open={isOpen} onOpenChange={(v) => {
                !loadingAction && setIsOpen(v)
            }}>
                <DropdownMenuTrigger asChild disabled={disabled} className="p-0">
                    <button
                        className={cn(
                            "px-1 h-fit md:border border-brand-neutral-5 rounded-md transition-colors",
                            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-neutral-2"
                        )}
                        disabled={disabled}
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
                    className="w-44 flex justify-center items-center flex-col text-brand-secondary-9 space-y-1.5"
                >
                    {actions.map((action) => {
                        const isActionLoading = loadingAction === action.id
                        const isActionDisabled = (loadingAction !== null && !isActionLoading) || action.disabled

                        return (
                            <DropdownMenuItem
                                key={action.id}
                                asChild
                                onSelect={(e) => e.preventDefault()}
                            >
                                <button
                                    type="button"
                                    disabled={!!isActionDisabled}
                                    onClick={() => { if (!isActionDisabled) handleAction(action) }}
                                    className={cn(
                                        "w-full text-left flex items-center text-xs gap-2 font-normal cursor-pointer transition-colors px-2 py-1.5 rounded-sm",
                                        "hover:bg-brand-neutral-4 focus:bg-brand-neutral-4 focus:outline-none",
                                        action.variant === "danger" && "text-red-600 hover:bg-red-50 focus:bg-red-50",
                                        isActionDisabled && "opacity-40 cursor-not-allowed",
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

            <ReviewRequestModal host={pendingHost!} open={openReviewRequestModal} onOpenChange={(v) => setOpenReviewRequestModal(v)} />
        </>
    )
}