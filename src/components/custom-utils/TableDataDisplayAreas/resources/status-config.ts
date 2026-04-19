export const eventPerformanceConfig: Record<EventPerformance, { label: string; color: string }> = {
    'fully_booked':  { label: 'Fully Booked',  color: 'text-gray-500'   },
    'almost_full':   { label: 'Almost Full',   color: 'text-green-600'  },
    'moderate_sales':{ label: 'Moderate Sales',color: 'text-orange-600' },
    'low_sales':     { label: 'Low Sales',     color: 'text-red-600'    },
    'no_sales':      { label: 'No Sales',      color: 'text-red-800'    },
}

export const customerListStatusConfig = {
    'top_spender': { label: 'Top Spender', color: 'text-orange-600' },
    'repeat_buyer': { label: 'Repeat Buyer', color: 'text-brand-primary-4' },
    'first_timer': { label: 'First Timer', color: 'text-green-600' },
    'new_customer': { label: 'First Timer', color: 'text-green-600' }
}


export const payoutStatusConfig: Record<string, { label: string; color: string }> = {
    approved: { label: "Approved", color: "text-green-600 bg-green-50"   },
    pending:  { label: "Pending",  color: "text-amber-600 bg-amber-50"   },
    rejected: { label: "Rejected", color: "text-red-600 bg-red-50"       },
    failed:   { label: "Failed",   color: "text-red-600 bg-red-50"       },
}

export const attendeeCheckInStatusConfig = {
    'checked-in': { color: 'text-green-600' },
    'pending': { color: 'text-orange-600' },
    'failed': { color: 'text-red-600' }
}

export const myEventsStatusConfig = {
    'live': { color: 'text-green-600', label: 'Live' },
    'ended': { color: 'text-red-600', label: 'Ended' },
    'draft': { color: 'text-orange-600', label: 'Draft' },
    'cancelled': { color: 'bg-neutral-600', label: 'Cancelled' }
}

export const draftStatusConfig = {
    'unavailable': { color: 'text-red-600', label: 'Unavailable', icon: 'mdi:circle' },
    'scheduled': { color: 'text-blue-600', label: 'Scheduled', icon: 'mdi:circle' },
    'unpublished': { color: 'text-orange-600', label: 'Unpublished', icon: 'mdi:circle' }
}

export const liveEventsStatusConfig = {
    'low-sales': { label: 'Low Sales', color: 'text-red-600' },
    'selling-fast': { label: 'Selling Fast', color: 'text-green-600' },
    'starts-soon': { label: 'Starts Soon', color: 'text-orange-600' },
    'sold-out': { label: 'Sold Out', color: 'text-gray-600' }
}

export type UserStatus = 'active' | 'suspended' | 'banned' | 'flagged'

export const usersTableStatusConfig: Record<UserStatus, { label: string; color: string; dot: string }> = {
    active:    { label: 'Active',    color: 'text-green-600',  dot: 'bg-green-500'  },
    suspended: { label: 'Suspended', color: 'text-amber-600',  dot: 'bg-amber-400'  },
    banned:    { label: 'Banned',    color: 'text-red-600',    dot: 'bg-red-500'    },
    flagged:   { label: 'Flagged',   color: 'text-orange-600', dot: 'bg-orange-500' },
}

export const withdrawalStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: 'Completed', color: 'text-green-700',  bg: 'bg-green-50'  },
    pending:   { label: 'Pending',   color: 'text-amber-700',  bg: 'bg-amber-50'  },
    failed:    { label: 'Failed',    color: 'text-red-700',    bg: 'bg-red-50'    },
}