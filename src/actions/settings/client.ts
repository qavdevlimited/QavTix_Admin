"use server"

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
import { GeneralSettingsData, PoliciesSettingsData, FeesSettingsData, FraudSettingsData, NotificationSettingsData, LocalizationSettingsData, MutateResult, ResetResult, AllSettingsData, FetchResult } from './index'

// ─── Mutations ───────────────────────────────────────────────────────────────

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

export async function ResetAllSettings(): Promise<ResetResult> {
    try {
        const axios = await getServerAxios()
        const res = await axios.post(ADMIN_CONFIG_RESET_ENDPOINT)
        revalidateTag(CACHE_TAGS.SETTINGS_ALL, 'max')
        return { success: true, data: res.data.data as AllSettingsData }
    } catch (err: any) {
        return { success: false, message: err?.response?.data?.message ?? 'Failed to reset settings.' }
    }
}

// ─── Interactive GETs ────────────────────────────────────────────────────────

export async function getGeneralSettings(_token?: string): Promise<FetchResult<GeneralSettingsData>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_CONFIG_GENERAL_ENDPOINT}`)
        return { success: true, data: data.data }
    } catch { return { success: false, message: 'Failed to load general settings.' } }
}

export async function getPoliciesSettings(_token?: string): Promise<FetchResult<PoliciesSettingsData>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_CONFIG_POLICIES_ENDPOINT}`)
        return { success: true, data: data.data }
    } catch { return { success: false, message: 'Failed to load policies settings.' } }
}

export async function getFeesSettings(_token?: string): Promise<FetchResult<FeesSettingsData>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_CONFIG_FEES_ENDPOINT}`)
        return { success: true, data: data.data }
    } catch { return { success: false, message: 'Failed to load fees settings.' } }
}

export async function getFraudSettings(_token?: string): Promise<FetchResult<FraudSettingsData>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_CONFIG_FRAUD_ENDPOINT}`)
        return { success: true, data: data.data }
    } catch { return { success: false, message: 'Failed to load fraud settings.' } }
}

export async function getNotificationSettings(_token?: string): Promise<FetchResult<NotificationSettingsData>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_CONFIG_NOTIFICATIONS_ENDPOINT}`)
        return { success: true, data: data.data }
    } catch { return { success: false, message: 'Failed to load notification settings.' } }
}

export async function getLocalizationSettings(_token?: string): Promise<FetchResult<LocalizationSettingsData>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_CONFIG_LOCALIZATION_ENDPOINT}`)
        return { success: true, data: data.data }
    } catch { return { success: false, message: 'Failed to load localization settings.' } }
}
