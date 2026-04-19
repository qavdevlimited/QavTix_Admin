export type SystemStatusKey = 'OPERATIONAL' | 'DEGRADED' | 'INCIDENT';

interface StatusConfig {
    label: string;
    color: string;
}

export const SYSTEM_STATUS_CONFIG: Record<SystemStatusKey, StatusConfig> = {
    OPERATIONAL: {
        label: "Operational",
        color: "#33CC33",
    },
    DEGRADED: {
        label: "Degraded",
        color: "#FFAE00",
    },
    INCIDENT: {
        label: "Incident",
        color: "#FF0000",
    },
} as const;