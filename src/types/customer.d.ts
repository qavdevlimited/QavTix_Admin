interface AdminUserCards {
    total_customers: number;
    new_this_period: number;
    repeat_buyers: number;
    average_spend: string;
}

interface AdminCustomer {
    user_id: number;
    full_name: string;
    email: string;
    profile_picture: string | null;
    date_joined: string;
    country: string | null;
    state: string | null;
    city: string | null;
    phone_number: string | null;
    tickets_bought: number;
    total_spend: string;
    status: "active" | "suspended" | "banned" | "flagged";
}

interface AdminCustomersData {
    count: number;
    total_pages: number;
    page: number;
    next: number | null;
    previous: number | null;
    results: AdminCustomer[];
}

interface AdminAffiliate {
    referral_id: string;
    affiliate_name: string;
    affiliate_email: string;
    profile_picture: string | null;
    event_id: string;
    event_name: string;
    clicks: number;
    signups: number;
    conversion: number;
    commission_earned: string;
    last_activity: string;
}

interface AdminAffiliatesData {
    count: number;
    total_pages: number;
    page: number;
    next: number | null;
    previous: number | null;
    results: AdminAffiliate[];
}

interface AdminAffiliateCards {
    total_affiliates: number;
    affiliate_growth: number;
    total_clicks: number;
    clicks_growth: number;
    conversion_rate: number;
    conversion_rate_growth: number;
    total_commission: string;
    commission_growth: number;
}

interface WithdrawalProfile {
    full_name: string;
    email: string;
    profile_picture: string | null;
}

interface WithdrawalBankAccount {
    account_number: string;
    account_name: string;
    bank_name: string;
}

interface AdminWithdrawal {
    payment_id: string;
    profile: WithdrawalProfile;
    bank_account: WithdrawalBankAccount;
    withdrawal_date: string;
    amount: string;
    status: "pending" | "completed" | "failed";
}

interface AdminWithdrawalsData {
    count: number;
    total_pages: number;
    page: number;
    next: number | null;
    previous: number | null;
    results: AdminWithdrawal[];
}





// User Profile Types
interface UserProfileDetails {
    user_id: number;
    email: string;
    full_name: string;
    phone_number: string;
    profile_picture: string;
    dob: string;
    gender: string;
    date_joined: string;
    country: string;
    state: string;
    city: string;
    is_host: boolean;
    business_name: string | null;
    business_type: string | null;
    description: string | null;
    relevant_links: any[];
    all_time_spend: string;
    all_time_tickets: number;
    first_purchase: string | null;
    last_purchase: string | null;
    bank_accounts: any[];
    account_status: string;
    is_active: boolean;
    wallet_balance: string;
}

interface UserKPICards {
    total_spent: string;
    total_spent_change: number;
    tickets_bought: number;
    tickets_bought_change: number;
    refund_count: number;
    refund_count_change: number;
    last_order_value: string;
    last_order_value_change: number;
}

interface UserChartDataPoint {
    label: string;
    amount: string;
}

interface UserPurchaseOrder {
    order_id: string;
    event_name: string;
    event_category: string;
    event_image: string;
    purchase_date: string;
    quantity: number;
    amount: string | number;
    status: "successful" | "cancelled" | "refunded" | "pending" | "failed" | "completed";
}

// Host Management Types
interface AdminHost {
    host_id: number;
    owner_name: string;
    owner_email: string;
    profile_picture: string | null;
    business_name: string;
    business_type: string | null;
    event_count: number;
    followers: number;
    total_revenue: string;
    status: string;
    verified: boolean;
    date_joined: string;
    blue_badge: boolean;
}



interface AdminHostCards {
    total_hosts: number;
    new_this_period: number;
    new_growth: number;
    tickets_sold: number;
    tickets_growth: number;
    commission_paid: string;
    commission_growth: number;
}

interface AdminPendingHost {
    host_id: number;
    business_name: string;
    owner_name: string;
    owner_email: string;
    owner_phone: string;
    profile_picture: string | null;
    signup_date: string;
    account_type: string;
    status: string;
    registration_number: string | null;
    tax_id: string | null;
    nin: string | null;
}

// Host Profile Types
interface HostBankAccount {
    id: string;
    account_name: string;
    account_number: string;
    bank_name: string;
    is_default: boolean;
}

interface HostProfileDetails {
    host_id: number;
    full_name: string;
    email: string;
    phone_number: string;
    profile_picture: string | null;
    profile_banner: string | null;
    business_name: string;
    business_type: string | null;
    description: string | null;
    registration_number: string | null;
    tax_id: string | null;
    nin: string | null;
    dob?: string | null;
    country: string;
    auto_payout?: boolean;
    state: string;
    city: string;
    followers: number;
    verified: boolean;
    relevant_links: { [key: string]: string }[]
    date_joined: string;
    bank_accounts: HostBankAccount[];
    account_status: string;
    is_subscribed: boolean;
    is_verified: boolean;
}

interface HostEarningsCards {
    all_time_earnings: string;
    current_balance: string;
    all_time_payouts: string;
    next_payout_date: string | null;
}

interface HostChartPoint {
    label: string;
    value: number;
}




interface AdminEventCards {
    live: number;
    suspended: number;
    ended: number;
    sold_out: number;
}


interface AdminEventAttendee {
    ticket_id: string;
    ticket_type: string;
    status: string;
    purchase_date: string;
    amount: string;
    quantity: string;
    attendee_name: string;
    attendee_email: string;
    profile_picture: string | null;
}