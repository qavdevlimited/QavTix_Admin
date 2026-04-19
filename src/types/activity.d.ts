type ActivityType = 
  | 'new_sale' 
  | 'check_in' 
  | 'low_stock' 
  | 'payout'
  | 'reminder'

type NotificationStatus = 'unread' | 'read'

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  subtitle?: string
  timestamp: string
  eventName?: string
  eventId?: string
}

interface NotificationItem {
  id: string
  type: ActivityType
  title: string
  subtitle?: string
  timestamp: string
  status: NotificationStatus
}
