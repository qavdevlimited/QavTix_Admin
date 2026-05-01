"use server"

import {
    ADMIN_HOST_SUSPEND_ENDPOINT,
    ADMIN_HOST_BADGE_ENDPOINT,
    ADMIN_HOST_APPROVE_ENDPOINT,
    ADMIN_HOST_DECLINE_ENDPOINT,
    ADMIN_HOST_PAYOUT_ENDPOINT,
    ADMIN_HOST_AUTOPAYOUT_ENDPOINT,
    ADMIN_HOST_EVENT_FEATURE_ENDPOINT,
    ADMIN_HOST_EVENT_SUSPEND_ENDPOINT,
    ADMIN_HOST_EVENT_DELETE_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { CACHE_TAGS } from "@/cache-tags"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { logError } from "./index"

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

async function postAction(endpoint: string, body?: Record<string, any>): Promise<{ success: boolean; message?: string }> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
        await axios.post(endpoint, body)
        return { success: true }
    } catch (error) {
        logError(`postAction(${endpoint})`, error)
        const errorData = (error as any)?.response?.data
        return { success: false, message: handleApiError(errorData) }
    }
}

async function deleteAction(endpoint: string): Promise<{ success: boolean; message?: string }> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
        await axios.delete(endpoint)
        return { success: true }
    } catch (error) {
        logError(`deleteAction(${endpoint})`, error)
        const errorData = (error as any)?.response?.data
        return { success: false, message: handleApiError(errorData) }
    }
}

async function putAction(endpoint: string, body: Record<string, any>): Promise<{ success: boolean; message?: string }> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
        await axios.put(`/${endpoint}`, body)
        return { success: true }
    } catch (error) {
        logError(`putAction(${endpoint})`, error)
        const errorData = (error as any)?.response?.data
        return { success: false, message: handleApiError(errorData) }
    }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function toggleHostSuspension(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    const result = await postAction(ADMIN_HOST_SUSPEND_ENDPOINT(hostId))
    if (result.success) revalidateTag(CACHE_TAGS.ADMIN_HOSTS, 'max')
    return result
}

export async function giftHostBadge(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    return postAction(ADMIN_HOST_BADGE_ENDPOINT(hostId))
}

export async function forceHostPayout(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    const result = await postAction(ADMIN_HOST_PAYOUT_ENDPOINT(), { host_id: hostId })
    if (result.success) revalidateTag(CACHE_TAGS.ADMIN_HOST_CARDS, 'max')
    return result
}

export async function toggleHostAutoPayout(hostId: string | number, is_enabled: boolean): Promise<{ success: boolean; message?: string }> {
    return putAction(ADMIN_HOST_AUTOPAYOUT_ENDPOINT(hostId), { is_enabled })
}

export async function approveHostVerification(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    const result = await postAction(ADMIN_HOST_APPROVE_ENDPOINT(hostId))
    if (result.success) revalidateTag(CACHE_TAGS.ADMIN_PENDING_HOSTS, 'max')
    return result
}

export async function declineHostVerification(hostId: string | number): Promise<{ success: boolean; message?: string }> {
    const result = await postAction(ADMIN_HOST_DECLINE_ENDPOINT(hostId))
    if (result.success) revalidateTag(CACHE_TAGS.ADMIN_PENDING_HOSTS, 'max')
    return result
}

export async function featureHostEvent(eventId: string, planSlug: string): Promise<{ success: boolean; message?: string }> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
        await axios.post(`/${ADMIN_HOST_EVENT_FEATURE_ENDPOINT(eventId)}`, { plan_slug: planSlug })
        return { success: true }
    } catch (error) {
        logError(`featureHostEvent(${eventId})`, error)
        const errorData = (error as any)?.response?.data
        return { success: false, message: handleApiError(errorData) }
    }
}

export async function suspendHostEvent(eventId: string): Promise<{ success: boolean; message?: string }> {
    return postAction(ADMIN_HOST_EVENT_SUSPEND_ENDPOINT(eventId))
}

export async function deleteHostEvent(eventId: string): Promise<{ success: boolean; message?: string }> {
    return deleteAction(ADMIN_HOST_EVENT_DELETE_ENDPOINT(eventId))
}
