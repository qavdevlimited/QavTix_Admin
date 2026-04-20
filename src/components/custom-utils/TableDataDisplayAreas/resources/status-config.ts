export const eventPerformanceConfig: Record<any, { label: string; color: string }> = {
    'fully_booked': { label: 'Fully Booked', color: 'text-gray-500' },
    'almost_full': { label: 'Almost Full', color: 'text-green-600' },
    'moderate_sales': { label: 'Moderate Sales', color: 'text-orange-600' },
    'low_sales': { label: 'Low Sales', color: 'text-red-600' },
    'no_sales': { label: 'No Sales', color: 'text-red-800' },
}


export const orderStatusConfig: Record<string, { text: string; bg: string }> = {
    completed: { text: "text-emerald-700", bg: "bg-emerald-50" },
    successful: { text: "text-emerald-700", bg: "bg-emerald-50" },
    pending: { text: "text-amber-600", bg: "bg-amber-50" },
    refunded: { text: "text-brand-primary-4", bg: "bg-brand-primary-1" },
    failed: { text: "text-red-600", bg: "bg-red-50" },
    cancelled: { text: "text-brand-secondary-4", bg: "bg-brand-secondary-1" },
}

export const payoutStatusConfig: Record<string, { label: string; color: string }> = {
    approved: { label: "Approved", color: "text-green-600 bg-green-50" },
    pending: { label: "Pending", color: "text-amber-600 bg-amber-50" },
    rejected: { label: "Rejected", color: "text-red-600 bg-red-50" },
    failed: { label: "Failed", color: "text-red-600 bg-red-50" },
}



export type UserStatus = 'active' | 'suspended' | 'banned' | 'flagged'

export const usersTableStatusConfig: Record<UserStatus, { label: string; color: string; dot: string }> = {
    active: { label: 'Active', color: 'text-green-600', dot: 'bg-green-500' },
    suspended: { label: 'Suspended', color: 'text-amber-600', dot: 'bg-amber-400' },
    banned: { label: 'Banned', color: 'text-red-600', dot: 'bg-red-500' },
    flagged: { label: 'Flagged', color: 'text-orange-600', dot: 'bg-orange-500' },
}

export const withdrawalStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-50' },
    pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50' },
    failed: { label: 'Failed', color: 'text-red-700', bg: 'bg-red-50' },
}