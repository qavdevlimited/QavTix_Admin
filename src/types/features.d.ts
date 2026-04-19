type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json'

type ListingType = 'listed-for-sale' | 'already-resold'

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
    lastActivity?: DateRange
    withdrawalDate?: DateRange
    performance: EventPerformance | null
    sort: string | null,
    sortBy?: string | null,
    quantityRange: number | null,
    numberOfEvents: number | null,
    location: string | null,
    status: StatusOption["value"] | null
    categories: Category["value"][]
    action: ActionOption["value"][]
    ticketType: string[],
    revenue: number | null,
    user: AuthUser | null,
    purchaseDate?: Date | null
    listingType?: ListingType | null
    dateRangePreset?: "day" | "week" | "month" | null
    event?: string | null
    userStatus?: string | null
}

type RevalidateTarget = "financials" | "marketing" | "upcoming-events" | "customers" | "checkin" | "events" | "dashboard"


// Upcoming Events

interface UpcomingEventImage {
    image_url: string
    video_url: string
}

interface UpcomingEventCards {
    live: number
    draft: number
    ended: number
    sold_out: number
}

interface UpcomingEvent {
    id: string
    status: EventStatus
    title: string
    category: string
    event_image: UpcomingEventImage
    start_datetime: string
    event_location: string
    tickets_sold_percentage: number
    tickets_total_revenue: number
    tickets_listed: number
    tickets_sold: number
    views_count: number
    saves_count: number
}

interface UpcomingEventsData {
    count: number
    total_pages: number
    page: number
    next: number | null
    previous: number | null
    cards: UpcomingEventCards
    results: UpcomingEvent[]
}

interface UpcomingEventsParams {
    page?: number
    search?: string
    ordering?: string
    status?: EventStatus
    category?: number
    performance?: EventPerformance
    start_date?: string
    end_date?: string
}

interface GetUpcomingEventsResult {
    success: boolean
    data?: UpcomingEventsData
    message?: string
}

type DatePreset = 'day' | 'week' | 'month'
type ChartPreset = 'year' | 'week' | 'month'
type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'paid'

type UserActionID = "view-profile" | "suspend" | "export" | "ban" | "unban" | "unsuspend" | "delete"

type UserAction = {
    id: UserActionID
    label: string
    icon: string
    variant?: 'default' | 'danger'
    onClick?: () => void | Promise<void>
}