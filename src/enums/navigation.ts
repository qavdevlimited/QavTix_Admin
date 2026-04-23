interface ILink {
    readonly href: string;
    label: string;
    icon?: string;
}

type AuthLinkKey = 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

export const AUTH_LINKS: Record<AuthLinkKey, ILink> = {
    SIGN_IN: {
        href: "/auth/signin",
        label: "Sign In",
    },
    SIGN_UP: {
        href: "/auth/signup",
        label: "Sign Up",
    },
    FORGOT_PASSWORD: {
        href: "/auth/forgot-password",
        label: "Forgot Password",
    },
    RESET_PASSWORD: {
        href: "/auth/reset-password",
        label: "Reset Password",
    },
} as const;




type DashboardLinkKey =
    | 'DASHBOARD'
    | 'USER_MANAGEMENT'
    | 'HOST_MANAGEMENT'
    | 'EVENTS_LISTING'
    | 'FINANCIALS'
    | 'SYSTEM_CONFIGURATION'
    | 'AUDIT_LOGS'
    ;

export const DASHBOARD_NAVIGATION_LINKS: Record<DashboardLinkKey, ILink> = {
    DASHBOARD: {
        href: "/dashboard",
        icon: "hugeicons:grid-view",
        label: "Dashboard",
    },
    USER_MANAGEMENT: {
        href: "/dashboard/user-management",
        icon: "hugeicons:user-multiple-02",
        label: "User Management",
    },
    HOST_MANAGEMENT: {
        href: "/dashboard/host-management",
        icon: "hugeicons:student-card",
        label: "Host Management",
    },
    EVENTS_LISTING: {
        href: "/dashboard/events-listing",
        icon: "hugeicons:calendar-02",
        label: "Events & Listing",
    },
    FINANCIALS: {
        href: "/dashboard/financials",
        icon: "hugeicons:coins-01",
        label: "Financials",
    },
    AUDIT_LOGS: {
        href: "/dashboard/audit",
        icon: "hugeicons:add-to-list",
        label: "Audit Logs & Activity",
    },
    SYSTEM_CONFIGURATION: {
        href: "/dashboard/settings",
        icon: "hugeicons:settings-01",
        label: "System Configuration",
    },
}

export const ADMIN_SETTINGS_SUB_LINKS = [
    { label: "General Settings", href: `${DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href}/general` },
    { label: "Fees & Commission", href: `${DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href}/fees-commission` },
    { label: "Security & Abuse Prevention", href: `${DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href}/security` },
    { label: "Notifications", href: `${DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href}/notifications` },
    { label: "Localization", href: `${DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href}/localization` }
]


export const USER_PROFILE: ILink = {
    href: `${DASHBOARD_NAVIGATION_LINKS.USER_MANAGEMENT.href}/profile/[user_id]`,
    label: "",
    icon: ""
}

export const HOST_PROFILE: ILink = {
    href: `${DASHBOARD_NAVIGATION_LINKS.HOST_MANAGEMENT.href}/profile/[host_id]`,
    label: "",
    icon: ""
}

export const EVENT_PROFILE: ILink = {
    href: `${DASHBOARD_NAVIGATION_LINKS.EVENTS_LISTING.href}/profile/[event_id]`,
    label: "",
    icon: ""
}

export const EVENT_DETAILS_LINK = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/events/details/[event_id]/` as const;
export const FAQ_PAGE = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/faq/` as const;
