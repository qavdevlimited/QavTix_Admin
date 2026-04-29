"use server"

import { cookies } from "next/headers"
import {
    getGeneralSettings,
    getPoliciesSettings,
    getFeesSettings,
    getFraudSettings,
    getNotificationSettings,
    getLocalizationSettings,
    updateGeneralSettings,
    updatePoliciesSettings,
    updateFeesSettings,
    updateFraudSettings,
    updateNotificationSettings,
    updateLocalizationSettings,
    ResetAllSettings,
    type GeneralSettingsData,
    type PoliciesSettingsData,
    type FeesSettingsData,
    type FraudSettingsData,
    type NotificationSettingsData,
    type LocalizationSettingsData,
} from "./index"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

// ─── GET wrappers (read cookies here, pass token to cached function) ──────────

export async function getGeneralSettingsClient() {
    return getGeneralSettings(await getToken())
}

export async function getPoliciesSettingsClient() {
    return getPoliciesSettings(await getToken())
}

export async function getFeesSettingsClient() {
    return getFeesSettings(await getToken())
}

export async function getFraudSettingsClient() {
    return getFraudSettings(await getToken())
}

export async function getNotificationSettingsClient() {
    return getNotificationSettings(await getToken())
}

export async function getLocalizationSettingsClient() {
    return getLocalizationSettings(await getToken())
}

// ─── Mutation wrappers (pass token through — mutations read their own cookies anyway) ──

export async function updateGeneralSettingsClient(data: Partial<GeneralSettingsData>) {
    return updateGeneralSettings(undefined, data)
}

export async function updatePoliciesSettingsClient(data: Partial<PoliciesSettingsData>) {
    return updatePoliciesSettings(undefined, data)
}

export async function updateFeesSettingsClient(data: Partial<FeesSettingsData>) {
    return updateFeesSettings(undefined, data)
}

export async function updateFraudSettingsClient(data: Partial<FraudSettingsData>) {
    return updateFraudSettings(undefined, data)
}

export async function updateNotificationSettingsClient(data: Partial<NotificationSettingsData>) {
    return updateNotificationSettings(undefined, data)
}

export async function updateLocalizationSettingsClient(data: Partial<LocalizationSettingsData>) {
    return updateLocalizationSettings(undefined, data)
}

export async function ResetAllSettingsClient() {
    return ResetAllSettings(undefined)
}
