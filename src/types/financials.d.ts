// ─── Financial Cards ────────────────────────────────────────────────────────

interface AdminFinancialCards {
    total_gmv: string
    platform_fees: string
    affiliate_balance: string
    pending_payouts: string
}

interface AdminResaleCards {
    total_resale_revenue: string
    net_profit: string
    tickets_resold: string
    active_listings: string
}

// ─── Payout ─────────────────────────────────────────────────────────────────

interface PayoutSeller {
    name: string
    email: string
    profile_picture: string | null
    type: "host" | "attendee"
    business_name: string | null
}

interface PayoutBankAccount {
    account_name: string
    account_number: string
    bank_name: string
}

interface AdminPayout {
    payout_id: string
    host_id: string
    role: "host" | "affiliate"
    auto_payout: boolean
    amount: string
    request_date: string
    status: "pending" | "approved" | "declined" | "processing"
    seller: PayoutSeller
    bank_account: PayoutBankAccount
}

// ─── Marketplace (Resale Orders) ─────────────────────────────────────────────

interface MarketplaceReseller {
    name: string
    email: string
    profile_picture: string | null
}

interface MarketplaceEvent {
    id: string
    title: string
    category: string
    featured_image: string | null
}

interface AdminMarketplaceListing {
    ticket_id: string
    listing_id: number
    status: "active" | "sold" | "cancelled" | "expired"
    listing_price: string
    listing_date: string
    reseller: MarketplaceReseller
    event: MarketplaceEvent
}

// ─── Featured Payments ───────────────────────────────────────────────────────

interface FeaturedPaymentPackage {
    slug: "basic" | "standard" | "advanced" | "premium"
    name: string
    duration_days: number
}

interface FeaturedPaymentHost {
    name: string
    email: string
    business_name: string
    profile_picture: string | null
}

interface FeaturedPaymentEvent {
    id: string
    title: string
    category: string
    featured_image: string | null
}

interface AdminFeaturedPayment {
    payment_id: string
    status: "pending" | "active" | "expired" | "cancelled"
    package: FeaturedPaymentPackage
    amount: string
    payment_date: string
    payment_method: string | null
    host: FeaturedPaymentHost
    event: FeaturedPaymentEvent
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

interface SubscriptionPlan {
    slug: "pro" | "enterprise"
    name: string
}

interface SubscriptionTimeline {
    started_at: string
    expires_at: string
}

interface SubscriptionProfile {
    name: string
    email: string
    business_name: string
    profile_picture: string | null
}

interface AdminSubscription {
    payment_id: string
    status: "active" | "expired" | "cancelled"
    plan: SubscriptionPlan
    billing_cycle: "monthly" | "annual"
    timeline: SubscriptionTimeline
    amount: string
    payment_date: string
    currency: string
    profile: SubscriptionProfile
}
