import {
    ADMIN_HOSTS_ENDPOINT,
    ADMIN_HOSTS_CARDS_ENDPOINT,
    ADMIN_HOST_VERIFICATIONS_ENDPOINT,
    ADMIN_HOST_PROFILE_ENDPOINT,
    ADMIN_HOST_CARDS_ENDPOINT,
    ADMIN_HOST_CHART_ENDPOINT,
    ADMIN_HOST_EVENTS_ENDPOINT,
} from "@/endpoints"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(
    token: string | undefined,
    path: string,
    params?: Record<string, any>
): Promise<{ success: boolean; data?: T }> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`)
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v != null) url.searchParams.set(k, String(v))
            })
        }
        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
        if (!res.ok) return { success: false }
        const json = await res.json()
        return { success: true, data: json.data as T }
    } catch {
        return { success: false }
    }
}

async function apiFetchList<T>(
    token: string | undefined,
    path: string,
    params?: Record<string, any>
): Promise<TabSlice<T>> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`)
        url.searchParams.set("page", "1")
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v != null) url.searchParams.set(k, String(v))
            })
        }
        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
        if (!res.ok) return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
        const json = await res.json()
        const d = json?.data ?? json
        return {
            results: d?.results ?? [],
            count: d?.count ?? 0,
            next: d?.next ?? null,
            previous: d?.previous ?? null,
            total_pages: d?.total_pages ?? 1,
        }
    } catch {
        return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
    }
}

// ─── Pure GETs — token as arg, no directives ─────────────────────────────────

export async function getAdminHosts(token: string | undefined) {
    return apiFetchList<AdminHost>(token, ADMIN_HOSTS_ENDPOINT)
}

export async function getAdminHostCards(token: string | undefined, params?: Record<string, any>) {
    const { data } = await apiFetch<AdminHostCards>(token, ADMIN_HOSTS_CARDS_ENDPOINT, params)
    return { cards: data ?? null }
}

export async function getAdminPendingHosts(token: string | undefined) {
    return apiFetchList<AdminPendingHost>(token, ADMIN_HOST_VERIFICATIONS_ENDPOINT)
}

export async function getHostProfile(token: string | undefined, hostId: string | number) {
    const { data } = await apiFetch<HostProfileDetails>(token, ADMIN_HOST_PROFILE_ENDPOINT(hostId))
    return { data: data ?? null }
}

export async function getHostEarningsCards(token: string | undefined, hostId: string | number, params?: Record<string, any>) {
    const { data } = await apiFetch<HostEarningsCards>(token, ADMIN_HOST_CARDS_ENDPOINT(hostId), params)
    return { cards: data ?? null }
}

export async function getHostChart(token: string | undefined, hostId: string | number, params?: Record<string, any>) {
    const { data } = await apiFetch<HostChartPoint[]>(token, ADMIN_HOST_CHART_ENDPOINT(hostId), params)
    return { chart: Array.isArray(data) ? data : [] }
}

export async function getHostEvents(token: string | undefined, hostId: string | number, status?: string) {
    return apiFetchList<HostEvent>(token, ADMIN_HOST_EVENTS_ENDPOINT(hostId), status ? { status } : undefined)
}

export interface HostSearchResult {
    id: string
    name: string
}

export async function searchHosts(token: string | undefined, search?: string): Promise<HostSearchResult[]> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_HOSTS_ENDPOINT}`)
        url.searchParams.set("page", "1")
        if (search) url.searchParams.set("search", search)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
        if (!res.ok) return []
        const json = await res.json()
        const results = json?.data?.results ?? json?.results ?? []
        return results.map((h: any) => ({
            id: String(h.host_id),
            name: h.business_name ?? h.owner_name ?? h.full_name ?? "Unknown Host",
        }))
    } catch {
        return []
    }
}