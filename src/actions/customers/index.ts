"use server"

import { getServerAxios } from "@/lib/axios"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { ADMIN_EVENT_ATTENDEES_ENDPOINT } from "@/endpoints";

export async function getEventAttendees(
    eventId: string
): Promise<{ success: boolean; data?: AdminEventAttendee[]; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(
            ADMIN_EVENT_ATTENDEES_ENDPOINT(eventId)
        )
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