"use server"

import { CATEGORIES_ENDPOINT, EVENT_TICKET_TYPES_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"

export async function getCategories(): Promise<{ success: boolean; data: any[] }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${CATEGORIES_ENDPOINT}`)
        return { success: true, data: data?.data ?? [] }
    } catch {
        return { success: false, data: [] }
    }
}

export async function fetchTicketTypes(eventId: string): Promise<any[]> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${EVENT_TICKET_TYPES_ENDPOINT(eventId)}`)
        return data?.data ?? []
    } catch {
        return []
    }
}
