'use server'

import {
    ADMIN_CONFIG_FEES_ENDPOINT,
    ADMIN_CONFIG_FRAUD_ENDPOINT,
    ADMIN_CONFIG_GENERAL_ENDPOINT,
    ADMIN_CONFIG_LOCALIZATION_ENDPOINT,
    ADMIN_CONFIG_NOTIFICATIONS_ENDPOINT,
} from '@/endpoints'
import { getServerAxios } from '@/lib/axios'

// ─── Types (mirror API payloads exactly) ─────────────────────────────────────

export interface GeneralSettingsData {
    platform_support_email: string
    default_currency: { code: string; label: string }
    default_timezone: string
}

export interface FeesSettingsData {
    ticket_resell_commission: number
    seller_service_fee: number
    buyer_service_fee: number
    vat_enabled: boolean
    prices_include_vat: boolean
}

export interface FraudSettingsData {
    fraud_sensitivity: 'low' | 'medium' | 'high'
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

type FetchResult<T> = { success: true; data: T } | { success: false; message: string }
type MutateResult = { success: boolean; message?: string }

async function fetchSetting<T>(endpoint: string): Promise<FetchResult<T>> {
    try {
        const axios = await getServerAxios()
        const res = await axios.get(endpoint)
        return { success: true, data: res.data.data as T }
    } catch (err: any) {
        return { success: false, message: err?.response?.data?.message ?? 'Failed to load settings.' }
    }
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

// ─── General ──────────────────────────────────────────────────────────────────

export async function getGeneralSettings(): Promise<FetchResult<GeneralSettingsData>> {
    return fetchSetting<GeneralSettingsData>(ADMIN_CONFIG_GENERAL_ENDPOINT)
}

export async function updateGeneralSettings(data: Partial<GeneralSettingsData>): Promise<MutateResult> {
    return patchSetting(ADMIN_CONFIG_GENERAL_ENDPOINT, data)
}

// ─── Fees ─────────────────────────────────────────────────────────────────────

export async function getFeesSettings(): Promise<FetchResult<FeesSettingsData>> {
    return fetchSetting<FeesSettingsData>(ADMIN_CONFIG_FEES_ENDPOINT)
}

export async function updateFeesSettings(data: Partial<FeesSettingsData>): Promise<MutateResult> {
    return patchSetting(ADMIN_CONFIG_FEES_ENDPOINT, data)
}

// ─── Fraud / Security ─────────────────────────────────────────────────────────

export async function getFraudSettings(): Promise<FetchResult<FraudSettingsData>> {
    return fetchSetting<FraudSettingsData>(ADMIN_CONFIG_FRAUD_ENDPOINT)
}

export async function updateFraudSettings(data: Partial<FraudSettingsData>): Promise<MutateResult> {
    return patchSetting(ADMIN_CONFIG_FRAUD_ENDPOINT, data)
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotificationSettings(): Promise<FetchResult<NotificationSettingsData>> {
    return fetchSetting<NotificationSettingsData>(ADMIN_CONFIG_NOTIFICATIONS_ENDPOINT)
}

export async function updateNotificationSettings(data: Partial<NotificationSettingsData>): Promise<MutateResult> {
    return patchSetting(ADMIN_CONFIG_NOTIFICATIONS_ENDPOINT, data)
}

// ─── Localization ─────────────────────────────────────────────────────────────

export async function getLocalizationSettings(): Promise<FetchResult<LocalizationSettingsData>> {
    return fetchSetting<LocalizationSettingsData>(ADMIN_CONFIG_LOCALIZATION_ENDPOINT)
}

export async function updateLocalizationSettings(data: Partial<LocalizationSettingsData>): Promise<MutateResult> {
    return patchSetting(ADMIN_CONFIG_LOCALIZATION_ENDPOINT, data)
}
