// ─── Audit Logs ──────────────────────────────────────────────────────────────

interface AdminAuditLog {
    id: string
    timestamp: string
    admin_email: string
    admin_name: string
    action: string
    action_label: string
    details: string
    target_type: string
    target_id: string
    target_label: string
    ip_address: string
    user_agent: string
}
