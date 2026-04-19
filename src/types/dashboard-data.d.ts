
interface AdminDashboardSectionOne {
    platform_revenue: number;
    revenue_growth: number;
    total_users: number;
    user_growth: number;
    transactions_today: number;
    transactions_yesterday: number;
    active_events: number;
    pending_payouts: number;
    system_uptime: number;
}

interface AdminDashboardSectionTwo {
    active_users: number;
    active_sellers: number;
    sales_this_month: number;
}

interface AdminDashboardSectionThree {
    users_this_week: number;
    hosts_this_week: number;
    events_this_week: number;
    payouts_this_week: number;
}


interface AdminDashboardCardsData {
    section_one: AdminDashboardSectionOne;
    section_two: AdminDashboardSectionTwo;
    section_three: AdminDashboardSectionThree;
}

interface AdminTicketAnalyticsOverall {
    ticket_type: string;
    count: number;
    percentage: number;
}

interface AdminTicketAnalyticsTimelineBreakdown {
    ticket_type: string;
    count: number;
}

interface AdminTicketAnalyticsTimeline {
    date: string;
    breakdown: AdminTicketAnalyticsTimelineBreakdown[];
}

interface AdminTicketAnalyticsData {
    overall: AdminTicketAnalyticsOverall[];
    total_sold: number;
    timeline: AdminTicketAnalyticsTimeline[];
}

interface AdminRevenueDataPoint {
    label: string;
    value: number;
}

interface AdminRevenueData {
    period: string;
    data: AdminRevenueDataPoint[];
}

interface AdminActivityMetadata {
    amount?: string;
    event_id?: string;
    order_id?: string;
    quantity?: number;
    buyer_name?: string;
    ticket_type?: string;
    attendee_name?: string;
    issued_ticket_id?: string;
    status?: string;
    withdrawal_id?: string;
}

interface AdminActivity {
    id: string;
    activity_type: 'sale' | 'checkin' | 'withdrawal' | string;
    message: string;
    metadata: AdminActivityMetadata;
    created_at: string;
}

interface AdminActivitiesData {
    count: number;
    next: number | null;
    previous: number | null;
    page: number;
    total_pages: number;
    results: AdminActivity[];
}

interface DashboardNotification {
    id: string;
    type: string;
    notification_type?: string;
    title: string;
    message: string;
    read: boolean;
    is_read?: boolean;
    created_at: string;
}