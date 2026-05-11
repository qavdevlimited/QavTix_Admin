type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json'

type ListingType = 'active' | 'sold' | 'cancelled'

interface LocationValue {
    country: string
    city: string
    state?: string
    label: string
}

interface FilterValues {
    dateRange?: DateRange
    dateJoined?: DateRange
    transactionStatus?: TransactionStatus | null
    walletBalance: number | null,
    spend: number | null,
    priceRange: PriceRange | null
    amount: number | null,
    spendRange: PriceRange | null
    amountRange: PriceRange | null
    quantityRange: PriceRange | null
    commissionRange: PriceRange | null
    eventsRange: PriceRange | null
    revenueRange: PriceRange | null
    listingStatus: ListingType | null
    lastActivity?: DateRange
    purchaseDateRange?: DateRange
    withdrawalDate?: DateRange
    performance: EventPerformance | null
    sort: string | null,
    packageStatus: string | null,
    sortBy?: string | null,
    numberOfEvents: number | null,
    location?: LocationValue | null,
    status: StatusOption["value"] | null
    categories: Category["value"][]
    action: ActionOption["value"][]
    ticketType: TicketType[] | null,
    revenue: number | null,
    user: AuthUser | null,
    purchaseDate?: Date | null
    listingType?: ListingType | null
    dateRangePreset?: DatePreset | null
    event?: string | null
    userStatus?: string | null
    host?: string | null
    ticketStatus?: string[]
    package?: string | null
    billingCycle?: string | null
    auditAction?: string | null
    timestamp?: Date | null
}

type RevalidateTarget = "customers" | "customers-profile" | "event-listing" | "financials" | "audit"

interface TicketType {
    id: number
    ticket_type: string
    price: string
    quantity: number
    sold_count: number
}


type DatePreset = 'day' | 'week' | 'month' | 'year'
type ChartPreset = 'year' | 'week' | 'month'
type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'paid'

type UserActionID =
    | "view-profile"
    | "suspend"
    | "export"
    | "ban"
    | "unban"
    | "unsuspend"
    | "delete"
    | "gift-bluetick"
    | "force-payout"
    | "approve"
    | "decline"
    | "review-documents"

type UserAction = {
    id: UserActionID
    label: string
    icon: string
    variant?: 'default' | 'danger'
    disabled?: boolean
    onClick?: () => void | Promise<void>
}

type BulkEventActionId =
    | "bulk-unpublish"
    | "bulk-send-update"
    | "bulk-download"
    | "bulk-cancel"
    | "bulk-delete"
    | "bulk-unsuspend"

interface BulkEventAction {
    id: BulkEventActionId
    label: string
    icon: string
    variant?: "danger"
}

type BulkUserActionId =
    | "bulk-suspend"
    | "bulk-unsuspend"
    | "bulk-ban"
    | "bulk-export"

interface BulkUserAction {
    id: BulkUserActionId
    label: string
    icon: string
    variant?: "danger"
}

type BulkHostActionId =
    | "bulk-suspend"
    | "bulk-unsuspend"
    | "bulk-approve"
    | "bulk-decline"
    | "bulk-export"

interface BulkHostAction {
    id: BulkHostActionId
    label: string
    icon: string
    variant?: "danger"
}

type BulkFinancialsActionId =
    | "bulk-approve"
    | "bulk-decline"
    | "bulk-export"

interface BulkFinancialsAction {
    id: BulkFinancialsActionId
    label: string
    icon: string
    variant?: "danger"
}
