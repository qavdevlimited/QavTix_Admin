"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import FeaturedPlanModal from "@/components/modals/FeaturedPlanModal"
import { useRouter } from "next/navigation"
import { DASHBOARD_NAVIGATION_LINKS, EVENT_PROFILE } from "@/enums/navigation"
import { deleteHostEvent, featureHostEvent, suspendHostEvent } from "@/actions/host-management"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import { CONFIRMATION_ACTION_TYPES } from "@/components/modals/resources/confirmationActions"
import { getEventAttendeesClient as getEventAttendees } from "@/actions/customers/client"
import { exportData } from "@/helper-fns/exportData"


interface AdminEventAction {
    id: "view" | "download" | "feature" | "suspend" | "unsuspend" | "remove" | "send-update"
    label: string
    icon: string
    variant?: "danger"
}

interface AdminEventActionDropdownProps {
    eventId: string
    eventTitle: string
    eventStatus: EventStatus
    isFeatured: boolean
    actionsFor?: "event-profile" | "other"
}

type PendingAction = "suspend" | "unsuspend" | "remove"


function buildActions(status: EventStatus, isFeatured: boolean): AdminEventAction[] {
    const actions: AdminEventAction[] = []
    const isActive = status === "active" || status === "live"

    if (isActive) {
        actions.push({ id: "view", label: "View Event", icon: "hugeicons:ticket-02" })
    }

    actions.push({ id: "download", label: "Download Attendee List", icon: "hugeicons:download-01" })
    // actions.push({ id: "send-update", label: "Send Update to Buyers", icon: "lucide:mail" })

    if (isFeatured) {
        actions.push({ id: "feature", label: "Remove from Featured", icon: "flowbite:rectangle-list-outline" })
    }

    if (isActive) {
        actions.push({ id: "suspend", label: "Suspend Event", icon: "hugeicons:pause-circle", variant: "danger" })
    }

    if (status === "suspended") {
        actions.push({ id: "unsuspend", label: "Undo Suspension", icon: "hugeicons:pause-circle" })
    }

    actions.push({ id: "remove", label: "Remove Event", icon: "iconoir:cancel", variant: "danger" })

    return actions
}


