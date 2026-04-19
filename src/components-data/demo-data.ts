export const dashboardCards: IDashboardStat[] = [
  {
    icon: "hugeicons:analytics-01",
    iconBg: "bg-[#FA5A7D]",
    cardBg: "bg-[#FFE2E5]",
    number: 1213456,
    label: "Total Revenue",
    change: {
      value: "+23%",
      period: "from last month",
      isPositive: true
    },
    linkText: "View Details →",
    linkHref: "/dashboard/revenue"
  },
  {
    icon: "icon-park-solid:ticket",
    iconBg: "bg-[#FF947A]",
    cardBg: "bg-[#FFF4DE]",
    number: 3456,
    label: "Tickets Sold",
    change: {
      value: "+156",
      period: "this week",
      isPositive: true
    },
    linkText: "View Sales →",
    linkHref: "/dashboard/sales"
  },
  {
    icon: "hugeicons:calendar-check-out-02",
    iconBg: "bg-brand-primary-5",
    cardBg: "bg-[#E6EEFA]",
    number: 12,
    label: "Active Events",
    change: {
      value: "3 this week",
      period: "",
      isPositive: true
    },
    linkText: "Manage Events →",
    linkHref: "/dashboard/events"
  },
  {
    icon: "ph:currency-circle-dollar-bold",
    iconBg: "bg-[#83AD7D]",
    cardBg: "bg-[#EFFFED]",
    number: 12,
    label: "Pending Payouts",
    change: {
      value: "3 this week",
      period: "",
      isPositive: true
    },
    linkText: "Payout History →",
    linkHref: "/dashboard/payouts"
  }
]


export const activities : ActivityItem[] = [
    {
      id: '1',
      type: 'new_sale',
      title: 'Dominic Evans purchased 2 VIP tickets to Five Tour Concert',
      subtitle: 'Revenue Generated: ₦50,000',
      timestamp: '2 mins ago',
      eventId: 'event-123'
    },
    {
      id: '2',
      type: 'check_in',
      title: '45 attendees checked in for DevFest Lekki',
      timestamp: '1 hr ago',
      eventId: 'event-456'
    },
    {
      id: '3',
      type: 'low_stock',
      title: '0 tickets remaining for DevFest Lekki',
      subtitle: 'Ticket Low Stock Alert',
      timestamp: '1 hr ago',
      eventId: 'event-456'
    },
    {
      id: '4',
      type: 'low_stock',
      title: 'Only 12 VIP tickets remaining for Five Tour Concert',
      subtitle: 'Ticket Low Stock Alert',
      timestamp: '2 hrs ago',
      eventId: 'event-123'
    }
  ]

export const notifications : NotificationItem[] = [
    {
      id: '1',
      type: 'new_sale',
      title: '2 tickets sold for Five Tour Concert',
      subtitle: 'New Sale',
      timestamp: '5 mins ago',
      status: 'unread'
    },
    {
      id: '2',
      type: 'payout',
      title: '₦125,000 sent to your account',
      subtitle: 'Payout processed',
      timestamp: '2 hrs ago',
      status: 'unread'
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Tech Conference starts tomorrow',
      subtitle: 'Event reminder',
      timestamp: 'Yesterday',
      status: 'read'
    }
  ]




export const mockMetrics: MetricCardData1[] = [
        {
            id: 'total-customers',
            value: '612',
            label: 'Total customers',
            description: "Everyone you've served.",
            icon: "famicons:people-outline",
            iconColor: 'text-[#359160]',
        },
        {
            id: 'new-month',
            value: '547',
            label: 'New this month',
            description: 'Latest ticket buyers.',
            icon: "famicons:gift-outline",
            iconColor: 'text-brand-accent-5',
        },
        {
            id: 'repeat-buyers',
            value: '17',
            label: 'Repeat Buyers',
            description: 'Customers who returned',
            icon: "uil:repeat",
            iconColor: 'text-brand-accent-9',
        },
        {
            id: 'average-spend',
            value: '₦5,500',
            label: 'Average Spend',
            description: 'Avg. spend per customer.',
            icon: "icon-park-outline:average",
            iconColor: 'text-blue-600',
        }
    ]



export const mockUserMetrics = [
    {
        id: 1,
        label: "Total Spent",
        value: "₦234,500",
        trendData: [210000, 215000, 218000, 225000, 230000, 228000, 232000, 235000, 234500],
        isNegativeGood: false
    },
    {
        id: 2,
        label: "Tickets Bought",
        value: "51",
        trendData: [45, 46, 47, 48, 49, 50, 51, 52, 51],
        isNegativeGood: false
    },
    {
        id: 3,
        label: "Refund Count",
        value: "51",
        trendData: [65, 63, 60, 58, 56, 54, 53, 52, 51],
        isNegativeGood: true
    },
    {
        id: 4,
        label: "Last Order Value",
        value: "₦7,200",
        trendData: [6500, 6600, 6700, 6800, 6900, 7000, 7100, 7150, 7200],
        isNegativeGood: false
    }
]



export const mockUpcomingEvents = [
    {
        id: '1',
        image: '/images/demo-images/event-detail-img.png',
        status: 'ended',
        category: 'Tech Summit',
        host: 'Tech Hub',
        title: 'DevFest Lekki',
        date: 'Nov 14, 2025',
        time: '9:00 am',
        location: '1234 Victoria Island, Opposite Figma Head Office, Lagos, Nigeria',
        price: '₦5,000',
        href: '/events/1',
        attendees: [],
        ticketsSold: 174,
        totalTickets: 500,
        revenue: 635000
    },
    {
        id: '2',
        image: '/images/demo-images/event-detail-img.png',
        status: 'live',
        category: 'Music Festival',
        host: 'Live Nation',
        title: 'Sive Tour Concert',
        date: 'Nov 15, 2025',
        time: '6:00 pm',
        location: 'Doo & Shima, Elegushi Beach, Ikoyi, Lagos State',
        price: '₦15,000',
        href: '/events/2',
        attendees: [],
        ticketsSold: 254,
        totalTickets: 500,
        revenue: 635000
    },
    {
        id: '3',
        image: '/images/demo-images/event-detail-img.png',
        status: 'cancelled',
        category: 'Food Festival',
        host: 'Food Lovers',
        title: 'Bole Fest 2025',
        date: 'Nov 17, 2025',
        time: '11:00 am',
        location: "567 O'Brien Crescent, off Airport Road, Umuahia",
        price: '₦3,000',
        href: '/events/3',
        attendees: [],
        ticketsSold: 254,
        totalTickets: 500,
        revenue: 635000
    },
    {
        id: '4',
        image: '/images/demo-images/event-detail-img.png',
        status: 'ended',
        category: 'Sports Event',
        host: 'Gaming Hub',
        title: 'PS5 Gamers Clash',
        date: 'Nov 18, 2025',
        time: '4:00 pm',
        location: "567 O'Brien Crescent, off Airport Road, Umuahia",
        price: '₦2,500',
        href: '/events/4',
        attendees: [],
        ticketsSold: 254,
        totalTickets: 500,
        revenue: 635000
    },
    {
        id: '5',
        image: '/images/demo-images/event-detail-img.png',
        status: 'live',
        category: 'Cultural Event',
        host: 'Heritage Foundation',
        title: 'Owerri Cultural Day',
        date: 'Nov 19, 2025',
        time: '2:00 pm',
        location: 'Hero Square, New Owerri, Imo State',
        price: '₦1,000',
        href: '/events/5',
        attendees: [],
        ticketsSold: 254,
        totalTickets: 500,
        revenue: 635000
    },
    {
        id: '6',
        image: '/images/demo-images/event-detail-img.png',
        status: 'live',
        category: 'Kids Event',
        host: 'Fun Zone',
        title: 'Kiddies Funfair Fest',
        date: 'Nov 20, 2025',
        time: '9:00 am',
        location: 'Dreamworld Africana, KM 20 Lekki-Ajah Expressway, Lagos',
        price: '₦5,000',
        href: '/events/6',
        attendees: [],
        ticketsSold: 254,
        totalTickets: 500,
        revenue: 635000
    },
    {
        id: '7',
        image: '/images/demo-images/event-detail-img.png',
        status: 'suspended',
        category: 'Kids Event',
        host: 'Fun Zone',
        title: 'Kiddies Funfair Fest',
        date: 'Nov 20, 2025',
        time: '9:00 am',
        location: 'Dreamworld Africana, KM 20 Lekki-Ajah Expressway, Lagos',
        price: '₦5,000',
        href: '/events/6',
        attendees: [],
        ticketsSold: 254,
        totalTickets: 500,
        revenue: 635000
    }
]


