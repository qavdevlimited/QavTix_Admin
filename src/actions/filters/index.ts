"use server"

import { CATEGORIES_ENDPOINT, EVENT_TICKET_TYPES_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"

export interface ApiCategory {
    id: number
    name: string
}

export interface GetCategoriesResult {
    success: boolean
    data: ApiCategory[]
    message?: string
}

export async function getCategories(): Promise<GetCategoriesResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(CATEGORIES_ENDPOINT)
        return { success: true, data: data.data ?? [] }
    } catch {
        return { success: false, data: [] }
    }
}


export async function fetchTicketTypes(eventId: string): Promise<TicketType[]> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(EVENT_TICKET_TYPES_ENDPOINT(eventId))
        console.log('ticket types data:::', data.data)
        return data?.data ?? []
    } catch {
        return []
    }
}

