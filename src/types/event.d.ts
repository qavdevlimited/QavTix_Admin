interface TicketTier {
    id: string
    name: string
    price: number
    originalPrice: number
    currency: string
    description?: string
    features?: string[]
    available: boolean
    soldOut?: boolean
}

interface Discount {
    type: 'coupon' | 'membership'
    code?: string
    percentage?: number
    amount?: number
    description?: string
}

interface CheckoutTicket extends TicketTier {
    quantity: number
}


interface PriceRange {
    min: number
    max: number
}

interface Category {
    value: string
    label: string
    count: number
}

interface ActionOption {
    value: string
    label: string
}

interface Location {
    country: string
    state: string
}

interface StatusOption {
    value: string
    label: string
    color: string
    icon: string
    description: string
}



type EventStatus = "active" | "suspended" | "live" | "draft" | "ended" | "sold-out" | "cancelled" | "banned"
type EventPerformance = "fully_booked" | "almost_full" | "moderate_sales" | "low_sales" | "no_sales"

interface IEvent {
    id: string
    image: string
    status?: EventStatus
    category: string
    host: string
    title: string
    date: string //DateString
    location: string
    price: string
    originalPrice: string
    href: string
    attendees: Attendee[]
}


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





// Admin Events Listing
interface AdminEventLocation {
    city: string;
    state: string;
    country: string;
}

interface AdminEvent {
    event_id: string;
    title: string;
    status: EventStatus;
    category: string;
    featured_image: string | null;
    host_name: string;
    host_id: number;
    start_datetime: string;
    end_datetime: string;
    location: AdminEventLocation;
    tickets_sold: number;
    total_listed: number;
    revenue: string;
    views_count: number;
    saves_count: number;
    is_featured: boolean
}


interface HostEvent {
    event_id: string;
    title: string;
    category: string;
    status: string;
    start_datetime: string;
    end_datetime: string;
    location: string;
    featured_image: string | null;
    tickets_sold: number;
    total_listed: number;
    revenue: string;
    views_count: number;
    saves_count: number;
}


interface AdminEventDetail {
    event_id: string;
    title: string;
    status: string;
    category: string;
    featured_image: string | null;
    host_name: string;
    host_id: number;
    start_datetime: string;
    end_datetime: string;
    location: AdminEventLocation;
    tickets_sold: number;
    total_listed: number;
    revenue: string;
    views_count: number;
    saves_count: number;
    description?: string | null;
    short_description?: string | null;
}


// ─── Public Event Detail (shared with website) ────────────────────────────────

interface EventLocation {
    id: number
    event: string
    venue_name: string
    address: string
    country: string
    state: string
    city: string
    postal_code: string
}

interface EventSocialLink {
    url: string
}

interface EventTicket {
    id: number
    ticket_type: string
    description: string
    price: string
    quantity: number
    per_person_max: number
    currency: string
    sales_start: string
    sales_end: string
    promo_codes: { code: string; discount_percentage: number; maximum_users: number; valid_till: string }[]
}

interface UserTicketSummary {
    has_multiple: boolean
    total: number
    tickets: {
        issued_ticket_id: number
        ticket_type: string
        status: "active" | "cancelled"
        status_display: string
    }[]
}

interface EventDetails {
    id: string
    title: string
    category: string
    tags: string[]
    event_type: string
    start_datetime: string
    end_datetime: string
    location_type: string
    event_media: { image_url: string; video_url: string; is_featured: boolean }
    short_description: string
    full_description: string
    currency: string
    organizer_display_name: string
    organizer_description: string
    organizer_id: string
    public_email: string
    is_featured: boolean
    phone_number: string
    event_location: EventLocation
    social_links: EventSocialLink[]
    tickets: EventTicket[]
    event_status: EventStatus
    attendees_count: number
    age_restriction: boolean
    is_following: boolean
    is_favorite: boolean
    user_ticket_summary?: UserTicketSummary
}
