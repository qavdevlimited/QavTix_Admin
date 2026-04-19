import { DASHBOARD_NAVIGATION_LINKS } from "@/enums/navigation";

export interface QuickActionConfig {
    id: string;
    label: string;
    description: string;
    href: string;
    icon: string;
    linkText: string
}

export const QUICK_ACTIONS: QuickActionConfig[] = [
    {
        id: 'manage-users',
        label: 'Manage Users',
        description: '+234 from last month',
        href: DASHBOARD_NAVIGATION_LINKS.USER_MANAGEMENT.href,
        icon: '/images/vectors/user-group.svg',
        linkText: "View Details"
    },
    {
        id: 'review-sellers',
        label: 'Review Sellers',
        description: '+16 this week',
        href: DASHBOARD_NAVIGATION_LINKS.HOST_MANAGEMENT.href,
        icon: '/images/vectors/dollar-tag.svg',
        linkText: "View Sellers"
    },
    {
        id: 'moderate-events',
        label: 'Moderate Events',
        description: '32 this week',
        href: DASHBOARD_NAVIGATION_LINKS.EVENTS_LISTING.href,
        icon: '/images/vectors/calendar.svg',
        linkText: "Moderate Events"
    },
    {
        id: 'process-payouts',
        label: 'Process Payouts',
        description: '4 Pending',
        href: DASHBOARD_NAVIGATION_LINKS.FINANCIALS.href,
        icon: '/images/vectors/dollar-out.svg',
        linkText: "Review Payout"
    },
]