"use client"

import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AnimatedDialog } from '../custom-utils/dialogs/AnimatedDialog'
import { Icon } from '@iconify/react'
import { space_grotesk } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import ActionButton1 from '../custom-utils/buttons/ActionBtn1'
import ActionButton2 from '../custom-utils/buttons/ActionBtn2'
import CustomAvatar from '../custom-utils/avatars/CustomAvatar'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { openConfirmation, resetConfirmationStatus } from '@/lib/redux/slices/confirmationSlice'
import { openSuccessModal } from '@/lib/redux/slices/successModalSlice'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import { approveHostVerification, declineHostVerification } from '@/actions/host-management'
import { useEffect, useRef } from 'react'

interface ReviewRequestModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    host: AdminPendingHost
    onRefresh?: () => void
}

export default function ReviewRequestModal({
    open,
    onOpenChange,
    host,
    onRefresh,
}: ReviewRequestModalProps) {

    const dispatch = useAppDispatch()
    const { isConfirmed, lastConfirmedAction } = useAppSelector(s => s.confirmation)
    const pendingActionRef = useRef<"approve" | "decline" | null>(null)

    const handleApprove = () => {
        pendingActionRef.current = "approve"
        dispatch(openConfirmation({
            actionType: "APPROVE_HOST",
            title: "Approve Request",
            description: `Are you sure you want to approve ${host.owner_name || "this host"}'s verification request?`,
            confirmText: "Yes, Approve",
        }))
    }

    const handleDecline = () => {
        pendingActionRef.current = "decline"
        dispatch(openConfirmation({
            actionType: "DECLINE_HOST",
            title: "Decline Request",
            description: `Are you sure you want to decline ${host.owner_name || "this host"}'s verification request?`,
            confirmText: "Yes, Decline",
        }))
    }

    useEffect(() => {
        if (!isConfirmed || !lastConfirmedAction) return
        if (!pendingActionRef.current) return
        if (lastConfirmedAction !== "APPROVE_HOST" && lastConfirmedAction !== "DECLINE_HOST") return

        const actionId = pendingActionRef.current
        pendingActionRef.current = null

        const run = async () => {
            let result: { success: boolean; message?: string } = { success: false }

            if (actionId === "approve") {
                result = await approveHostVerification(host.host_id)
                if (result.success) {
                    dispatch(openSuccessModal({
                        title: "Verification Approved",
                        description: `${host.owner_name || "Host"}'s verification request has been approved.`,
                        variant: "success",
                        autoClose: true,
                        autoCloseDelay: 3000,
                    }))
                }
            }

            if (actionId === "decline") {
                result = await declineHostVerification(host.host_id)
                if (result.success) {
                    dispatch(openSuccessModal({
                        title: "Request Declined",
                        description: `${host.owner_name || "Host"}'s verification request has been declined.`,
                        variant: "success",
                        autoClose: true,
                        autoCloseDelay: 3000,
                    }))
                }
            }

            dispatch(resetConfirmationStatus())

            if (result.success) {
                onOpenChange(false)
                onRefresh?.()
            } else {
                dispatch(showAlert({
                    title: "Action Failed",
                    description: result.message || "Something went wrong. Please try again.",
                    variant: "destructive",
                }))
            }
        }

        run()
    }, [isConfirmed, lastConfirmedAction])

    return (
        <AnimatedDialog
            open={open}
            onOpenChange={onOpenChange}
            showCloseButton={false}
            className="max-w-[320px] w-full py-5 px-5"
        >
            <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 text-brand-neutral-7/80 hover:text-brand-neutral-6"
                aria-label="close modal"
            >
                <Icon icon="line-md:close-circle-filled" className="size-6" />
            </button>

            <DialogHeader className="mb-4">
                <DialogTitle className={cn(space_grotesk.className, "text-base font-bold text-brand-secondary-9")}>
                    Review Request
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Review and approve or decline this host verification request.
                </DialogDescription>
            </DialogHeader>

            {/* Profile row */}
            <div className="flex items-start gap-3 mb-4">
                <div className="relative size-20 rounded-full overflow-hidden shrink-0 bg-brand-neutral-3">
                    <CustomAvatar
                        name={host.owner_name}
                        profileImg={host.profile_picture}
                        id={String(host.host_id)}
                        size="size-[100px] text-3xl"
                    />
                    {host.host_id && (
                        <p className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-medium text-brand-secondary-7 bg-white/80 py-0.5">
                            RC: {host.host_id}
                        </p>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                        <h3 className={cn(space_grotesk.className, "text-sm font-bold text-brand-secondary-9 truncate")}>
                            {host.owner_name}
                        </h3>
                    </div>

                    {host.owner_phone && (
                        <p className="text-xs text-brand-secondary-6 mb-0.5">{host.owner_phone}</p>
                    )}
                    {host.owner_email && (
                        <p className="text-xs text-brand-secondary-6 mb-2 truncate">{host.owner_email}</p>
                    )}

                    {(host.business_name || host.tax_id) && (
                        <div>
                            <p className="text-xs font-semibold text-brand-secondary-8 mb-0.5">Business Info:</p>
                            {host.business_name && (
                                <p className="text-xs text-brand-secondary-6">
                                    <span className="font-medium">Name:</span> {host.business_name}
                                </p>
                            )}
                            {host.tax_id && (
                                <p className="text-xs text-brand-secondary-6">
                                    <span className="font-medium">Tax ID/TIN:</span> {host.tax_id}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {host.nin && (
                <div className="mb-5">
                    <p className={cn(space_grotesk.className, "text-sm font-bold text-brand-secondary-9 mb-0.5")}>
                        National Identification Number:
                    </p>
                    <p className="text-sm text-brand-secondary-7">{host.nin}</p>
                </div>
            )}

            <div className="flex gap-3">
                <ActionButton1
                    buttonText="Approve"
                    action={handleApprove}
                    className="flex-1"
                />
                <ActionButton2
                    buttonText="Decline"
                    action={handleDecline}
                    className="flex-1"
                />
            </div>
        </AnimatedDialog>
    )
}