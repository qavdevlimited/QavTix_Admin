export type AccountActionType = 'banned' | 'suspended' | 'unsuspended' | 'payoutSuccess' | 'approvalSuccessful' | 'approvalDeclined';

interface UserAccountActionConfig {
    title: string;
    message: string;
    icon: string;
}

export const useraccountActionConfig: Record<AccountActionType, UserAccountActionConfig> = {
    banned: {
        title: "User Account Banned",
        message: "This account is now banned and the user no longer has access.",
        icon: "/images/vectors/user-ban.svg",
    },
    suspended: {
        title: "User Account Suspended",
        message: "This account is now suspended and the user no longer has access.",
        icon: "/images/vectors/user-suspension.svg",
    },
    unsuspended: {
        title: "User Account Restored",
        message: "This account has been temporarily restored. The user can now perform actions.",
        icon: "/images/vectors/blue-check.svg",
    },
    payoutSuccess: {
        title: "Payout Successful",
        message: "The payout request has been completed successfully.",
        icon: "/images/vectors/blue-check.svg",
    },
    approvalSuccessful: {
        title: "Approval Successful",
        message: "The account has been approved and is now active for access.",
        icon: "/images/vectors/blue-check.svg",
    },
    approvalDeclined: {
        title: "Approval Declined",
        message: "The account request has been declined and access has not been granted.",
        icon: "/images/vectors/decline.svg",
    }
}