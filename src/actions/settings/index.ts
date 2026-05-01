import {
    ADMIN_CONFIG_FEES_ENDPOINT,
    ADMIN_CONFIG_FRAUD_ENDPOINT,
    ADMIN_CONFIG_GENERAL_ENDPOINT,
    ADMIN_CONFIG_LOCALIZATION_ENDPOINT,
    ADMIN_CONFIG_NOTIFICATIONS_ENDPOINT,
    ADMIN_CONFIG_POLICIES_ENDPOINT,
} from '@/endpoints'
import { CACHE_TAGS } from '@/cache-tags'
import { unstable_cacheTag as cacheTag } from 'next/cache'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GeneralSettingsData {
    platform_support_email: string
    default_currency: { code: string; label: string }
    default_timezone: string
}

export interface FeesSettingsData {
    ticket_resell_commission: number
    seller_service_fee: number
    buyer_service_fee: number
    vat_percentage?: number
    vat_enabled: boolean
    prices_include_vat: boolean
}

export interface FraudSettingsData {
    fraud_sensitivity: 'low' | 'medium' | 'high'
}

export interface PoliciesSettingsData {
    seller_verification_required: boolean
    auto_approve_listing: boolean
}

export interface NotificationSettingsData {
    email_notifications: {
        admin_alerts: boolean
        fraud_alerts: boolean
        high_volume_sales: boolean
        failed_payouts: boolean
    }
    sms_notifications: {
        admin_alerts: boolean
        fraud_alerts: boolean
        high_volume_sales: boolean
        failed_payouts: boolean
    }
}

export interface LocalizationSettingsData {
    supported_countries: string[]
    supported_currencies: string[]
    language: string
    date_time_format: string
}

export interface AllSettingsData {
    general: GeneralSettingsData
    policies: PoliciesSettingsData
    fees: FeesSettingsData
    fraud: FraudSettingsData
    notifications: NotificationSettingsData
    localization: LocalizationSettingsData
}

export type FetchResult<T> = { success: true; data: T } | { success: false; message: string }
export type MutateResult = { success: boolean; message?: string }
export type ResetResult = { success: true; data: AllSettingsData } | { success: false; message: string }

// ─── Internal helper: cached fetch using 'use cache' + token arg ──────────────

async function cachedGet<T>(
    token: string | undefined,
    endpoint: string,
    tag: string,
): Promise<FetchResult<T>> {
    'use cache'
    cacheTag(tag)
    cacheTag(CACHE_TAGS.SETTINGS_ALL)
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
        if (!res.ok) {
            const json = await res.json().catch(() => ({}))
            return { success: false, message: json?.message ?? 'Failed to load settings.' }
        }
        const json = await res.json()
        return { success: true, data: json.data as T }
    } catch (err: any) {
        return { success: false, message: err?.message ?? 'Failed to load settings.' }
    }
}

// ─── GET functions — token passed as arg, 'use cache' inside cachedGet ─────────

export async function getGeneralSettings(token: string | undefined): Promise<FetchResult<GeneralSettingsData>> {
    return cachedGet<GeneralSettingsData>(token, ADMIN_CONFIG_GENERAL_ENDPOINT, CACHE_TAGS.SETTINGS_GENERAL)
}

export async function getPoliciesSettings(token: string | undefined): Promise<FetchResult<PoliciesSettingsData>> {
    return cachedGet<PoliciesSettingsData>(token, ADMIN_CONFIG_POLICIES_ENDPOINT, CACHE_TAGS.SETTINGS_POLICIES)
}

export async function getFeesSettings(token: string | undefined): Promise<FetchResult<FeesSettingsData>> {
    return cachedGet<FeesSettingsData>(token, ADMIN_CONFIG_FEES_ENDPOINT, CACHE_TAGS.SETTINGS_FEES)
}

export async function getFraudSettings(token: string | undefined): Promise<FetchResult<FraudSettingsData>> {
    return cachedGet<FraudSettingsData>(token, ADMIN_CONFIG_FRAUD_ENDPOINT, CACHE_TAGS.SETTINGS_FRAUD)
}

export async function getNotificationSettings(token: string | undefined): Promise<FetchResult<NotificationSettingsData>> {
    return cachedGet<NotificationSettingsData>(token, ADMIN_CONFIG_NOTIFICATIONS_ENDPOINT, CACHE_TAGS.SETTINGS_NOTIFICATIONS)
}

export async function getLocalizationSettings(token: string | undefined): Promise<FetchResult<LocalizationSettingsData>> {
    return cachedGet<LocalizationSettingsData>(token, ADMIN_CONFIG_LOCALIZATION_ENDPOINT, CACHE_TAGS.SETTINGS_LOCALIZATION)
}
