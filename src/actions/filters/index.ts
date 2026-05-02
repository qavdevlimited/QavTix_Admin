import { CATEGORIES_ENDPOINT, EVENT_TICKET_TYPES_ENDPOINT } from "@/endpoints"

export interface ApiCategory {
    id: number
    name: string
}

export interface GetCategoriesResult {
    success: boolean
    data: ApiCategory[]
    message?: string
}

export interface TicketType {
    id: number
    ticket_type: string
    price: string
    quantity: number
    sold_count: number
}

// ─── Pure GETs — token as arg, no directives ─────────────────────────────────

export async function getCategories(token: string | undefined): Promise<GetCategoriesResult> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CATEGORIES_ENDPOINT}`
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
        if (!res.ok) return { success: false, data: [] }
        const json = await res.json()
        return { success: true, data: json.data ?? [] }
    } catch {
        return { success: false, data: [] }
    }
}

export async function fetchTicketTypes(token: string | undefined, eventId: string): Promise<TicketType[]> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_TICKET_TYPES_ENDPOINT(eventId)}`
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
        if (!res.ok) return []
        const json = await res.json()
        return json?.data ?? []
    } catch {
        return []
    }
}
