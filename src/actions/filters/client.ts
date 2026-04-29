"use server"

import { cookies } from "next/headers"
import { getCategories, fetchTicketTypes } from "./index"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

export async function getCategoriesClient() {
    return getCategories(await getToken())
}

// fetchTicketTypes already reads cookies() internally — just re-export with Client suffix
export async function fetchTicketTypesClient(eventId: string) {
    return fetchTicketTypes(eventId)
}
