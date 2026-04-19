export type EventsListingMetrics = 
    | 'live'
    | 'suspended'
    | 'ended'
    | 'sold-out';



export const eventsListingAnalyticsMetricsConfig: Record<EventsListingMetrics, MetricCardData1> = {
    'live': {
        id: 'live',
        value: '4',
        label: 'Live Events',
        description: 'Events currently listed',
        icon: "hugeicons:calendar-03",
        iconColor: 'text-[#359160]',
    },
    'suspended': {
        id: 'suspended',
        value: '1',
        label: 'Suspended',
        description: 'Events paused by you',
        icon: "hugeicons:task-edit-02",
        iconColor: 'text-[#FF9249]',
    },
    'ended': {
        id: 'ended',
        value: '17',
        label: 'Ended',
        description: 'Events already concluded',
        icon: "fluent-mdl2:end-point-solid",
        iconColor: 'text-[#EF4444]',
    },
    'sold-out': {
        id: 'sold-out',
        value: '11',
        label: 'Sold Out',
        description: 'Events fully booked',
        icon: "hugeicons:wallet-done-01",
        iconColor: 'text-[#5E92DF]',
    },
}