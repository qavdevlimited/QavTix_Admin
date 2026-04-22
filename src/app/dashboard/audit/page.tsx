import AuditPageCW from "@/components/page-content-wrappers/AuditPageCW"
import { getAdminAuditLogs } from "@/actions/audit"

export const metadata = {
    title: "Audit Logs | QavTix Admin",
    description: "Track all administrative actions, approvals, and system changes.",
}

export default async function AuditPage() {
    const initialData = await getAdminAuditLogs()

    return <AuditPageCW initialData={initialData} />
}