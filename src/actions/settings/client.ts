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
import { cookies } from 'next/headers'
import { GeneralSettingsData, PoliciesSettingsData, FeesSettingsData, FraudSettingsData, NotificationSettingsData, LocalizationSettingsData, MutateResult, ResetResult, AllSettingsData } from './index'

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get('admin_access_token')?.value
}

async function patchSetting(endpoint: string, payload: object): Promise<MutateResult> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
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
        const tok = await getToken()
        const axios = await getServerAxios(tok)
        const res = await axios.post(ADMIN_CONFIG_RESET_ENDPOINT)
        revalidateTag(CACHE_TAGS.SETTINGS_ALL, 'max')
        return { success: true, data: res.data.data as AllSettingsData }
    } catch (err: any) {
        return { success: false, message: err?.response?.data?.message ?? 'Failed to reset settings.' }
    }
}
