import AuditPageCW from "@/components/page-content-wrappers/AuditPageCW"
import { getAdminAuditLogs } from "@/actions/audit/index"
import { cookies } from "next/headers";

export const metadata = {
    title: "Audit Logs | QavTix Admin",
    description: "Track all administrative actions, approvals, and system changes.",
}

export default async function AuditPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;
    const initialData = await getAdminAuditLogs(token)

    return <AuditPageCW initialData={initialData} />
}