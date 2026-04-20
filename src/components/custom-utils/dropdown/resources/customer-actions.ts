import { USER_PROFILE } from "@/enums/navigation"
import { exportData } from "@/helper-fns/exportData"


export function buildCustomerActions(
    customerId: string | number,
    status: "active" | "suspended" | "banned" | "flagged",
    router: ReturnType<typeof import("next/navigation").useRouter>,
    user?: any
): UserAction[] {
    const actions: UserAction[] = [
        {
            id: "view-profile",
            label: "View Profile",
            icon: "hugeicons:face-id",
            onClick: () => router.push(USER_PROFILE.href.replace("[user_id]", customerId.toString())),
        }
    ]

    if (status === "active" || status === "flagged") {
        actions.push({
            id: "suspend",
            label: "Suspend User",
            icon: 'hugeicons:pause-circle',
            variant: "danger"
        })
        /*
        actions.push({
            id: "ban",
            label: "Ban User",
            icon: 'hugeicons:user-block-01',
            variant: "danger"
        })
        */
    }

    if (status === "suspended") {
        actions.push({
            id: "unsuspend",
            label: "Undo Suspension",
            icon: 'hugeicons:pause-circle',
        })
        /*
        actions.push({
            id: "ban",
            label: "Ban User",
            icon: 'hugeicons:user-block-01',
            variant: "danger"
        })
        */
    }

    if (status === "banned") {
        /*
        actions.push({
            id: "unban",
            label: "Restore User Access",
            icon: 'hugeicons:user-block-01',
        })
        */
    }

    return [...actions, {
        id: 'export',
        label: 'Export User Data',
        icon: 'bx:export',
        onClick: () => {
            if (user) {
                exportData({
                    data: [user],
                    format: 'csv',
                    filename: `user_${customerId}_export`,
                    title: `Export for User ${customerId}`
                })
            }
        }
    }]
}