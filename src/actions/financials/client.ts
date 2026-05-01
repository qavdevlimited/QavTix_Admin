"use server"

import {
    ADMIN_PAYOUT_APPROVE_ENDPOINT,
    ADMIN_PAYOUT_DECLINE_ENDPOINT,
    ADMIN_PAYOUT_FORCE_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { CACHE_TAGS } from "@/cache-tags"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

async function postMutation(
    endpoint: string,
    body?: Record<string, any>,
): Promise<{ success: boolean; message?: string }> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
        await axios.post(endpoint, body)
        return { success: true }
    } catch (err: any) {
        return {
            success: false,
            message: err?.response?.data?.message ?? err?.message ?? "Action failed",
        }
    }
}

export async function approvePayout(payoutId: string) {
    const result = await postMutation(ADMIN_PAYOUT_APPROVE_ENDPOINT(payoutId))
    if (result.success) revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
    return result
}

export async function declinePayout(payoutId: string) {
    const result = await postMutation(ADMIN_PAYOUT_DECLINE_ENDPOINT(payoutId))
    if (result.success) revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
    return result
}

export async function forcePayout(payoutId: string) {
    const result = await postMutation(ADMIN_PAYOUT_FORCE_ENDPOINT(payoutId))
    if (result.success) revalidateTag(CACHE_TAGS.ADMIN_FINANCIAL_CARDS, 'max')
    return result
}
