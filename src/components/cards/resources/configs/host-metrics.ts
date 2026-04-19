export type HostMetricKey = 
    | 'ticket-hosts' 
    | 'new-this-month' 
    | 'tickets-sold' 
    | 'commision-paid';

export const hostAnalyticsMetricsConfig: Record<HostMetricKey, MetricCardData1> = {
    'ticket-hosts': {
        id: 'ticket-hosts',
        label: "Ticket Hosts/Sellers",
        icon: "famicons:people-outline",
        value: "47",
        iconColor: "text-[#914613]",
        description: "Partners hosting events",
    },
    'new-this-month': {
        id: 'new-this-month',
        value: '547',
        label: 'New this month',
        description: 'Latest ticket buyers.',
        icon: "famicons:gift-outline",
        iconColor: 'text-brand-accent-5',
    },
    'tickets-sold': {
        id: 'tickets-sold',
        value: '2347',
        label: 'Tickets Sold',
        description: 'Units sold by affiliates',
        icon: "hugeicons:ticket-02",
        iconColor: 'text-[#5E92DF]',
    },
    'commision-paid': {
        id: 'commision-paid',
        label: "Commision Paid Out",
        icon: "hugeicons:dollar-square",
        description: "Total earnings distributed.",
        iconColor: "text-[#359160]",
        value: "154,00"
    },
}



export type HostProfileMetricKey = 
    | 'all-time-earnings'
    | 'current-balance'
    | 'all-time-payouts'
    | 'next-payout-date';


export const hostProfileAnalyticsMetricsConfig: Record<HostProfileMetricKey, MetricCardData1> = {
    'all-time-earnings': {
        id: 'all-time-earnings',
        value: '₦3,540,500',
        label: 'All-time Earnings',
        description: 'Total revenue since signup',
        icon: "hugeicons:briefcase-dollar",
        iconColor: 'text-[#359160]',
    },
    'current-balance': {
        id: 'current-balance',
        value: '₦1,540,500',
        label: 'Current Balance',
        description: 'Available wallet balance',
        icon: "hugeicons:dollar-circle",
        iconColor: 'text-[#FF9249]',
    },
    'all-time-payouts': {
        id: 'all-time-payouts',
        value: '34',
        label: 'All-time Payouts',
        description: 'Total withdrawals made',
        icon: "hugeicons:wallet-done-01",
        iconColor: 'text-[#914613]',
    },
    'next-payout-date': {
        id: 'next-payout-date',
        value: 'Fri, Jan 9, 2026',
        label: 'Next Payout Date',
        description: 'Scheduled payment date',
        icon: "solar:calendar-outline",
        iconColor: 'text-[#5E92DF]',
    },
}