export interface Ticket {
    id: string
    ticketId: string
    attendee: {
        name: string
        email: string
        id: string
    }
    ticketType: 'VIP' | 'Regular' | 'Standard' | 'Early Bird' | 'General Admission'
    quantity: number
    amount: number
    purchaseDate: string
    purchaseTime: string
    status: 'checked-in' | 'pending' | 'failed' | 'successful'
    eventId: string
}

export const mockTickets: Ticket[] = [
    {
        id: '1',
        ticketId: 'PMT-2025-1234567',
        attendee: {
            name: 'Dominic Evans',
            email: 'domevans@gmail.com',
            id: 'user-1'
        },
        ticketType: 'VIP',
        quantity: 3,
        amount: 35000,
        purchaseDate: 'Nov 14, 2025',
        purchaseTime: '8:45 am',
        status: 'checked-in',
        eventId: '1'
    },
    {
        id: '2',
        ticketId: 'PMT-2025-1234567',
        attendee: {
            name: 'Chinedu Okafor',
            email: 'edubrazil042@gmail.com',
            id: 'user-2'
        },
        ticketType: 'Regular',
        quantity: 3,
        amount: 35000,
        purchaseDate: 'Nov 14, 2025',
        purchaseTime: '9:10 am',
        status: 'checked-in',
        eventId: '1'
    },
    {
        id: '3',
        ticketId: 'PMT-2025-1234567',
        attendee: {
            name: 'Aisha Mohammed',
            email: 'Aishamoha22@yahoo.com',
            id: 'user-3'
        },
        ticketType: 'Standard',
        quantity: 3,
        amount: 35000,
        purchaseDate: '---',
        purchaseTime: '',
        status: 'pending',
        eventId: '2'
    },
    {
        id: '4',
        ticketId: 'PMT-2025-1234567',
        attendee: {
            name: 'Temitope Adeyemi',
            email: 'temiyemi10@outlook.com',
            id: 'user-4'
        },
        ticketType: 'Regular',
        quantity: 3,
        amount: 35000,
        purchaseDate: 'Nov 14, 2025',
        purchaseTime: '10:00 am',
        status: 'failed',
        eventId: '2'
    },
    {
        id: '5',
        ticketId: 'PMT-2025-1234567',
        attendee: {
            name: 'Ibrahim Danladi',
            email: 'ibrahimlad77@gmail.com',
            id: 'user-5'
        },
        ticketType: 'Regular',
        quantity: 3,
        amount: 35000,
        purchaseDate: 'Nov 14, 2025',
        purchaseTime: '10:00 am',
        status: 'successful',
        eventId: '3'
    },
    {
        id: '6',
        ticketId: 'PMT-2025-1234567',
        attendee: {
            name: 'Dominic Evans',
            email: 'domevans@gmail.com',
            id: 'user-1'
        },
        ticketType: 'VIP',
        quantity: 3,
        amount: 35000,
        purchaseDate: 'Nov 14, 2025',
        purchaseTime: '8:45 am',
        status: 'checked-in',
        eventId: '3'
    },
    {
        id: '7',
        ticketId: 'PMT-2025-1234567',
        attendee: {
            name: 'Chinedu Okafor',
            email: 'edubrazil042@gmail.com',
            id: 'user-2'
        },
        ticketType: 'Regular',
        quantity: 3,
        amount: 35000,
        purchaseDate: 'Nov 14, 2025',
        purchaseTime: '9:10 am',
        status: 'checked-in',
        eventId: '4'
    },
    {
        id: '8',
        ticketId: 'PMT-2025-1234568',
        attendee: {
            name: 'Blessing Nwosu',
            email: 'blessingnw@gmail.com',
            id: 'user-6'
        },
        ticketType: 'Early Bird',
        quantity: 2,
        amount: 28000,
        purchaseDate: 'Nov 13, 2025',
        purchaseTime: '3:15 pm',
        status: 'successful',
        eventId: '5'
    },
    {
        id: '9',
        ticketId: 'PMT-2025-1234569',
        attendee: {
            name: 'Emeka Obi',
            email: 'emekaobi99@yahoo.com',
            id: 'user-7'
        },
        ticketType: 'General Admission',
        quantity: 1,
        amount: 15000,
        purchaseDate: 'Nov 15, 2025',
        purchaseTime: '11:30 am',
        status: 'pending',
        eventId: '6'
    },
    {
        id: '10',
        ticketId: 'PMT-2025-1234570',
        attendee: {
            name: 'Fatima Bello',
            email: 'fatimab@outlook.com',
            id: 'user-8'
        },
        ticketType: 'VIP',
        quantity: 4,
        amount: 45000,
        purchaseDate: 'Nov 12, 2025',
        purchaseTime: '2:00 pm',
        status: 'checked-in',
        eventId: '1'
    }
]




export interface Payout {
    id: string
    payoutId: string
    businessName: string
    seller: {
        name: string
        email: string
        id: string
    }
    amount: number
    requestDate: string
    requestTime: string
    status: 'pending' | 'approved' | 'declined' | 'processing'
}

