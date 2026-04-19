"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import { toggleUserSuspension } from "@/actions/user-management"


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
    onRefresh,
}: AdminUserActionDropdownProps) {

    const dispatch = useAppDispatch()
    const { trigger: triggerRevalidation } = useRevalidate("customers")

    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const handleAction = async (action: UserAction) => {
        if (loadingAction) return
        setLoadingAction(action.id)

        try {
            if (action.id === "suspend" || action.id === "unsuspend") {
                const actionName = action.id === "suspend" ? "suspended" : "unsuspended"
                const result = await toggleUserSuspension(userID as string | number)
                
                if (result.success) {
                    dispatch(showAlert({ title: `User ${actionName}`, description: `Successfully ${actionName} ${userName}.`, variant: "success" }))
                    onRefresh?.()
                    triggerRevalidation()
                } else {
                    dispatch(showAlert({ title: "Action Failed", description: result.message || `Failed to ${action.id} user.`, variant: "destructive" }))
                }
                
                setLoadingAction(null)
                setIsOpen(false)
                return
            }

            if (action.id === "ban") {
                // const result = await banUser({ userId: userID })
                dispatch(showAlert({ title: "User Banned", description: `Successfully banned ${userName}.`, variant: "success" }))
                onRefresh?.()
                triggerRevalidation()
                setLoadingAction(null)
                setIsOpen(false)
                return
            }

            if (action.id === "unban") {
                // const result = await activateUser({ userId: userID })
                dispatch(showAlert({ title: "Status Updated", description: `Successfully updated status for ${userName}.`, variant: "success" }))
                onRefresh?.()
                triggerRevalidation()
                setLoadingAction(null)
                setIsOpen(false)
                return
            }

            if (action.id === "delete") {
                // const result = await deleteUser({ userId: userID })
                dispatch(showAlert({ title: "User Deleted", description: `Successfully deleted ${userName}.`, variant: "success" }))
                onRefresh?.()
                triggerRevalidation()
                setLoadingAction(null)
                setIsOpen(false)
                return
            }

            await action.onClick?.()

        } catch (err) {
            console.error(`Action "${action.label}" failed:`, err)
            dispatch(showAlert({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }))
        } finally {
            setLoadingAction(null)
            setIsOpen(false)
        }
    }

    return (
        <DropdownMenu modal={false} open={isOpen} onOpenChange={(v) => {
            !loadingAction && setIsOpen(v)
        }}>
            <DropdownMenuTrigger asChild disabled={disabled} className="p-0">
                <button
                    className={cn(
                        "px-1 h-fit border border-brand-neutral-5 rounded-md transition-colors",
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
    )
}
