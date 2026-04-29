"use server"

import { getServerAxios } from "@/lib/axios"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { SEND_EMAIL_CAMPAIGNS_ENDPOINT, SINGLE_EMAIL_ENDPOINT, SINGLE_SMS_ENDPOINT } from "@/endpoints"
import { cookies } from "next/headers"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

export async function sendEmailCampaign(payload: SendCampaignPayload): Promise<CampaignResult> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
        await axios.post(SEND_EMAIL_CAMPAIGNS_ENDPOINT, payload)
        return { success: true, message: "Campaign sent successfully." }
    } catch (err: any) {
        console.error("[sendEmailCampaign]", err?.response?.data)
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function sendSingleEmail(payload: SendSingleEmailPayload): Promise<CampaignResult> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
        await axios.post(SINGLE_EMAIL_ENDPOINT, payload)
        return { success: true, message: "Email sent successfully." }
    } catch (err: any) {
        console.error("[sendSingleEmail]", err?.response?.data)
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function sendSingleSms(payload: SendSingleSmsPayload): Promise<CampaignResult> {
    try {
        const token = await getToken()
        const axios = await getServerAxios(token)
        await axios.post(SINGLE_SMS_ENDPOINT, payload)
        return { success: true, message: "SMS sent successfully." }
    } catch (err: any) {
        console.error("[sendSingleSms]", err?.response?.data)
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}