export const mockPayouts: Payout[] = [
    {
        id: '1',
        payoutId: 'PMT-2025-1234567',
        businessName: 'Pulse Concerts',
        seller: {
            name: 'Shola Martins',
            email: 'shola@pulseconcerts.com',
            id: 'seller-1'
        },
        amount: 6120000,
        requestDate: 'Nov 14, 2025',
        requestTime: '9:00 am',
        status: 'pending'
    },
    {
        id: '2',
        payoutId: 'PMT-2025-1234567',
        businessName: 'Vibe Nation Events',
        seller: {
            name: 'Tunde Adebayo',
            email: 'bayo@vibeevents.com',
            id: 'seller-2'
        },
        amount: 4250000,
        requestDate: 'Nov 14, 2025',
        requestTime: '9:00 am',
        status: 'pending'
    },
    {
        id: '3',
        payoutId: 'PMT-2025-1234567',
        businessName: 'Prime Sports Africa',
        seller: {
            name: 'Femi Adekunle',
            email: 'femikay@primesports.com',
            id: 'seller-3'
        },
        amount: 3890000,
        requestDate: 'Nov 14, 2025',
        requestTime: '9:00 am',
        status: 'pending'
    },
    {
        id: '4',
        payoutId: 'PMT-2025-1234567',
        businessName: 'Kingdom Sound Ministry',
        seller: {
            name: 'Pastor Daniel Obi',
            email: 'pastley@ksmministries.com',
            id: 'seller-4'
        },
        amount: 1350000,
        requestDate: 'Nov 14, 2025',
        requestTime: '9:00 am',
        status: 'pending'
    },
    {
        id: '5',
        payoutId: 'PMT-2025-1234567',
        businessName: 'ArtHouse Collective',
        seller: {
            name: 'Ifunanya Nwoye',
            email: 'ify@arthouse.co.org',
            id: 'seller-5'
        },
        amount: 2780000,
        requestDate: 'Nov 14, 2025',
        requestTime: '9:00 am',
        status: 'pending'
    },
    {
        id: '6',
        payoutId: 'PMT-2025-1234567',
        businessName: 'Pulse Concerts',
        seller: {
            name: 'Shola Martins',
            email: 'shola@pulseconcerts.com',
            id: 'seller-1'
        },
        amount: 6120000,
        requestDate: 'Nov 14, 2025',
        requestTime: '9:00 am',
        status: 'approved'
    },
    {
        id: '7',
        payoutId: 'PMT-2025-1234568',
        businessName: 'Lagos Food Hub',
        seller: {
            name: 'Amara Chukwu',
            email: 'amara@lagosdfoodhub.com',
            id: 'seller-6'
        },
        amount: 1890000,
        requestDate: 'Nov 13, 2025',
        requestTime: '2:30 pm',
        status: 'processing'
    },
    {
        id: '8',
        payoutId: 'PMT-2025-1234569',
        businessName: 'Tech Summit Nigeria',
        seller: {
            name: 'Chidi Okonkwo',
            email: 'chidi@techsummit.ng',
            id: 'seller-7'
        },
        amount: 5450000,
        requestDate: 'Nov 12, 2025',
        requestTime: '11:15 am',
        status: 'declined'
    },
    {
        id: '9',
        payoutId: 'PMT-2025-1234570',
        businessName: 'Elite Sports Academy',
        seller: {
            name: 'Bola Tinubu Jr',
            email: 'bola@elitesports.ng',
            id: 'seller-8'
        },
        amount: 3200000,
        requestDate: 'Nov 11, 2025',
        requestTime: '4:45 pm',
        status: 'approved'
    },
    {
        id: '10',
        payoutId: 'PMT-2025-1234571',
        businessName: 'Naija Comedy Central',
        seller: {
            name: 'Obi Uchendu',
            email: 'obi@naijacomedy.ng',
            id: 'seller-9'
        },
        amount: 2150000,
        requestDate: 'Nov 10, 2025',
        requestTime: '10:00 am',
        status: 'pending'
    }
]



export interface PayoutHistory {
    id: string
    payoutId: string
    businessName: string
    seller: {
        name: string
        email: string
        id: string
    }
    amount: number
    paymentDate: string
    paymentTime: string
    status: 'successful' | 'processing' | 'failed' | 'cancelled'
}

export const mockPayoutHistory: PayoutHistory[] = [
    {
        id: '1',
        payoutId: 'PMT-2025-1234567',
        businessName: 'Pulse Concerts',
        seller: {
            name: 'Shola Martins',
            email: 'shola@pulseconcerts.com',
            id: 'seller-1'
        },
        amount: 6120000,
        paymentDate: 'Nov 14, 2025',
        paymentTime: '9:00 am',
        status: 'successful'
    },
    {
        id: '2',
        payoutId: 'PMT-2025-1234567',
        businessName: 'Vibe Nation Events',
        seller: {
            name: 'Tunde Adebayo',
            email: 'bayo@vibeevents.com',
            id: 'seller-2'
        },
        amount: 4250000,
        paymentDate: 'Nov 14, 2025',
        paymentTime: '9:00 am',
        status: 'successful'
    },
    {
        id: '3',
        payoutId: 'PMT-2025-1234567',
        businessName: 'Prime Sports Africa',
        seller: {
            name: 'Femi Adekunle',
            email: 'femikay@primesports.com',
            id: 'seller-3'
        },
        amount: 3890000,
        paymentDate: 'Nov 14, 2025',
        paymentTime: '9:00 am',
        status: 'processing'
    },
    {
        id: '4',
        payoutId: 'PMT-2025-1234567',
        businessName: 'Kingdom Sound Ministry',
        seller: {
            name: 'Pastor Daniel Obi',
            email: 'pastley@ksmministries.com',
            id: 'seller-4'
        },
        amount: 1350000,
        paymentDate: 'Nov 14, 2025',
        paymentTime: '9:00 am',
        status: 'successful'
    },
    {
        id: '5',
        payoutId: 'PMT-2025-1234567',
        businessName: 'ArtHouse Collective',
        seller: {
            name: 'Ifunanya Nwoye',
            email: 'ify@arthouse.co.org',
            id: 'seller-5'
        },
        amount: 2780000,
        paymentDate: 'Nov 14, 2025',
        paymentTime: '9:00 am',
        status: 'successful'
    },
    {
        id: '6',
        payoutId: 'PMT-2025-1234567',
        businessName: 'Pulse Concerts',
        seller: {
            name: 'Shola Martins',
            email: 'shola@pulseconcerts.com',
            id: 'seller-1'
        },
        amount: 6120000,
        paymentDate: 'Nov 14, 2025',
        paymentTime: '9:00 am',
        status: 'successful'
    },
    {
        id: '7',
        payoutId: 'PMT-2025-1234568',
        businessName: 'Lagos Food Hub',
        seller: {
            name: 'Amara Chukwu',
            email: 'amara@lagosfoodhub.com',
            id: 'seller-6'
        },
        amount: 1890000,
        paymentDate: 'Nov 13, 2025',
        paymentTime: '2:30 pm',
        status: 'failed'
    },
    {
        id: '8',
        payoutId: 'PMT-2025-1234569',
        businessName: 'Tech Summit Nigeria',
        seller: {
            name: 'Chidi Okonkwo',
            email: 'chidi@techsummit.ng',
            id: 'seller-7'
        },
        amount: 5450000,
        paymentDate: 'Nov 12, 2025',
        paymentTime: '11:15 am',
        status: 'successful'
    },
    {
        id: '9',
        payoutId: 'PMT-2025-1234570',
        businessName: 'Elite Sports Academy',
        seller: {
            name: 'Bola Tinubu Jr',
            email: 'bola@elitesports.ng',
            id: 'seller-8'
        },
        amount: 3200000,
        paymentDate: 'Nov 11, 2025',
        paymentTime: '4:45 pm',
        status: 'cancelled'
    },
    {
        id: '10',
        payoutId: 'PMT-2025-1234571',
        businessName: 'Naija Comedy Central',
        seller: {
            name: 'Obi Uchendu',
            email: 'obi@naijacomedy.ng',
            id: 'seller-9'
        },
        amount: 2150000,
        paymentDate: 'Nov 10, 2025',
        paymentTime: '10:00 am',
        status: 'successful'
    }
]



