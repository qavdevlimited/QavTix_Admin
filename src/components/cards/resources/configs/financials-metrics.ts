export type FinancialMetricKey = 
    | 'total-sales-gmv'
    | 'platform-fees'
    | 'affiliate-balance'
    | 'payouts-pending';

export const financialMetricsConfig: Record<FinancialMetricKey, MetricCardData1> = {
    'total-sales-gmv': {
        id: 'total-sales-gmv',
        value: '₦18,540,500',
        label: 'Total Sales (GMV)',
        description: 'All completed transactions',
        icon: "hugeicons:dollar-square",
        iconColor: 'text-[#359160]',
    },
    'platform-fees': {
        id: 'platform-fees',
        value: '₦1,854,050',
        label: 'Platform Fees',
        description: 'Fees earned by platform',
        icon: "hugeicons:task-edit-02",
        iconColor: 'text-[#FF9249]',
    },
    'affiliate-balance': {
        id: 'affiliate-balance',
        value: '17',
        label: 'Affiliate Balance',
        description: 'Available referral earnings',
        icon: "hugeicons:user-add-01",
        iconColor: 'text-[#C100C8]',
    },
    'payouts-pending': {
        id: 'payouts-pending',
        value: '11',
        label: 'Payouts Pending',
        description: 'Awaiting payout',
        icon: "hugeicons:wallet-01",
        iconColor: 'text-[#5E92DF]',
    },
}