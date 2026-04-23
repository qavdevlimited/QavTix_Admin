export const ADMIN_DASHBOARD_CARDS_ENDPOINT = 'administrator/admin/dashboard/cards';
export const ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT = 'administrator/admin/dashboard/ticket-analytics';
export const ADMIN_DASHBOARD_REVENUE_ENDPOINT = 'administrator/admin/dashboard/revenue';
export const ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT = 'administrator/admin/dashboard/activities';


export const REFRESH_TOKEN_ENDPOINT = "auth/token/refresh/"
export const TOKEN_VERIFY_ENDPOINT = "auth/token/verify/"


export const ADMIN_LOGIN_ENDPOINT = 'administrator/admin/login/';
export const ADMIN_VERIFY_OTP_ENDPOINT = 'administrator/admin/login/verify/';
export const ADMIN_PROFILE_ENDPOINT = 'administrator/admin/profile/';

export const ADMIN_USERS_ENDPOINT = 'administrator/admin/customers/';
export const ADMIN_USERS_CARDS_ENDPOINT = 'administrator/admin/customers/cards/';
export const ADMIN_AFFILIATES_ENDPOINT = 'administrator/admin/affiliates/';
export const ADMIN_AFFILIATES_CARDS_ENDPOINT = 'administrator/admin/affiliates/cards/';
export const ADMIN_WITHDRAWALS_ENDPOINT = 'administrator/admin/withdrawals/';

export const ADMIN_USER_PROFILE_ENDPOINT = (userId: string | number) => `administrator/admin/users/${userId}/profile`;
export const ADMIN_USER_CARDS_ENDPOINT = (userId: string | number) => `administrator/admin/users/${userId}/cards`;
export const ADMIN_USER_CHART_ENDPOINT = (userId: string | number) => `administrator/admin/users/${userId}/chart`;
export const ADMIN_USER_PURCHASE_HISTORY_ENDPOINT = (userId: string | number) => `administrator/admin/users/${userId}/orders`;

export const DASHBOARD_OVERVIEW_ENDPOINT = "host/dashboard/overview/"


export const SINGLE_SMS_ENDPOINT = "host/campaigns/send-single-sms/"
export const SEND_EMAIL_CAMPAIGNS_ENDPOINT = "host/campaigns/send/"
export const SINGLE_EMAIL_ENDPOINT = "host/campaigns/send-single/"


export const CATEGORIES_ENDPOINT = "public/categories"
export const EVENT_TICKET_TYPES_ENDPOINT = (eventId: string) => `administrator/admin/events/${eventId}/ticket-types/`

// Host Management
export const ADMIN_HOSTS_ENDPOINT = 'administrator/admin/hosts/';
export const ADMIN_HOSTS_CARDS_ENDPOINT = 'administrator/admin/hosts/cards/';
export const ADMIN_HOST_VERIFICATIONS_ENDPOINT = 'administrator/admin/hosts/verifications/';
export const ADMIN_HOST_SUSPEND_ENDPOINT = (hostID: string | number) => `administrator/admin/hosts/${hostID}/suspend/`;
export const ADMIN_HOST_BADGE_ENDPOINT = (hostID: string | number) => `administrator/admin/hosts/${hostID}/gift-badge/`;
export const ADMIN_HOST_APPROVE_ENDPOINT = (hostID: string | number) => `administrator/admin/hosts/${hostID}/approve/`;
export const ADMIN_HOST_DECLINE_ENDPOINT = (hostID: string | number) => `administrator/admin/hosts/${hostID}/decline/`;
export const ADMIN_HOST_PAYOUT_ENDPOINT = () => `administrator/admin/financials/payout/force/`;
export const ADMIN_HOST_AUTOPAYOUT_ENDPOINT = (hostID: string | number) => `administrator/admin/auto-payout/${hostID}/`;