export interface ResaleTicket {
    id: string
    ticketId: string
    reseller: {
        name: string
        email: string
        id: string
    }
    event: {
        id: string
        title: string
        image: string
        ticketType: string
    }
    listingPrice: number
    listingDate: string
    listingTime: string
    status: 'pending' | 'processing' | 'successful'
}

export interface ResoldTicket extends ResaleTicket {
    soldFor: number
    resaleDate: string
    resaleTime: string
}

export const mockListedForSale: ResaleTicket[] = [
    {
        id: '1',
        ticketId: 'PMT-2025-1234567',
        reseller: {
            name: 'Dominic Evans',
            email: 'domevans@gmail.com',
            id: 'user-1'
        },
        event: {
            id: '1',
            title: 'DevFest Lekki',
            image: '/images/demo-images/event-detail-img.png',
            ticketType: 'Standard'
        },
        listingPrice: 4500,
        listingDate: 'Jan 03, 2026',
        listingTime: '4:15 pm',
        status: 'pending'
    },
    {
        id: '2',
        ticketId: 'PMT-2025-1234567',
        reseller: {
            name: 'Chinedu Okafor',
            email: 'edubrazil042@gmail.com',
            id: 'user-2'
        },
        event: {
            id: '2',
            title: '5ive Tour Concert',
            image: '/images/demo-images/event-detail-img.png',
            ticketType: 'VIP'
        },
        listingPrice: 15000,
        listingDate: 'Feb 21, 2025',
        listingTime: '8:40 am',
        status: 'processing'
    },
    {
        id: '3',
        ticketId: 'PMT-2025-1234567',
        reseller: {
            name: 'Aisha Mohammed',
            email: 'Aishamohammed@yahoo.com',
            id: 'user-3'
        },
        event: {
            id: '3',
            title: 'Bole Fest 2025',
            image: '/images/demo-images/event-detail-img.png',
            ticketType: 'Regular'
        },
        listingPrice: 3500,
        listingDate: 'Mar 12, 2026',
        listingTime: '6:55 pm',
        status: 'pending'
    },
    {
        id: '4',
        ticketId: 'PMT-2025-1234567',
        reseller: {
            name: 'Temitope Adeyemi',
            email: 'temiyemi1234@outlook.com',
            id: 'user-4'
        },
        event: {
            id: '4',
            title: 'PS5 Gamers Clash',
            image: '/images/demo-images/event-detail-img.png',
            ticketType: 'Standard'
        },
        listingPrice: 7200,
        listingDate: 'Apr 29, 2025',
        listingTime: '11:20 am',
        status: 'pending'
    },
    {
        id: '5',
        ticketId: 'PMT-2025-1234567',
        reseller: {
            name: 'Ibrahim Danladi',
            email: 'ibrahim.danladi77@gmail.com',
            id: 'user-5'
        },
        event: {
            id: '5',
            title: 'Owerri Cultural Day',
            image: '/images/demo-images/event-detail-img.png',
            ticketType: 'VIP'
        },
        listingPrice: 5000,
        listingDate: 'Jun 07, 2026',
        listingTime: '2:10 pm',
        status: 'pending'
    }
]

export const mockResoldTickets: ResoldTicket[] = [
    {
        id: '1',
        ticketId: 'PMT-2025-1234567',
        reseller: {
            name: 'Dominic Evans',
            email: 'domevans@gmail.com',
            id: 'user-1'
        },
        event: {
            id: '1',
            title: 'DevFest Lekki',
            image: '/images/demo-images/event-detail-img.png',
            ticketType: 'Standard'
        },
        listingPrice: 4500,
        listingDate: 'Jan 03, 2026',
        listingTime: '4:15 pm',
        soldFor: 4500,
        resaleDate: 'Jan 03, 2026',
        resaleTime: '4:15 pm',
        status: 'successful'
    },
    {
        id: '2',
        ticketId: 'PMT-2025-1234567',
        reseller: {
            name: 'Chinedu Okafor',
            email: 'edubrazil042@gmail.com',
            id: 'user-2'
        },
        event: {
            id: '2',
            title: '5ive Tour Concert',
            image: '/images/demo-images/event-detail-img.png',
            ticketType: 'VIP'
        },
        listingPrice: 15000,
        listingDate: 'Feb 21, 2025',
        listingTime: '8:40 am',
        soldFor: 15000,
        resaleDate: 'Feb 21, 2025',
        resaleTime: '8:40 am',
        status: 'successful'
    },
    {
        id: '3',
        ticketId: 'PMT-2025-1234567',
        reseller: {
            name: 'Aisha Mohammed',
            email: 'Aishamohammed@yahoo.com',
            id: 'user-3'
        },
        event: {
            id: '3',
            title: 'Bole Fest 2025',
            image: '/images/demo-images/event-detail-img.png',
            ticketType: 'Regular'
        },
        listingPrice: 3500,
        listingDate: 'Mar 12, 2026',
        listingTime: '6:55 pm',
        soldFor: 3500,
        resaleDate: 'Mar 12, 2026',
        resaleTime: '6:55 pm',
        status: 'processing'
    },
    {
        id: '4',
        ticketId: 'PMT-2025-1234567',
        reseller: {
            name: 'Temitope Adeyemi',
            email: 'temiyemi1234@outlook.com',
            id: 'user-4'
        },
        event: {
            id: '4',
            title: 'PS5 Gamers Clash',
            image: '/images/demo-images/event-detail-img.png',
            ticketType: 'Standard'
        },
        listingPrice: 7200,
        listingDate: 'Apr 29, 2025',
        listingTime: '11:20 am',
        soldFor: 7200,
        resaleDate: 'Apr 29, 2025',
        resaleTime: '11:20 am',
        status: 'successful'
    },
    {
        id: '5',
        ticketId: 'PMT-2025-1234567',
        reseller: {
            name: 'Ibrahim Danladi',
            email: 'ibrahim.danladi77@gmail.com',
            id: 'user-5'
        },
        event: {
            id: '5',
            title: 'Owerri Cultural Day',
            image: '/images/demo-images/event-detail-img.png',
            ticketType: 'VIP'
        },
        listingPrice: 5000,
        listingDate: 'Jun 07, 2026',
        listingTime: '2:10 pm',
        soldFor: 5000,
        resaleDate: 'Jun 07, 2026',
        resaleTime: '2:10 pm',
        status: 'successful'
    }
]



