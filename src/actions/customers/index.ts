import { CACHE_TAGS } from "@/cache-tags"
import { ADMIN_EVENT_ATTENDEES_ENDPOINT } from "@/endpoints"

export async function getEventAttendees(
    token: string | undefined,
    eventId: string,
): Promise<{ success: boolean; data?: AdminEventAttendee[]; message?: string }> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_EVENT_ATTENDEES_ENDPOINT(eventId)}`
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.ADMIN_EVENTS], revalidate: 300 }
        })
        if (!res.ok) return { success: false, message: "Failed to load attendees." }
        const json = await res.json()
        const results: AdminEventAttendee[] = Array.isArray(json?.data)
            ? json.data
            : (json?.data?.results ?? [])
        return { success: true, data: results }
    } catch {
        return { success: false, message: "Failed to load attendees." }
    }
}