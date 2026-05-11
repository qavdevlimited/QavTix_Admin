import { HOST_PROFILE } from "@/enums/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export function buildHostActions(host: AdminHost, router: AppRouterInstance): UserAction[] {
    const actions: UserAction[] = [
        {
            id: "view-profile",
            label: "View Host Profile",
            icon: "hugeicons:face-id",
            onClick: () => router.push(HOST_PROFILE.href.replace("[host_id]", String(host.host_id))),
        },
    ]

    // Only offer Gift Blue Tick if not already verified
    if (!host.blue_badge) {
        actions.push({
            id: "gift-bluetick",
            label: "Gift Blue Tick",
            icon: "hugeicons:checkmark-badge-01",
        })
    }

    actions.push({
        id: "force-payout",
        label: "Force Payout",
        icon: "hugeicons:dollar-square",
    })

    if (host.status !== "suspended") {
        actions.push({
            id: "suspend",
            label: "Suspend Host",
            icon: "hugeicons:pause-circle",
            variant: "danger",
        })
    } else {
        actions.push({
            id: "unsuspend",
            label: "Restore Host Access",
            icon: "hugeicons:pause-circle",
        })
    }

    actions.push({
        id: "export",
        label: "Export Host Data",
        icon: "bx:export",
    })

    return actions
}

export const pendingHostActions: UserAction[] = [
    {
        id: "review-documents",
        label: "Review Documents",
        icon: "hugeicons:document-attachment",
    },
    {
        id: "approve",
        label: "Approve Request",
        icon: "prime:check-square",
    },
    {
        id: "decline",
        label: "Decline Request",
        icon: "iconoir:cancel",
        variant: "danger",
    },
]
