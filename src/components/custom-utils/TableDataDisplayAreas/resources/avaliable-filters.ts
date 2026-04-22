export type TableDataDisplayFilter = {
  label: string
  icon: string
  value: FilterKey
}

export type FilterKey =
  | 'categories'
  | 'status'
  | 'ticketType'
  | 'dateRange'
  | 'purchaseDate'
  | 'performance'
  | 'packageStatus'
  | 'sortBy'
  | 'priceRange'
  | 'dateRangePreset'
  | 'event'
  | 'action'
  | 'listingStatus'
  | 'location'
  | 'quantityRange'
  | 'user'
  | 'userStatus'
  | 'dateJoined'
  | 'spendRange'
  | 'lastActivity'
  | 'withdrawalDate'
  | 'transactionStatus'
  | 'amountRange'
  | 'purchaseDateRange'
  | 'host'
  | 'ticketStatus'
  | 'package'
  | 'billingCycle'
  | 'auditAction'
  | 'timestamp'


export const ALL_FILTERS = {
  categories: {
    value: 'categories',
    label: 'Category',
    icon: 'tabler:triangle-square-circle'
  },
  status: {
    value: 'status',
    label: 'Status',
    icon: 'ic:round-radio-button-checked'
  },
  listingStatus: {
    value: 'listingStatus',
    label: 'Status',
    icon: 'ic:round-radio-button-checked'
  },
  packageStatus: {
    value: 'packageStatus',
    label: 'Status',
    icon: 'ic:round-radio-button-checked'
  },
  ticketType: {
    value: 'ticketType',
    label: 'Ticket Type',
    icon: 'hugeicons:ticket-02'
  },
  priceRange: {
    value: 'priceRange',
    label: 'Price Range',
    icon: "hugeicons:dollar-square"
  },
  dateRange: {
    value: 'dateRange',
    label: 'Date Range',
    icon: 'solar:calendar-linear'
  },
  purchaseDate: {
    value: 'purchaseDate',
    label: 'Purchase Date',
    icon: 'solar:calendar-linear'
  },
  dateRangePreset: {
    value: 'dateRangePreset',
    label: 'Date Preset',
    icon: 'solar:calendar-linear'
  },
  performance: {
    value: 'performance',
    label: 'Performance',
    icon: 'hugeicons:chart-evaluation'
  },
  sortBy: {
    value: 'sortBy',
    label: 'Sort By',
    icon: 'hugeicons:sliders-horizontal'
  },
  event: {
    value: 'event',
    label: 'Event',
    icon: ''
  },
  action: {
    value: 'action',
    label: 'Action',
    icon: 'hugeicons:cursor-magic-selection-02'
  },
  location: {
    value: 'location',
    label: 'Location',
    icon: 'hugeicons:location-01'
  },
  quantityRange: {
    value: 'quantityRange',
    label: 'Quantity',
    icon: 'hugeicons:ticket-02'
  },
  user: {
    value: 'user',
    label: 'User',
    icon: 'hugeicons:user-group'
  },
  userStatus: {
    value: 'userStatus',
    label: 'User Status',
    icon: 'ic:round-radio-button-checked'
  },
  dateJoined: {
    value: 'dateJoined',
    label: 'Date Joined',
    icon: 'solar:calendar-linear'
  },
  spendRange: {
    value: 'spendRange',
    label: 'Spend Range',
    icon: 'hugeicons:dollar-square'
  },
  lastActivity: {
    value: 'lastActivity',
    label: 'Last Activity',
    icon: 'solar:calendar-linear'
  },
  transactionStatus: {
    value: 'transactionStatus',
    label: 'Transaction Status',
    icon: 'ic:round-radio-button-checked'
  },
  withdrawalDate: {
    value: 'withdrawalDate',
    label: 'Withdrawal Date',
    icon: 'solar:calendar-linear'
  },
  amountRange: {
    value: 'amountRange',
    label: 'Amount Range',
    icon: 'hugeicons:dollar-square'
  },
  purchaseDateRange: {
    value: 'purchaseDateRange',
    label: 'Purchase Date Range',
    icon: 'solar:calendar-linear'
  },
  host: {
    value: 'host',
    label: 'Host',
    icon: 'hugeicons:user-multiple-02'
  },
  ticketStatus: {
    value: 'ticketStatus',
    label: 'Ticket Status',
    icon: 'ic:round-radio-button-checked'
  },
  package: {
    value: 'package',
    label: 'Package',
    icon: 'hugeicons:package-01'
  },
  billingCycle: {
    value: 'billingCycle',
    label: 'Billing Cycle',
    icon: 'hugeicons:calendar-03'
  },
  auditAction: {
    value: 'auditAction',
    label: 'Action',
    icon: 'hugeicons:cursor-magic-selection-02'
  },
  timestamp: {
    value: 'timestamp',
    label: 'Timestamp',
    icon: 'solar:calendar-linear'
  }
} as const satisfies Record<FilterKey, TableDataDisplayFilter>