// Host Profile
export const ADMIN_HOST_PROFILE_ENDPOINT = (hostId: string | number) => `administrator/admin/hosts/${hostId}/profile`;
export const ADMIN_HOST_CARDS_ENDPOINT = (hostId: string | number) => `administrator/admin/hosts/${hostId}/cards`;
export const ADMIN_HOST_CHART_ENDPOINT = (hostId: string | number) => `administrator/admin/hosts/${hostId}/chart`;
export const ADMIN_HOST_EVENTS_ENDPOINT = (hostId: string | number) => `administrator/admin/hosts/${hostId}/events/`;
export const ADMIN_HOST_EVENT_FEATURE_ENDPOINT = (eventId: string) => `administrator/admin/events/${eventId}/feature/`;
export const ADMIN_HOST_EVENT_SUSPEND_ENDPOINT = (eventId: string) => `administrator/admin/events/${eventId}/suspend/`;
export const ADMIN_HOST_EVENT_DELETE_ENDPOINT = (eventId: string) => `administrator/admin/events/${eventId}/delete/`;

// Admin Events Listing
export const ADMIN_EVENTS_ENDPOINT = 'administrator/admin/events/';
export const ADMIN_EVENTS_CARDS_ENDPOINT = 'administrator/admin/events/cards';
export const ADMIN_EVENT_DETAIL_ENDPOINT = (eventId: string) => `public/event/${eventId}/`;
export const ADMIN_EVENT_ATTENDEES_ENDPOINT = (eventId: string) => `administrator/admin/events/${eventId}/attendees/`;

// Admin Financials
export const ADMIN_FINANCIALS_CARDS_ENDPOINT = 'administrator/admin/financials/cards/';
export const ADMIN_FINANCIALS_RESALE_CARDS_ENDPOINT = 'administrator/admin/financials/resale-cards/';
export const ADMIN_FINANCIALS_PENDING_PAYOUTS_ENDPOINT = 'administrator/admin/financials/payouts/pending/';
export const ADMIN_FINANCIALS_APPROVED_PAYOUTS_ENDPOINT = 'administrator/admin/financials/payouts/approved/';
export const ADMIN_FINANCIALS_MARKETPLACE_ENDPOINT = 'administrator/admin/financials/marketplace/';
export const ADMIN_FINANCIALS_FEATURED_PAYMENTS_ENDPOINT = 'administrator/admin/financials/featured/';
export const ADMIN_FINANCIALS_SUBSCRIPTIONS_ENDPOINT = 'administrator/admin/financials/subscriptions/';

// Payout mutation endpoints
export const ADMIN_PAYOUT_APPROVE_ENDPOINT = (payoutId: string) => `administrator/admin/financials/payouts/${payoutId}/approve/`;
export const ADMIN_PAYOUT_DECLINE_ENDPOINT = (payoutId: string) => `administrator/admin/financials/payouts/${payoutId}/decline/`;
export const ADMIN_PAYOUT_FORCE_ENDPOINT = (payoutId: string) => `administrator/admin/financials/payout/${payoutId}/force/`;

// Admin Audit Logs
export const ADMIN_AUDIT_LOGS_ENDPOINT = 'administrator/admin/audit-logs/';

// Admin Config / Settings
export const ADMIN_CONFIG_GENERAL_ENDPOINT = 'administrator/admin/config/general/';
export const ADMIN_CONFIG_POLICIES_ENDPOINT = 'administrator/admin/config/policies/';
export const ADMIN_CONFIG_RESET_ENDPOINT = 'administrator/admin/config/reset-all/';
export const ADMIN_CONFIG_FEES_ENDPOINT = 'administrator/admin/config/fees/';
export const ADMIN_CONFIG_FRAUD_ENDPOINT = 'administrator/admin/config/fraud/';
export const ADMIN_CONFIG_NOTIFICATIONS_ENDPOINT = 'administrator/admin/config/notifications/';
export const ADMIN_CONFIG_LOCALIZATION_ENDPOINT = 'administrator/admin/config/localization/';