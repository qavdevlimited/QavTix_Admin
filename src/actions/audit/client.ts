"use server";

import { cookies } from "next/headers";
import { getAdminAuditLogs } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("admin_access_token")?.value;
}

export async function getAdminAuditLogsClient(...args: any[]) {
    return (getAdminAuditLogs as any)(await getToken(), ...args);
}