export interface AuditLog {
    id: string
    timestamp: string
    timestampTime: string
    admin: {
        name: string
        email: string
        id: string
    }
    ipAddress: string
    action: string
    details: string
}

export const mockAuditLogs: AuditLog[] = [
    {
        id: '1',
        timestamp: 'Nov 14, 2025',
        timestampTime: '9:00 am',
        admin: {
            name: 'Samuel Nathaniel',
            email: 'sammynath@qavtix.com',
            id: 'admin-1'
        },
        ipAddress: '102.89.45.21',
        action: 'Paused Event',
        details: 'Street Groove Africa Event Ticket sales paused'
    },
    {
        id: '2',
        timestamp: 'Nov 14, 2025',
        timestampTime: '9:00 am',
        admin: {
            name: 'Valentine Emeka',
            email: 'val@qavtix.com',
            id: 'admin-2'
        },
        ipAddress: '197.210.55.80',
        action: 'Suspended Seller',
        details: 'Urban Laughs NG account suspended'
    },
    {
        id: '3',
        timestamp: 'Nov 14, 2025',
        timestampTime: '9:00 am',
        admin: {
            name: 'Janeth Ayoola',
            email: 'janeth@qavtix.com',
            id: 'admin-3'
        },
        ipAddress: '105.112.33.19',
        action: 'Approved Seller',
        details: 'FreshBite Festivals account approved'
    },
    {
        id: '4',
        timestamp: 'Nov 14, 2025',
        timestampTime: '9:00 am',
        admin: {
            name: 'Janeth Ayoola',
            email: 'janeth@qavtix.com',
            id: 'admin-3'
        },
        ipAddress: '105.112.33.19',
        action: 'Approved Seller',
        details: 'Owerri Cultural Fest account approved'
    },
    {
        id: '5',
        timestamp: 'Nov 14, 2025',
        timestampTime: '9:00 am',
        admin: {
            name: 'Tunde Martins',
            email: 'cityboy@qavtix.com',
            id: 'admin-4'
        },
        ipAddress: '192.168.0.14',
        action: 'Enabled Auto Payout',
        details: 'Auto payout activated for Prime Sports Africa'
    },
    {
        id: '6',
        timestamp: 'Nov 14, 2025',
        timestampTime: '9:00 am',
        admin: {
            name: 'Samuel Nathaniel',
            email: 'sammynath@qavtix.com',
            id: 'admin-1'
        },
        ipAddress: '102.89.45.21',
        action: 'Approved Payout',
        details: 'PR-000781 approved for Pulse Concerts'
    },
    {
        id: '7',
        timestamp: 'Nov 14, 2025',
        timestampTime: '9:00 am',
        admin: {
            name: 'Valentine Emeka',
            email: 'val@qavtix.com',
            id: 'admin-2'
        },
        ipAddress: '197.210.55.80',
        action: 'Gifted Badge',
        details: 'Free host verification badge gifted to ArtHouse Collective'
    },
    {
        id: '8',
        timestamp: 'Nov 13, 2025',
        timestampTime: '3:45 pm',
        admin: {
            name: 'Samuel Nathaniel',
            email: 'sammynath@qavtix.com',
            id: 'admin-1'
        },
        ipAddress: '102.89.45.21',
        action: 'Banned User',
        details: 'User account ID-4521 permanently banned for fraud'
    },
    {
        id: '9',
        timestamp: 'Nov 13, 2025',
        timestampTime: '2:30 pm',
        admin: {
            name: 'Janeth Ayoola',
            email: 'janeth@qavtix.com',
            id: 'admin-3'
        },
        ipAddress: '105.112.33.19',
        action: 'Forced Payout',
        details: 'Manual payout of ₦2,500,000 initiated for Vibe Nation Events'
    },
    {
        id: '10',
        timestamp: 'Nov 12, 2025',
        timestampTime: '11:15 am',
        admin: {
            name: 'Tunde Martins',
            email: 'cityboy@qavtix.com',
            id: 'admin-4'
        },
        ipAddress: '192.168.0.14',
        action: 'Approved Seller',
        details: 'Kingdom Sound Ministry account approved'
    }
]




export const ticketTiers: Partial<TicketTier>[] = [
  { id: '1', name: 'Regular', price: 5000, currency: '₦', description: "Regular access ticket admits one" },
  { id: '2', name: 'VIP', price: 25000, currency: '₦', description: "Regular access ticket admits one" },
  { id: '3', name: 'VVIP', price: 35000, currency: '₦', description: "Regular access ticket admits one" },
  { id: '4', name: 'Front Row', price: 50000, currency: '₦', description: "Regular access ticket admits one" },
  { id: '5', name: 'Early Bird', price: 3500, currency: '₦', description: "Regular access ticket admits one" },
  { id: '6', name: 'Student', price: 4000, currency: '₦', description: "Regular access ticket admits one" },
  { id: '7', name: 'Group', price: 4500, currency: '₦', description: "Regular access ticket admits one" },
  { id: '8', name: 'Platinum', price: 75000, currency: '₦', description: "Regular access ticket admits one" }
]




