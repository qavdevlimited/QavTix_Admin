"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import { toggleUserSuspension } from "@/actions/user-management/client"
import { AccountActionType } from "@/components/modals/resources/user-account-action-status"
import UserAccountActionStatusModal from "@/components/modals/UserAccountActionStatusModal"

interface AdminUserActionDropdownProps {
    actions: UserAction[]
    disabled?: boolean
    userID?: string | number
    userName?: string
    onRefresh?: () => void
}

export default function AdminUserActionDropdown({
    actions,
    disabled = false,
    userID,
    userName,
}: AdminUserActionDropdownProps) {

    const dispatch = useAppDispatch()
    const { trigger: triggerRevalidation } = useRevalidate("customers")
    const { isConfirmed, lastConfirmedAction } = useAppSelector(s => s.confirmation)
    const [showAccountActionStatusModal, setShowAccountActionStatusModal] = useState<{ actionType: AccountActionType, show: boolean } | null>(null)
    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const pendingActionRef = useRef<string | null>(null)

    const handleAction = async (action: UserAction) => {
        if (loadingAction) return
        setIsOpen(false)

        if (action.id === "suspend" || action.id === "unsuspend") {
            pendingActionRef.current = action.id
            dispatch(openConfirmation({
                actionType: "SUSPEND_USER",
                title: action.id === "suspend" ? "Suspend User" : "Restore User Access",
                description: action.id === "suspend"
                    ? `Are you sure you want to suspend ${userName || "this user"}?`
                    : `Are you sure you want to restore access for ${userName || "this user"}?`,
            }))
            return
        }

        try {
            await action.onClick?.()
        } catch (err) {
            console.error(`Action "${action.label}" failed:`, err)
            dispatch(showAlert({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }))
        }
    }

    useEffect(() => {
        if (!isConfirmed || lastConfirmedAction !== "SUSPEND_USER") return
        if (!pendingActionRef.current) return

        const actionId = pendingActionRef.current
        pendingActionRef.current = null

        const run = async () => {
            setLoadingAction(actionId)
            const result = await toggleUserSuspension(userID as string | number)

            dispatch(resetConfirmationStatus())

            if (result.success) {
                setShowAccountActionStatusModal({
                    actionType: actionId === "suspend" ? "suspended" : "unsuspended" as AccountActionType,
                    show: true
                })
                triggerRevalidation()
            } else {
                dispatch(showAlert({
                    title: "Action Failed",
                    description: result.message || "Failed to update user status.",
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
                    avoidCollisions={true}
                    collisionPadding={16}
                    sideOffset={4}
                    className="w-40 flex justify-center items-center flex-col text-brand-secondary-9 space-y-1.5"
                >
                    {actions.map((action) => {
                        const isActionLoading = loadingAction === action.id
                        const isActionDisabled = loadingAction !== null && !isActionLoading

                        return (
                            <DropdownMenuItem
                                key={action.id}
                                asChild
                                onSelect={(e) => e.preventDefault()}
                            >
                                <button
                                    type="button"
                                    disabled={isActionDisabled}
                                    onClick={() => { if (!isActionDisabled) handleAction(action) }}
                                    className={cn(
                                        "w-full text-left flex items-center text-xs gap-2 font-normal cursor-pointer transition-colors px-2 py-1.5 rounded-sm",
                                        "hover:bg-brand-neutral-4 focus:bg-brand-neutral-4 focus:outline-none",
                                        action.variant === 'danger' && "text-red-600 hover:bg-red-50 focus:bg-red-50",
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

            <UserAccountActionStatusModal
                open={!!showAccountActionStatusModal?.show}
                resultType={showAccountActionStatusModal?.actionType!}
                onOpenChange={() => setShowAccountActionStatusModal(null)}
            />
        </>
    )
}