export type TabListItem = {
  value: string
  label: string
}

export const DashboardUpcomingEventsFilters = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.performance,
    ALL_FILTERS.dateRange,
  ] as const,

  tabList: [
    { value: 'upcoming', label: 'Upcoming Events' }
  ] as const
}


export const DashboardConsumerListFilters = {
  filterOptions: [
    { ...ALL_FILTERS.dateRange, label: "Purchase Date" }
  ] as const,
  tabList: [] as const
}


export const MarketingToolsFilter = {
  filterOptions: [] as const,
  tabList: [
    { value: "promo-codes", label: "Promo Codes" },
    { value: "affiliate-program", label: "Affiliate Program" },
    { value: "email-campaigns", label: "Email Campaigns" }
  ] as const
}


export const SystemCheckInDataTableFilters = {
  filterOptions: [
    ALL_FILTERS.ticketType,
    ALL_FILTERS.status
  ] as const,
  tabList: [
    { value: "scan-code", label: "Scan Code" },
    { value: "attendee-list", label: "Attendee List" },
  ] as const
}


export const SalesAnalyticsDataTableFilters = {
  filterOptions: [
    ALL_FILTERS.ticketType,
    ALL_FILTERS.purchaseDate
  ] as const,
  tabList: [] as const
}


export const DashboardEventsFilters = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.status,
    ALL_FILTERS.performance,
    ALL_FILTERS.sortBy,
    ALL_FILTERS.dateRange
  ] as const,

  tabList: [
    { value: 'all', label: 'All' },
    { value: 'live', label: 'Live' },
    { value: 'draft', label: 'Draft' },
    { value: 'ended', label: 'Ended' },
    { value: 'cancelled', label: 'Cancelled' }
  ] as const
}


export const MyEventsPageFilters = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.dateRange,
    ALL_FILTERS.performance,
    ALL_FILTERS.sortBy,
  ] as const,

  tabList: [
    { value: 'all', label: 'All' },
    { value: 'live', label: 'Live' },
    { value: 'draft', label: 'Draft & More' },
    { value: 'ended', label: 'Ended' },
    { value: 'cancelled', label: 'Cancelled' }
  ] as const
}


export type DashboardFilterConfig =
  | typeof DashboardUpcomingEventsFilters
  | typeof DashboardConsumerListFilters
  | typeof DashboardEventsFilters

export const HostProfileTabNFilterOptions = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.dateRange,
    ALL_FILTERS.performance,
    ALL_FILTERS.location,
    ALL_FILTERS.sortBy,
  ] as const,

  tabList: [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'ended', label: 'Ended' },
    { value: 'cancelled', label: 'Cancelled' }
  ] as const
}


export const HostManagementTabNFilterOptions = {
  tabFilterOptions: {
    'all-hosts': [
      ALL_FILTERS.userStatus,
      ALL_FILTERS.sortBy,
      ALL_FILTERS.dateRange,
    ],
    'pending-verification': [
      ALL_FILTERS.sortBy,
    ],
  } as Record<string, typeof ALL_FILTERS[keyof typeof ALL_FILTERS][]>,

  tabList: [
    { value: 'all-hosts', label: 'All Hosts' },
    { value: 'pending-verification', label: 'Pending Verification' },
  ] as const
}


