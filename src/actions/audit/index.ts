"use server"

import { getServerAxios } from "@/lib/axios"
import { ADMIN_AUDIT_LOGS_ENDPOINT } from "@/endpoints"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"

export async function getAdminAuditLogs(
    params?: Record<string, any>,
): Promise<TabSlice<AdminAuditLog>> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(ADMIN_AUDIT_LOGS_ENDPOINT, {
            params: { page: 1, ...params },
        })
        const d = data?.data ?? data
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
