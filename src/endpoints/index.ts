export const ADMIN_DASHBOARD_CARDS_ENDPOINT = 'administrator/admin/dashboard/cards';
export const ADMIN_DASHBOARD_TICKET_ANALYTICS_ENDPOINT = 'administrator/admin/dashboard/ticket-analytics';
export const ADMIN_DASHBOARD_REVENUE_ENDPOINT = 'administrator/admin/dashboard/revenue';
export const ADMIN_DASHBOARD_ACTIVITIES_ENDPOINT = 'administrator/admin/dashboard/activities';

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

// Host Management
export const ADMIN_HOSTS_ENDPOINT = 'administrator/admin/hosts/';
export const ADMIN_HOSTS_CARDS_ENDPOINT = 'administrator/admin/hosts/cards/';
export const ADMIN_HOST_VERIFICATIONS_ENDPOINT = 'administrator/admin/hosts/verifications/';
export const ADMIN_HOST_SUSPEND_ENDPOINT = (hostID: string | number) => `administrator/admin/hosts/${hostID}/suspend/`;
export const ADMIN_HOST_BADGE_ENDPOINT = (hostID: string | number) => `administrator/admin/hosts/${hostID}/gift-badge/`;
export const ADMIN_HOST_APPROVE_ENDPOINT = (hostID: string | number) => `administrator/admin/hosts/${hostID}/approve/`;
export const ADMIN_HOST_DECLINE_ENDPOINT = (hostID: string | number) => `administrator/admin/hosts/${hostID}/decline/`;
export const ADMIN_HOST_PAYOUT_ENDPOINT = (hostID: string | number) => `administrator/admin/hosts/${hostID}/force-payout/`;