export default function AdminEventActionDropdown({
    eventId,
    eventTitle,
    eventStatus,
    isFeatured,
    actionsFor = "other"
}: AdminEventActionDropdownProps) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { isConfirmed, lastConfirmedAction } = useAppSelector(s => s.confirmation)

    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [showFeaturedModal, setShowFeaturedModal] = useState(false)
    const [isFeaturing, setIsFeaturing] = useState(false)
    const { trigger } = useRevalidate("event-listing")

    const pendingActionRef = useRef<PendingAction | null>(null)
    const actions = buildActions(eventStatus, isFeatured)

    const handleOpenChange = (next: boolean) => {
        if (loadingAction) return
        setIsOpen(next)
    }


    const handleDownloadAttendees = async () => {
        setLoadingAction("download")

        const result = await getEventAttendees(eventId)

        if (!result.success || !result.data?.length) {
            dispatch(showAlert({
                title: "Download Failed",
                description: result.message ?? "No attendee data found for this event.",
                variant: "destructive",
            }))
            setLoadingAction(null)
            setIsOpen(false)
            return
        }

        await exportData({
            data: result.data as unknown as Record<string, unknown>[],
            format: "csv",
            filename: `attendees_${eventTitle.toLowerCase().replace(/\s+/g, "_")}`,
            title: `Attendees – ${eventTitle}`,
            skipKeys: ["profile_picture"],
        })

        setLoadingAction(null)
        setIsOpen(false)
    }


    const handleAction = (action: AdminEventAction) => {
        // Only close immediately for instant actions (no async work)
        const instantActions = ["view", "send-update", "feature", "suspend", "unsuspend", "remove"]
        if (instantActions.includes(action.id)) {
            setIsOpen(false)
        }
        // "download" stays open — handleDownloadAttendees closes it when done

        if (action.id === "view") {
            router.push(EVENT_PROFILE.href.replace("[event_id]", eventId))
            return
        }

        if (action.id === "download") {
            handleDownloadAttendees()
            return
        }

        if (action.id === "feature") {
            setShowFeaturedModal(true)
            return
        }

        if (action.id === "suspend") {
            pendingActionRef.current = "suspend"
            dispatch(openConfirmation({
                actionType: CONFIRMATION_ACTION_TYPES.SUSPEND_EVENT,
                title: "Suspend Event",
                description: `Are you sure you want to suspend "${eventTitle}"? Ticket sales will be paused.`,
                confirmText: "Yes, Suspend",
            }))
            return
        }

        if (action.id === "unsuspend") {
            pendingActionRef.current = "unsuspend"
            dispatch(openConfirmation({
                actionType: CONFIRMATION_ACTION_TYPES.UNSUSPEND_EVENT,
                title: "Undo Suspension",
                description: `Are you sure you want to reinstate "${eventTitle}"? Ticket sales will resume.`,
                confirmText: "Yes, Reinstate",
            }))
            return
        }

        if (action.id === "remove") {
            pendingActionRef.current = "remove"
            dispatch(openConfirmation({
                actionType: CONFIRMATION_ACTION_TYPES.DELETE_EVENT,
                title: "Remove Event",
                description: `Are you sure you want to permanently remove "${eventTitle}"? This cannot be undone.`,
                confirmText: "Yes, Remove",
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
            trigger()
        } else {
            dispatch(showAlert({
                title: "Feature Failed",
                description: result.message ?? "Could not feature this event.",
                variant: "destructive",
            }))
        }
    }


    useEffect(() => {
        if (!isConfirmed || !lastConfirmedAction) return
        if (!pendingActionRef.current) return

        const validActions = Object.values(CONFIRMATION_ACTION_TYPES) as string[]
        if (!validActions.includes(lastConfirmedAction)) return

        const actionId = pendingActionRef.current
        pendingActionRef.current = null

        const run = async () => {
            setLoadingAction(actionId)
            let result: { success: boolean; message?: string } = { success: false }

            if (actionId === "suspend") result = await suspendHostEvent(eventId)
            if (actionId === "unsuspend") result = await suspendHostEvent(eventId)
            if (actionId === "remove") result = await deleteHostEvent(eventId)

            dispatch(resetConfirmationStatus())

            if (result.success) {
                const titles: Record<PendingAction, string> = {
                    suspend: "Event Suspended",
                    unsuspend: "Suspension Lifted",
                    remove: "Event Removed",
                }
                const descriptions: Record<PendingAction, string> = {
                    suspend: `"${eventTitle}" has been suspended.`,
                    unsuspend: `"${eventTitle}" has been reinstated.`,
                    remove: `"${eventTitle}" has been permanently removed.`,
                }
                dispatch(openSuccessModal({
                    title: titles[actionId],
                    description: descriptions[actionId],
                    variant: "success",
                }))
                if (actionsFor === "event-profile") {
                    router.push(DASHBOARD_NAVIGATION_LINKS.EVENTS_LISTING.href)
                } else {
                    trigger()
                }
            } else {
                dispatch(showAlert({
                    title: "Action Failed",
                    description: result.message ?? "Something went wrong. Please try again.",
                    variant: "destructive",
                }))
            }
            setLoadingAction(null)
        }

        run()
    }, [isConfirmed, lastConfirmedAction])


    return (
        <>
            <DropdownMenu modal={false} open={isOpen} onOpenChange={handleOpenChange}>
                <DropdownMenuTrigger asChild>
                    <button className="px-1 h-fit border border-brand-neutral-5 rounded-md transition-colors hover:bg-brand-neutral-2">
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
                    className="w-52 flex flex-col text-brand-secondary-9 space-y-1.5"
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