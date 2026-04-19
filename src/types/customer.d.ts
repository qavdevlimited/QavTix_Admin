interface AdminUserCards {
    total_customers: number;
    new_this_period: number;
    repeat_buyers:   number;
    average_spend:   string;
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