// Mock Mail Data
export const mockEmailCampaigns = [
    {
        id: 1,
        campaign: "Early Bird Tickets Announcement",
        event: {
            id: '8',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Concert',
            host: 'Afrobeat Live',
            title: 'Afrobeats Night Lagos',
            date: 'Dec 15, 2025',
            location: 'Eko Hotel & Suites, Victoria Island, Lagos',
            price: '₦20,000',
            href: '/events/8',
            attendees: []
        },
        recipients: 1550,
        sent_date: "2025-11-14T09:00:00",
        open_rate: 48,
        click_rate: 24,
        status: "successful"
    },
    {
        id: 2,
        campaign: "VIP Pass Promotion",
        event: {
            id: '8',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Concert',
            host: 'Afrobeat Live',
            title: 'Afrobeats Night Lagos',
            date: 'Dec 15, 2025',
            location: 'Eko Hotel & Suites, Victoria Island, Lagos',
            price: '₦20,000',
            href: '/events/8',
            attendees: []
        },
        recipients: 5850,
        sent_date: "2025-11-15T11:30:00",
        open_rate: null,
        click_rate: null,
        status: "failed"
    },
    {
        id: 3,
        campaign: "Flash Sale – 24 Hours Only",
        event: {
            id: '8',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Concert',
            host: 'Afrobeat Live',
            title: 'Afrobeats Night Lagos',
            date: 'Dec 15, 2025',
            location: 'Eko Hotel & Suites, Victoria Island, Lagos',
            price: '₦20,000',
            href: '/events/8',
            attendees: []
        },
        recipients: 3200,
        sent_date: "2025-11-17T15:00:00",
        open_rate: 37,
        click_rate: 16,
        status: "successful"
    },
    {
        id: 4,
        campaign: "Sold-Out Soon Alert",
        event: {
            id: '8',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Concert',
            host: 'Afrobeat Live',
            title: 'Afrobeats Night Lagos',
            date: 'Dec 15, 2025',
            location: 'Eko Hotel & Suites, Victoria Island, Lagos',
            price: '₦20,000',
            href: '/events/8',
            attendees: []
        },
        recipients: 934,
        sent_date: "2025-11-18T18:45:00",
        open_rate: 56,
        click_rate: 27,
        status: "successful"
    },
    {
        id: 5,
        campaign: "Holiday Festival Promo",
        event: {
            id: '8',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Concert',
            host: 'Afrobeat Live',
            title: 'Afrobeats Night Lagos',
            date: 'Dec 15, 2025',
            location: 'Eko Hotel & Suites, Victoria Island, Lagos',
            price: '₦20,000',
            href: '/events/8',
            attendees: []
        },
        recipients: 4100,
        sent_date: "2025-11-20T10:00:00",
        open_rate: 67,
        click_rate: 33,
        status: "successful"
    },
    {
        id: 6,
        campaign: "Last-Minute Ticket Deals",
        event: {
            id: '8',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Concert',
            host: 'Afrobeat Live',
            title: 'Afrobeats Night Lagos',
            date: 'Dec 15, 2025',
            location: 'Eko Hotel & Suites, Victoria Island, Lagos',
            price: '₦20,000',
            href: '/events/8',
            attendees: []
        },
        recipients: 2456,
        sent_date: "2025-11-22T14:15:00",
        open_rate: 81,
        click_rate: 39,
        status: "successful"
    },
    {
        id: 7,
        campaign: "Weekend Special Offer",
        event: {
            id: '8',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Concert',
            host: 'Afrobeat Live',
            title: 'Afrobeats Night Lagos',
            date: 'Dec 15, 2025',
            location: 'Eko Hotel & Suites, Victoria Island, Lagos',
            price: '₦20,000',
            href: '/events/8',
            attendees: []
        },
        recipients: 6200,
        sent_date: "2025-11-23T08:30:00",
        open_rate: 42,
        click_rate: 18,
        status: "successful"
    },
    {
        id: 8,
        campaign: "New Year Countdown Event",
        event: {
            id: '8',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Concert',
            host: 'Afrobeat Live',
            title: 'Afrobeats Night Lagos',
            date: 'Dec 15, 2025',
            location: 'Eko Hotel & Suites, Victoria Island, Lagos',
            price: '₦20,000',
            href: '/events/8',
            attendees: []
        },
        recipients: 8900,
        sent_date: "2025-11-25T16:00:00",
        open_rate: null,
        click_rate: null,
        status: "failed"
    }
]