export const UserManagementTabNFilterOptions = {
  tabFilterOptions: {
    users: [
      ALL_FILTERS.userStatus,
      ALL_FILTERS.location,
      ALL_FILTERS.dateJoined,
      { ...ALL_FILTERS.spendRange, label: "Total Spend" }
    ],
    affiliates: [
      ALL_FILTERS.lastActivity
    ],
    withdrawals: [
      ALL_FILTERS.status,
      ALL_FILTERS.withdrawalDate,
      ALL_FILTERS.amountRange
    ]
  },

  tabList: [
    { value: 'users', label: 'Users' },
    { value: 'affiliates', label: 'Affiliates' },
    { value: 'withdrawals', label: 'Withdrawal History' }
  ] as const
}

export const UserProfileTabNFilterOptions = {
  filterOptions: [
    ALL_FILTERS.purchaseDateRange,
    ALL_FILTERS.amountRange,
    ALL_FILTERS.quantityRange,
  ] as const
}

// Event Profile page tabs (overview + attendee-list)
export const EventProfileTabNFilterOptions = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.status,
    ALL_FILTERS.dateRange,
  ] as const,

  tabList: [
    { value: 'overview', label: 'Overview' },
    { value: 'attendee-list', label: 'Attendee List' },
  ] as const
}


// Admin Events Listing page
export const AdminEventsTabNFilterOptions = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.performance,
    ALL_FILTERS.location,
    ALL_FILTERS.dateRange,
    ALL_FILTERS.sortBy,
    ALL_FILTERS.host,
  ] as const,

  tabList: [
    { value: 'all', label: 'All' },
    { value: 'live', label: 'Live' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'ended', label: 'Ended' },
    { value: 'cancelled', label: 'Cancelled' },
  ] as const
}


// Attendee filter options (used on Admin Event Profile attendee tab)
export const AdminEventAttendeeFilterOptions = {
  filterOptions: [
    ALL_FILTERS.purchaseDateRange,
    ALL_FILTERS.ticketType,
    ALL_FILTERS.amountRange,
    ALL_FILTERS.ticketStatus,
  ] as const
}


// ─── Financials ──────────────────────────────────────────────────────────────

export const financialsFilterOptions = [
  ALL_FILTERS.purchaseDateRange,
  ALL_FILTERS.amountRange,
  ALL_FILTERS.sortBy,
] as const

export const financialsFilterOptionsForResaleOrders = [
  ALL_FILTERS.purchaseDateRange,
  ALL_FILTERS.amountRange,
  ALL_FILTERS.status,
] as const

export const FinancialsTabNFilterOptions = {
  tabFilterOptions: {
    'pending-payout': [
      { ...ALL_FILTERS.purchaseDateRange, label: "Request Date" },
      ALL_FILTERS.amountRange,
      ALL_FILTERS.host,
    ],
    'payout-history': [
      { ...ALL_FILTERS.purchaseDateRange, label: "Request Date" },
      ALL_FILTERS.amountRange,
      ALL_FILTERS.host
    ],
    'resale-orders': [
      { ...ALL_FILTERS.purchaseDateRange, label: "Request Date" },
      ALL_FILTERS.amountRange,
      ALL_FILTERS.listingStatus,
      ALL_FILTERS.host
    ],
    'featured-payments': [
      { ...ALL_FILTERS.purchaseDateRange, label: "Payment Date" },
      ALL_FILTERS.amountRange,
      ALL_FILTERS.package,
    ],
    'subscriptions': [
      { ...ALL_FILTERS.purchaseDateRange, label: "Payment Date" },
      ALL_FILTERS.amountRange,
      ALL_FILTERS.status,
      ALL_FILTERS.package,
      ALL_FILTERS.billingCycle,
      ALL_FILTERS.sortBy,
    ],
  } as Record<string, typeof ALL_FILTERS[keyof typeof ALL_FILTERS][]>,

  tabList: [
    { value: 'pending-payout', label: 'Pending Payouts' },
    { value: 'payout-history', label: 'Payout History' },
    { value: 'resale-orders', label: 'Resale Orders' },
    { value: 'featured-payments', label: 'Featured Payments' },
    { value: 'subscriptions', label: 'Subscriptions' },
  ] as const
}


// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const AuditTabNFilterOptions = {
  filterOptions: [
    ALL_FILTERS.timestamp,
    ALL_FILTERS.auditAction,
    ALL_FILTERS.dateRangePreset,
  ] as const,
}
