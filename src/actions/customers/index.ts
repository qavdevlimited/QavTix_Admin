"use server"

import { getServerAxios } from "@/lib/axios"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { ADMIN_EVENT_ATTENDEES_ENDPOINT } from "@/endpoints"
import { cacheTag } from "next/cache"

async function _getEventAttendees(token: string | undefined, eventId: string): Promise<{ success: boolean; data?: AdminEventAttendee[]; message?: string }> {
    'use cache'
    cacheTag(`event-attendees-${eventId}`)
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(ADMIN_EVENT_ATTENDEES_ENDPOINT(eventId))
        const results: AdminEventAttendee[] = Array.isArray(data?.data)
            ? data.data
            : (data?.data?.results ?? [])
        return { success: true, data: results }
    } catch (error) {
        const errorData = (error as any)?.response?.data
        console.error(`[getEventAttendees(${eventId})]`, errorData ?? error)
        return { success: false, message: handleApiError(errorData) }
    }
}

export async function getEventAttendees(
    token: string | undefined,
    eventId: string,
): Promise<{ success: boolean; data?: AdminEventAttendee[]; message?: string }> {
    return _getEventAttendees(token, eventId)
}