export const mockPayments: Payment[] = [
    {
        id: '1',
        payment_id: 'PMT-2025-1234567',
        purchased_by: {
            id: '1',
            name: 'Dominic Evans',
            email: 'domevans@gmail.com',
            profileImg: '/images/demo-images/avatar.png',
            address: 'Doo & Shima, Elegushi Beach, Ikoyi, Lagos State',
            attended: 13,
            totalSpend: 105000,
            lastPurchaseDate: new Date('2026-01-03'),
            firstPurchaseDate: new Date('2025-11-14'),
            status: 'top-spender'
        },
        event: {
            id: 'EVT001',
            title: 'DevFest Lekki',
            category: 'Tech Summit',
            image: '/images/demo-images/event-detail-img.png'
        },
        purchase_date: '2026-01-03T16:15:00',
        quantity: 1,
        amount: 4500,
        status: 'successful'
    },
    {
        id: '2',
        payment_id: 'PMT-2025-1234567',
        purchased_by: {
            id: '2',
            name: 'Chinedu Okafor',
            email: 'edubrazil042@gmail.com',
            profileImg: '/images/demo-images/avatar.png',
            address: '1234 Victoria Island, Lagos',
            attended: 7,
            totalSpend: 78000,
            lastPurchaseDate: new Date('2025-02-21'),
            firstPurchaseDate: new Date('2025-11-14'),
            status: 'repeat-buyer'
        },
        event: {
            id: 'EVT002',
            title: '5ive Tour Concert',
            category: 'Music Festival',
            image: '/images/demo-images/event-detail-img.png'
        },
        purchase_date: '2025-02-21T08:40:00',
        quantity: 3,
        amount: 15000,
        status: 'successful'
    },
    {
        id: '3',
        payment_id: 'PMT-2025-1234567',
        purchased_by: {
            id: '3',
            name: 'Aisha Mohammed',
            email: 'Aishamona22@yahoo.com',
            profileImg: '/images/demo-images/avatar.png',
            address: '18 Admiralty Way, Lekki Phase 1, Lagos',
            attended: 1,
            totalSpend: 10200,
            lastPurchaseDate: new Date('2026-03-12'),
            firstPurchaseDate: new Date('2025-11-14'),
            status: 'first-timer'
        },
        event: {
            id: 'EVT003',
            title: 'Bole Fest 2025',
            category: 'Food Festival',
            image: '/images/demo-images/event-detail-img.png'
        },
        purchase_date: '2026-03-12T18:55:00',
        quantity: 2,
        amount: 3500,
        status: 'cancelled'
    },
    {
        id: '4',
        payment_id: 'PMT-2025-1234567',
        purchased_by: {
            id: '4',
            name: 'Temitope Adeyemi',
            email: 'temiyemi10@outlook.com',
            profileImg: '/images/demo-images/avatar.png',
            address: '4 Boudillion Road, Ikoyi, Lagos',
            attended: 3,
            totalSpend: 15000,
            lastPurchaseDate: new Date('2025-04-29'),
            firstPurchaseDate: new Date('2025-11-14'),
            status: 'repeat-buyer'
        },
        event: {
            id: 'EVT004',
            title: 'PS5 Gamers Clash',
            category: 'Sports Event',
            image: '/images/demo-images/event-detail-img.png'
        },
        purchase_date: '2025-04-29T11:20:00',
        quantity: 1,
        amount: 2200,
        status: 'successful'
    },
    {
        id: '5',
        payment_id: 'PMT-2025-1234567',
        purchased_by: {
            id: '5',
            name: 'Ibrahim Danladi',
            email: 'ibrahimladi77@gmail.com',
            profileImg: '/images/demo-images/avatar.png',
            address: 'Plot 54 Alausa Extension, Allen Avenue, Ikeja',
            attended: 3,
            totalSpend: 21350,
            lastPurchaseDate: new Date('2026-07-07'),
            firstPurchaseDate: new Date('2025-11-14'),
            status: 'repeat-buyer'
        },
        event: {
            id: 'EVT005',
            title: 'Owerri Cultural Day',
            category: 'Cultural Event',
            image: '/images/demo-images/event-detail-img.png'
        },
        purchase_date: '2026-07-07T14:10:00',
        quantity: 1,
        amount: 5000,
        status: 'successful'
    },
    {
        id: '6',
        payment_id: 'PMT-2025-1234568',
        purchased_by: {
            id: '6',
            name: 'Samuel Oladimeji',
            email: 'sam.oladimeji25@gmail.com',
            profileImg: '/images/demo-images/avatar.png',
            address: 'Doo & Shima, Elegushi Beach, Ikoyi',
            attended: 8,
            totalSpend: 85000,
            lastPurchaseDate: new Date('2025-06-15'),
            firstPurchaseDate: new Date('2025-11-14'),
            status: 'top-spender'
        },
        event: {
            id: 'EVT006',
            title: 'Kiddies Funfair Fest',
            category: 'Kids Event',
            image: '/images/demo-images/event-detail-img.png'
        },
        purchase_date: '2025-06-15T10:30:00',
        quantity: 4,
        amount: 20000,
        status: 'successful'
    },
    {
        id: '7',
        payment_id: 'PMT-2025-1234569',
        purchased_by: {
            id: '1',
            name: 'Dominic Evans',
            email: 'domevans@gmail.com',
            profileImg: '/images/demo-images/avatar.png',
            address: 'Doo & Shima, Elegushi Beach, Ikoyi',
            attended: 13,
            totalSpend: 105000,
            lastPurchaseDate: new Date('2025-08-20'),
            firstPurchaseDate: new Date('2025-11-14'),
            status: 'top-spender'
        },
        event: {
            id: 'EVT007',
            title: 'Lagos Tech Conference',
            category: 'Conference',
            image: '/images/demo-images/event-detail-img.png'
        },
        purchase_date: '2025-08-20T09:00:00',
        quantity: 2,
        amount: 18000,
        status: 'successful'
    },
    {
        id: '8',
        payment_id: 'PMT-2025-1234570',
        purchased_by: {
            id: '3',
            name: 'Aisha Mohammed',
            email: 'Aishamona22@yahoo.com',
            profileImg: '/images/demo-images/avatar.png',
            address: '18 Admiralty Way, Lekki Phase 1, Lagos',
            attended: 1,
            totalSpend: 10200,
            lastPurchaseDate: new Date('2025-09-10'),
            firstPurchaseDate: new Date('2025-11-14'),
            status: 'first-timer'
        },
        event: {
            id: 'EVT008',
            title: 'Afrobeat Night Live',
            category: 'Music Concert',
            image: '/images/demo-images/event-detail-img.png'
        },
        purchase_date: '2025-09-10T19:45:00',
        quantity: 1,
        amount: 8500,
        status: 'cancelled'
    }
]

// TypeScript Interface
export interface Payment {
    id: string
    payment_id: string
    purchased_by: {
        id: string
        name: string
        email: string
        profileImg?: string
        address: string
        attended: number
        totalSpend: number
        lastPurchaseDate: Date
        firstPurchaseDate: Date
        status: string
    }
    event: {
        id: string
        title: string
        category: string
        image: string
    }
    purchase_date: string
    quantity: number
    amount: number
    status: 'successful' | 'cancelled' | 'pending'
}




export const MOCK_DASHBOARD_DATA = {
    // Current Values (Direct from your screenshots)
    platform_revenue: 1234500,
    total_users: 1345,
    transactions_today: 13,
    active_events: 23,
    pending_payouts: 3,
    system_health: 99.98,
    active_sessions: 1248,

    // Trend History Data (Used to draw the Sparkline waves)
    // Arrays representing data points over time
    platform_revenue_history: [40, 35, 50, 45, 60, 55, 70],
    total_users_history: [20, 40, 30, 50, 40, 60, 80],
    transactions_today_history: [60, 70, 50, 80, 40, 30, 20], // Downward trend
    active_events_history: [50, 40, 60, 30, 50, 40, 35],      // Downward trend
    pending_payouts_history: [30, 35, 40, 38, 45, 50, 60],
    system_health_history: [99, 99.5, 99.2, 99.8, 99.7, 99.9, 99.98],
}



export const mockUsers = [
    {
        id: '1',
        name: 'Dominic Evans',
        email: 'danevansyg@gmail.com',
        profileImg: '/images/demo-images/avatar.png',
        address: 'Doo & Shima, Elegushi Beach, Ikoyi, Lagos State',
        attended: 13,
        totalSpend: 105000,
        lastPurchaseDate: new Date('Nov 14, 2025'),
        firstPurchaseDate: new Date('Nov 14, 2025'),
        status: 'banned'
    },
    {
        id: '2',
        name: 'Chinedu Okafor',
        email: 'okaforafc42@gmail.com',
        address: '1234 Victoria Island, Opposite Figma Head Office, Lagos, Nigeria',
        attended: 7,
        totalSpend: 78000,
        lastPurchaseDate: new Date('Nov 14, 2025'),
        firstPurchaseDate: new Date('Nov 14, 2025'),
        status: 'banned'
    },
    {
        id: '3',
        name: 'Aisha Mohammed',
        email: 'Aishama422@yahoo.com',
        address: '18 Admiralty Way, Lekki Phase 1, Lagos',
        attended: 1,
        totalSpend: 10200,
        lastPurchaseDate: new Date('Nov 14, 2025'),
        firstPurchaseDate: new Date('Nov 14, 2025'),
        status: 'active'
    },
    {
        id: '4',
        name: 'Temitope Adeyemi',
        email: 'temiyemi10@outlook.com',
        address: '4 Boudillion Road, Ikoyi, Lagos',
        attended: 3,
        totalSpend: 15000,
        lastPurchaseDate: new Date('Nov 14, 2025'),
        firstPurchaseDate: new Date('Nov 14, 2025'),
        status: 'active'
    },
    {
        id: '5',
        name: 'Ibrahim Danladi',
        email: 'ibrahimdanl77@gmail.com',
        address: 'Plot 54 Alausa Extension, Allen Avenue, Ikeja, Lagos',
        attended: 3,
        totalSpend: 21350,
        lastPurchaseDate: new Date('Nov 14, 2025'),
        firstPurchaseDate: new Date('Nov 14, 2025'),
        status: 'flagged'
    },
    {
        id: '6',
        name: 'Samuel Oladimeji',
        email: 'sam.oladimeji25@gmail.com',
        address: 'Doo & Shima, Elegushi Beach, Ikoyi, Lagos State',
        attended: 8,
        totalSpend: 85000,
        lastPurchaseDate: new Date('Nov 14, 2025'),
        firstPurchaseDate: new Date('Nov 14, 2025'),
        status: 'limited'
    },
    {
        id: '7',
        name: 'Blessing Udoh',
        email: 'blessing.u@gmail.com',
        address: '22 Gbagada Expressway, Lagos',
        attended: 0,
        totalSpend: 0,
        lastPurchaseDate: new Date('Jan 05, 2026'),
        firstPurchaseDate: new Date('Jan 05, 2026'),
        status: 'suspended'
    }
]


