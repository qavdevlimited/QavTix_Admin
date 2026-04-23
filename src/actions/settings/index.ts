'use server'

import {
    ADMIN_CONFIG_FEES_ENDPOINT,
    ADMIN_CONFIG_FRAUD_ENDPOINT,
    ADMIN_CONFIG_GENERAL_ENDPOINT,
    ADMIN_CONFIG_LOCALIZATION_ENDPOINT,
    ADMIN_CONFIG_NOTIFICATIONS_ENDPOINT,
    ADMIN_CONFIG_POLICIES_ENDPOINT,
    ADMIN_CONFIG_RESET_ENDPOINT,
} from '@/endpoints'
import { getServerAxios } from '@/lib/axios'
import { CACHE_TAGS } from '@/cache-tags'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

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

/** Shape returned by the reset-all endpoint */
export interface AllSettingsData {
    general: GeneralSettingsData
    policies: PoliciesSettingsData
    fees: FeesSettingsData
    fraud: FraudSettingsData
    notifications: NotificationSettingsData
    localization: LocalizationSettingsData
}

// ─── Result Types ─────────────────────────────────────────────────────────────

type FetchResult<T> = { success: true; data: T } | { success: false; message: string }
type MutateResult = { success: boolean; message?: string }
type ResetResult = { success: true; data: AllSettingsData } | { success: false; message: string }

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getAuthToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get('admin_access_token')?.value
}

// ─── Cached GET via native fetch + next: { tags } ─────────────────────────────
// Uses native fetch so Next.js data cache handles deduplication & tag-based
// revalidation. Avoids passing cookies() into unstable_cache (which is unsafe).

async function cachedGet<T>(endpoint: string, tag: string): Promise<FetchResult<T>> {
    try {
        const token = await getAuthToken()
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [tag, CACHE_TAGS.SETTINGS_ALL], revalidate: 3600 },
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

// ─── Cached GELT functions ──────────────────────────────────────────────────────

export async function getGeneralSettings(): Promise<FetchResult<GeneralSettingsData>> {
    return cachedGet<GeneralSettingsData>(ADMIN_CONFIG_GENERAL_ENDPOINT, CACHE_TAGS.SETTINGS_GENERAL)
}

export async function getPoliciesSettings(): Promise<FetchResult<PoliciesSettingsData>> {
    return cachedGet<PoliciesSettingsData>(ADMIN_CONFIG_POLICIES_ENDPOINT, CACHE_TAGS.SETTINGS_POLICIES)
}

export async function getFeesSettings(): Promise<FetchResult<FeesSettingsData>> {
    return cachedGet<FeesSettingsData>(ADMIN_CONFIG_FEES_ENDPOINT, CACHE_TAGS.SETTINGS_FEES)
}

export async function getFraudSettings(): Promise<FetchResult<FraudSettingsData>> {
    return cachedGet<FraudSettingsData>(ADMIN_CONFIG_FRAUD_ENDPOINT, CACHE_TAGS.SETTINGS_FRAUD)
}

export async function getNotificationSettings(): Promise<FetchResult<NotificationSettingsData>> {
    return cachedGet<NotificationSettingsData>(ADMIN_CONFIG_NOTIFICATIONS_ENDPOINT, CACHE_TAGS.SETTINGS_NOTIFICATIONS)
}

export async function getLocalizationSettings(): Promise<FetchResult<LocalizationSettingsData>> {
    return cachedGet<LocalizationSettingsData>(ADMIN_CONFIG_LOCALIZATION_ENDPOINT, CACHE_TAGS.SETTINGS_LOCALIZATION)
}


async function patchSetting(endpoint: string, payload: object): Promise<MutateResult> {
    try {
        const axios = await getServerAxios()
        await axios.patch(endpoint, payload)
        return { success: true }
    } catch (err: any) {
        return { success: false, message: err?.response?.data?.message ?? 'Failed to save settings.' }
    }
}

export async function updateGeneralSettings(data: Partial<GeneralSettingsData>): Promise<MutateResult> {
    const result = await patchSetting(ADMIN_CONFIG_GENERAL_ENDPOINT, data)
    if (result.success) revalidateTag(CACHE_TAGS.SETTINGS_GENERAL, 'max')
    return result
}

export async function updatePoliciesSettings(data: Partial<PoliciesSettingsData>): Promise<MutateResult> {
    const result = await patchSetting(ADMIN_CONFIG_POLICIES_ENDPOINT, data)
    if (result.success) revalidateTag(CACHE_TAGS.SETTINGS_POLICIES, 'max')
    return result
}

export async function updateFeesSettings(data: Partial<FeesSettingsData>): Promise<MutateResult> {
    const result = await patchSetting(ADMIN_CONFIG_FEES_ENDPOINT, data)
    if (result.success) revalidateTag(CACHE_TAGS.SETTINGS_FEES, 'max')
    return result
}

export async function updateFraudSettings(data: Partial<FraudSettingsData>): Promise<MutateResult> {
    const result = await patchSetting(ADMIN_CONFIG_FRAUD_ENDPOINT, data)
    if (result.success) revalidateTag(CACHE_TAGS.SETTINGS_FRAUD, 'max')
    return result
}

export async function updateNotificationSettings(data: Partial<NotificationSettingsData>): Promise<MutateResult> {
    const result = await patchSetting(ADMIN_CONFIG_NOTIFICATIONS_ENDPOINT, data)
    if (result.success) revalidateTag(CACHE_TAGS.SETTINGS_NOTIFICATIONS, 'max')
    return result
}

export async function updateLocalizationSettings(data: Partial<LocalizationSettingsData>): Promise<MutateResult> {
    const result = await patchSetting(ADMIN_CONFIG_LOCALIZATION_ENDPOINT, data)
    if (result.success) revalidateTag(CACHE_TAGS.SETTINGS_LOCALIZATION, 'max')
    return result
}

/**
 * Resets all system settings to factory defaults.
 * Returns the full data snapshot so each settings page can immediately
 * reset its form to the values the server restored.
 * Also busts the entire settings cache via SETTINGS_ALL tag.
 */
export async function ResetAllSettings(): Promise<ResetResult> {
    try {
        const axios = await getServerAxios()
        const res = await axios.post(ADMIN_CONFIG_RESET_ENDPOINT)
        // Bust the entire settings cache — all GET functions will re-fetch next call
        revalidateTag(CACHE_TAGS.SETTINGS_ALL, 'max')
        return { success: true, data: res.data.data as AllSettingsData }
    } catch (err: any) {
        return { success: false, message: err?.response?.data?.message ?? 'Failed to reset settings.' }
    }
}
