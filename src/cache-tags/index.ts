export const CACHE_TAGS = {
    // Dashboard
    UPCOMING_EVENTS: 'upcoming-events',
    DASHBOARD_CARDS: 'dashboard-cards',
    DASHBOARD_TICKET_ANALYTICS: 'dashboard-ticket-analytics',
    DASHBOARD_REVENUE: 'dashboard-revenue',
    DASHBOARD_ACTIVITIES: 'dashboard-activities',

    // Settings / Config
    SETTINGS_GENERAL: 'settings-general',
    SETTINGS_POLICIES: 'settings-policies',
    SETTINGS_FEES: 'settings-fees',
    SETTINGS_FRAUD: 'settings-fraud',
    SETTINGS_NOTIFICATIONS: 'settings-notifications',
    SETTINGS_LOCALIZATION: 'settings-localization',
    SETTINGS_ALL: 'settings-all',           // used for revalidateTag on reset-all

    // Filters
    CATEGORIES: 'categories',

    // Events
    ADMIN_EVENTS: 'admin-events',
    ADMIN_EVENT_CARDS: 'admin-event-cards',

    // Users / Customers
    ADMIN_USERS: 'admin-users',
    ADMIN_USER_CARDS: 'admin-user-cards',
    ADMIN_AFFILIATES: 'admin-affiliates',
    ADMIN_AFFILIATE_CARDS: 'admin-affiliate-cards',

    // Host management
    ADMIN_HOSTS: 'admin-hosts',
    ADMIN_HOST_CARDS: 'admin-host-cards',
    ADMIN_PENDING_HOSTS: 'admin-pending-hosts',

    // Financials
    ADMIN_FINANCIAL_CARDS: 'admin-financial-cards',
    ADMIN_PENDING_PAYOUTS: 'admin-pending-payouts',
    ADMIN_APPROVED_PAYOUTS: 'admin-approved-payouts',
    ADMIN_RESALE_CARDS: 'admin-resale-cards',

    // Audit
    ADMIN_AUDIT_LOGS: 'admin-audit-logs',
} as const