export const mockHostBusinesses = [
    {
        id: '1',
        businessName: 'Pulse Concerts',
        owner: { name: 'Shola Martins', email: 'shola@pulseconcerts.com', image: '' },
        events: 13,
        revenue: 6120000,
        rating: 4.6,
        status: 'active'
    },
    {
        id: '2',
        businessName: 'Vibe Nation Events',
        owner: { name: 'Tunde Adebayo', email: 'bayo@vibeevents.com', image: '' },
        events: 12,
        revenue: 4250000,
        rating: 4.5,
        status: 'active'
    },
    {
        id: '3',
        businessName: 'Prime Sports Africa',
        owner: { name: 'Femi Adekunle', email: 'femikay@primesports.com', image: '' },
        events: 10,
        revenue: 3890000,
        rating: 4.4,
        status: 'suspended'
    }
];



export const mockCustomerOrders = [
    {
        event: {
            id: '1',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Music Festival',
            host: 'Live Nation',
            title: 'Sive Tour Concert',
            date: 'Nov 15, 2025',
            location: 'Doo & Shima, Elegushi Beach, Ikoyi, Lagos State',
            price: '₦15,000',
            href: '/events/1',
            attendees: []
        },
        order_id: 'ORD-2024-001',
        quantity: 2,
        amount: 30000,
        status: 'successful',
        purchase_date: 'November 14, 2025'
    },
    {
        event: {
            id: '2',
            image: '/images/demo-images/event-detail-img.png',
            status: 'starts-soon',
            category: 'Tech Summit',
            host: 'Tech Hub',
            title: 'DevFest Lekki',
            date: 'Nov 14, 2025',
            location: '1234 Victoria Island, Opposite Figma Head Office, Lagos, Nigeria',
            price: '₦5,000',
            href: '/events/2',
            attendees: []
        },
        order_id: 'ORD-2024-002',
        quantity: 1,
        amount: 5000,
        status: 'successful',
        purchase_date: 'November 10, 2025'
    },
    {
        event: {
            id: '3',
            image: '/images/demo-images/event-detail-img.png',
            status: 'low-sales',
            category: 'Food Festival',
            host: 'Food Lovers',
            title: 'Bole Fest 2025',
            date: 'Nov 17, 2025',
            location: "567 O'Brien Crescent, off Airport Road, Umuahia",
            price: '₦3,000',
            href: '/events/3',
            attendees: []
        },
        order_id: 'ORD-2024-003',
        quantity: 4,
        amount: 12000,
        status: 'cancelled',
        purchase_date: 'November 12, 2025'
    },
    {
        event: {
            id: '4',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Cultural Event',
            host: 'Heritage Foundation',
            title: 'Owerri Cultural Day',
            date: 'Nov 19, 2025',
            location: 'Hero Square, New Owerri, Imo State',
            price: '₦1,000',
            href: '/events/4',
            attendees: []
        },
        order_id: 'ORD-2024-004',
        quantity: 3,
        amount: 3000,
        status: 'successful',
        purchase_date: 'November 08, 2025'
    },
    {
        event: {
            id: '5',
            image: '/images/demo-images/event-detail-img.png',
            status: 'starts-soon',
            category: 'Sports Event',
            host: 'Gaming Hub',
            title: 'PS5 Gamers Clash',
            date: 'Nov 18, 2025',
            location: "567 O'Brien Crescent, off Airport Road, Umuahia",
            price: '₦2,500',
            href: '/events/5',
            attendees: []
        },
        order_id: 'ORD-2024-005',
        quantity: 2,
        amount: 5000,
        status: 'cancelled',
        purchase_date: 'November 05, 2025'
    },
    {
        event: {
            id: '6',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Kids Event',
            host: 'Fun Zone',
            title: 'Kiddies Funfair Fest',
            date: 'Nov 20, 2025',
            location: 'Dreamworld Africana, KM 20 Lekki-Ajah Expressway, Lagos',
            price: '₦5,000',
            href: '/events/6',
            attendees: []
        },
        order_id: 'ORD-2024-006',
        quantity: 5,
        amount: 25000,
        status: 'successful',
        purchase_date: 'December 11, 2024'
    },
    {
        event: {
            id: '7',
            image: '/images/demo-images/event-detail-img.png',
            status: 'low-sales',
            category: 'Business Event',
            host: 'Startup Lagos',
            title: 'Tech Startup Summit',
            date: 'Dec 05, 2025',
            location: 'Zone Tech Park, Gbagada, Lagos',
            price: '₦10,000',
            href: '/events/7',
            attendees: []
        },
        order_id: 'ORD-2024-007',
        quantity: 1,
        amount: 10000,
        status: 'cancelled',
        purchase_date: 'October 28, 2025'
    },
    {
        event: {
            id: '8',
            image: '/images/demo-images/event-detail-img.png',
            status: 'selling-fast',
            category: 'Concert',
            host: 'Afrobeat Live',
            title: 'Afrobeats Night Lagos',
            date: 'Dec 15, 2025',
            location: 'Eko Hotel & Suites, Victoria Island, Lagos',
            price: '₦20,000',
            href: '/events/8',
            attendees: []
        },
        order_id: 'ORD-2024-008',
        quantity: 2,
        amount: 40000,
        status: 'successful',
        purchase_date: 'November 01, 2025'
    }
]



export const mockSignupRequest = [
    {
        id: '1',
        businessName: 'Pulse Concerts',
        owner: { name: 'Shola Martins', email: 'shola@pulseconcerts.com', image: '/avatars/shola.png' },
        signupDate: '2025-11-14T09:14:00',
        accountType: 'Individual',
        status: 'Pending'
    },
    {
        id: '2',
        businessName: 'Vibe Nation Events',
        owner: { name: 'Tunde Adebayo', email: 'bayo@vibeevents.com', image: '/avatars/tunde.png' },
        signupDate: '2025-11-14T09:14:00',
        accountType: 'Business',
        status: 'Pending'
    },
]