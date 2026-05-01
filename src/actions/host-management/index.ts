import {
    ADMIN_HOSTS_ENDPOINT,
    ADMIN_HOSTS_CARDS_ENDPOINT,
    ADMIN_HOST_VERIFICATIONS_ENDPOINT,
    ADMIN_HOST_PROFILE_ENDPOINT,
    ADMIN_HOST_CARDS_ENDPOINT,
    ADMIN_HOST_CHART_ENDPOINT,
    ADMIN_HOST_EVENTS_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import { CACHE_TAGS } from "@/cache-tags"
import { cacheTag } from "next/cache"

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function logError(context: string, error: unknown) {
    const err = error as any
    const status = err?.response?.status
    const url = err?.config?.url
    const data = err?.response?.data
    console.error(`[host-management] ${context}`, {
        ...(status && { status }),
        ...(url && { url }),
        ...(data && { response: data }),
        message: err?.message ?? String(error),
    })
}

// ─── Internal: paginated list (used by cached wrappers) ──────────────────────

async function fetchPage<T>(
    token: string | undefined,
    endpoint: string,
    extraParams?: Record<string, any>,
): Promise<TabSlice<T>> {
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(`${endpoint}`, { params: { page: 1, ...extraParams } })
        const d = data?.data ?? data
        return {
            results: d?.results ?? [],
            count: d?.count ?? 0,
            next: d?.next ?? null,
            previous: d?.previous ?? null,
            total_pages: d?.total_pages ?? 1,
        }
    } catch (error) {
        logError(`fetchPage(${endpoint})`, error)
        return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
    }
}

// ─── Cached GETs — token passed as arg, 'use cache' scoped inside ─────────────

async function _getAdminHosts(token: string | undefined): Promise<TabSlice<AdminHost>> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_HOSTS)
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_HOSTS_ENDPOINT}?page=1`
        const res = await fetch(url, {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })
        if (!res.ok) return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
        const json = await res.json()
        const d = json?.data ?? json
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

async function _getAdminHostCards(token: string | undefined, params?: Record<string, any>): Promise<{ cards: AdminHostCards | null }> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_HOST_CARDS)
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_HOSTS_CARDS_ENDPOINT}`)
        if (params) Object.entries(params).forEach(([k, v]) => { if (v != null) url.searchParams.set(k, String(v)) })
        const res = await fetch(url.toString(), {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })
        if (!res.ok) return { cards: null }
        const json = await res.json()
        return { cards: (json?.data ?? null) as AdminHostCards | null }
    } catch { return { cards: null } }
}

async function _getAdminPendingHosts(token: string | undefined): Promise<TabSlice<AdminPendingHost>> {
    'use cache'
    cacheTag(CACHE_TAGS.ADMIN_PENDING_HOSTS)
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_HOST_VERIFICATIONS_ENDPOINT}?page=1`
        const res = await fetch(url, {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })
        if (!res.ok) return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
        const json = await res.json()
        const d = json?.data ?? json
        return { results: d?.results ?? [], count: d?.count ?? 0, next: d?.next ?? null, previous: d?.previous ?? null, total_pages: d?.total_pages ?? 1 }
    } catch { return { results: [], count: 0, next: null, previous: null, total_pages: 1 } }
}

async function _getHostProfile(token: string | undefined, hostId: string | number): Promise<{ data: HostProfileDetails | null }> {
    'use cache'
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(`/${ADMIN_HOST_PROFILE_ENDPOINT(hostId)}`)
        return { data: (data?.data ?? null) as HostProfileDetails | null }
    } catch (error) {
        logError(`getHostProfile(${hostId})`, error)
        return { data: null }
    }
}

async function _getHostEarningsCards(token: string | undefined, hostId: string | number, params?: Record<string, any>): Promise<{ cards: HostEarningsCards | null }> {
    'use cache'
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(`/${ADMIN_HOST_CARDS_ENDPOINT(hostId)}`, { params })
        return { cards: (data?.data ?? null) as HostEarningsCards | null }
    } catch (error) {
        logError(`getHostEarningsCards(${hostId})`, error)
        return { cards: null }
    }
}

async function _getHostChart(token: string | undefined, hostId: string | number, params?: Record<string, any>): Promise<{ chart: HostChartPoint[] }> {
    'use cache'
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(`/${ADMIN_HOST_CHART_ENDPOINT(hostId)}`, { params })
        const results: HostChartPoint[] = Array.isArray(data?.data) ? data.data : []
        return { chart: results }
    } catch (error) {
        logError(`getHostChart(${hostId})`, error)
        return { chart: [] }
    }
}

async function _getHostEvents(token: string | undefined, hostId: string | number, status?: string): Promise<TabSlice<HostEvent>> {
    'use cache'
    return fetchPage<HostEvent>(token, ADMIN_HOST_EVENTS_ENDPOINT(hostId), status ? { status } : undefined)
}

// ─── Public exports (token passed from server page callers) ───────────────────

export async function getAdminHosts(token: string | undefined) { return _getAdminHosts(token) }
export async function getAdminHostCards(token: string | undefined, params?: Record<string, any>) { return _getAdminHostCards(token, params) }
export async function getAdminPendingHosts(token: string | undefined) { return _getAdminPendingHosts(token) }
export async function getHostProfile(token: string | undefined, hostId: string | number) { return _getHostProfile(token, hostId) }
export async function getHostEarningsCards(token: string | undefined, hostId: string | number, params?: Record<string, any>) { return _getHostEarningsCards(token, hostId, params) }
export async function getHostChart(token: string | undefined, hostId: string | number, params?: Record<string, any>) { return _getHostChart(token, hostId, params) }
export async function getHostEvents(token: string | undefined, hostId: string | number, status?: string) { return _getHostEvents(token, hostId, status) }

export interface HostSearchResult {
    id: string
    name: string
}

export async function searchHosts(token: string | undefined, search?: string): Promise<HostSearchResult[]> {
    try {
        const axios = await getServerAxios(token)
        const { data } = await axios.get(`/${ADMIN_HOSTS_ENDPOINT}`, {
            params: { page: 1, ...(search ? { search } : {}) },
        })
        const results = data?.data?.results ?? data?.results ?? []
        return results.map((h: any) => ({
            id: String(h.host_id),
            name: h.business_name ?? h.owner_name ?? h.full_name ?? "Unknown Host",
        }))
    } catch (error) {
        logError(`searchHosts(search="${search ?? ""}")`, error)
        return []
    }
}