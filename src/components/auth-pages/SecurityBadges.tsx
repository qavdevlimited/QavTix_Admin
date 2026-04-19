"use client"

import { useSearchParams } from "next/navigation";

function SecurityBadges() {

    
    const searchParams = useSearchParams()
    const signInStatus = searchParams.get("status")

    {/* Security Badges */}
    return (
        !signInStatus && signInStatus !== "success" &&
        <div className="flex justify-center items-center gap-2 text-[13px] text-brand-neutral-7 font-medium">
            <span className="flex items-center gap-1.5">
            <span className="size-1 bg-brand-neutral-7 rounded-full" />
            Secure Access
            </span>
            <span className="flex items-center gap-1.5">
            <span className="size-1 bg-brand-neutral-7 rounded-full" />
            RBAC Enabled
            </span>
            <span className="flex items-center gap-1.5">
            <span className="size-1 bg-brand-neutral-7 rounded-full" />
            Audit Logged
            </span>
        </div>
    )
}

export default SecurityBadges;