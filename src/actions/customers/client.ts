"use server"

import { ADMIN_EVENT_ATTENDEES_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"

export async function getEventAttendees(eventId: string): Promise<{ success: boolean; data?: AdminEventAttendee[]; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ADMIN_EVENT_ATTENDEES_ENDPOINT(eventId)}`)
        const results: AdminEventAttendee[] = Array.isArray(data?.data)
            ? data.data
            : (data?.data?.results ?? [])
        return { success: true, data: results }
    } catch {
        return { success: false, message: "Failed to load attendees." }
    }
}
