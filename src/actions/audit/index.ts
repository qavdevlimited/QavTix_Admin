"use server"

import { getServerAxios } from "@/lib/axios"
import { ADMIN_AUDIT_LOGS_ENDPOINT } from "@/endpoints"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

// Audit logs change frequently — 30 s cache TTL for SSR deduplication
// while still reflecting recent activity quickly.
export async function getAdminAuditLogs(
    params?: Record<string, any>,
): Promise<TabSlice<AdminAuditLog>> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_access_token")?.value

        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_AUDIT_LOGS_ENDPOINT}`)
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
            next: { tags: [CACHE_TAGS.ADMIN_AUDIT_LOGS], revalidate: 30 },
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
    } catch (err) {
        console.error("[getAdminAuditLogs]", err)
        return { results: [], count: 0, next: null, previous: null, total_pages: 1 }
    }
}
