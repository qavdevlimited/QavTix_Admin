"use client"

import { cn } from "@/lib/utils"
import CustomAvatar from "@/components/custom-utils/avatars/CustomAvatar"
import { Icon } from "@iconify/react"
import { space_grotesk } from "@/lib/fonts"
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { toggleHostAutoPayout, toggleHostSuspension } from "@/actions/host-management"
import Link from "next/link"
import BankLogo from "../financials/BankLogo"


interface HostProfileCardProps {
    profile: HostProfileDetails
    onForcePayout?: () => void
    className?: string
}

const socialPlatformIcon = (url: string) => {
    if (url.includes("twitter") || url.includes("x.com")) return "hugeicons:new-twitter"
    if (url.includes("instagram")) return "hugeicons:instagram"
    if (url.includes("facebook")) return "fa6-brands:facebook"
    if (url.includes("tiktok")) return "ic:baseline-tiktok"
    if (url.includes("youtube")) return "mynaui:youtube-solid"
    return "humbleicons:globe"
}

const socialAriaLabel = (url: string) => {
    if (url.includes("twitter") || url.includes("x.com")) return "Twitter / X"
    if (url.includes("instagram")) return "Instagram"
    if (url.includes("facebook")) return "Facebook"
    if (url.includes("tiktok")) return "TikTok"
    if (url.includes("youtube")) return "YouTube"
    return "Website"
}

export function HostProfileCard({
    profile,
    onForcePayout,
    className,
}: HostProfileCardProps) {
    const [accountStatus, setAccountStatus] = useState(profile.account_status)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [autoPayout, setAutoPayout] = useState(profile.auto_payout ?? false)
    const dispatch = useAppDispatch()
    const { isConfirmed, lastConfirmedAction } = useAppSelector(s => s.confirmation)
    const pendingActionRef = useRef<"suspend" | "unsuspend" | null>(null)

    const isSuspended = accountStatus === "suspended"

    const handleSuspendOrRestore = () => {
        pendingActionRef.current = isSuspended ? "unsuspend" : "suspend"
        dispatch(
            openConfirmation({
                actionType: "SUSPEND_HOST",
                title: isSuspended ? "Restore Host Access" : "Suspend Host",
                description: isSuspended
                    ? "Are you sure you want to restore access for this host?"
                    : "Are you sure you want to suspend this host?",
            })
        )
    }

    const handleToggleAutoPayout = async (enabled: boolean) => {
        setAutoPayout(enabled)
        const result = await toggleHostAutoPayout(profile.host_id, enabled)
        if (result.success) {
            dispatch(showAlert({
                title: "Setting Updated",
                description: `Auto-payout is now ${enabled ? "enabled" : "disabled"}.`,
                variant: "success",
            }))
        } else {
            dispatch(showAlert({
                title: "Update Failed",
                description: result.message || "Failed to update auto-payout setting.",
                variant: "destructive",
            }))

            setAutoPayout(enabled)
        }
    }

    useEffect(() => {
        if (!isConfirmed || lastConfirmedAction !== "SUSPEND_HOST") return
        if (!pendingActionRef.current) return

        const actionId = pendingActionRef.current
        pendingActionRef.current = null

        const run = async () => {
            setIsActionLoading(true)
            const result = await toggleHostSuspension(profile.host_id)
            dispatch(resetConfirmationStatus())
            setIsActionLoading(false)

            if (result.success) {
                const newStatus = isSuspended ? "active" : "suspended"
                setAccountStatus(newStatus)
                dispatch(
                    openSuccessModal({
                        title: actionId === "suspend" ? "Host Suspended" : "Host Access Restored",
                        description:
                            actionId === "suspend"
                                ? `${profile.business_name} has been suspended.`
                                : `${profile.business_name} access has been restored.`,
                        variant: "success"
                    })
                )
            } else {
                dispatch(
                    showAlert({
                        title: "Action Failed",
                        description: result.message || "Could not update host status. Please try again.",
                        variant: "destructive",
                    })
                )
            }
        }

        run()
    }, [isConfirmed, lastConfirmedAction])

    return (
        <TooltipProvider>
            <div
                className={cn(
                    "bg-white rounded-3xl border border-gray-100 py-6 px-5 w-full max-w-[360px] shadow-[0px_4px_24px_0px_rgba(51,38,174,0.08)]",
                    className
                )}
            >
                {/* ── Profile Header ── */}
                <div className="flex items-start gap-6">
                    {/* Avatar with followers badge */}
                    <div className="relative shrink-0">
                        <CustomAvatar
                            name={profile.full_name}
                            profileImg={profile.profile_picture}
                            id={String(profile.host_id)}
                            size="size-[90px] text-2xl"
                        />
                        <Badge
                            variant="secondary"
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-brand-accent-1 text-brand-accent-6 border border-brand-accent-2 text-[10px] font-medium px-2 py-0.5 rounded-full shadow-xs"
                        >
                            {profile.followers.toLocaleString()} Followers
                        </Badge>
                    </div>

                    {/* Name + contact */}
                    <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3
                                className={cn(
                                    space_grotesk.className,
                                    "text-[20px] font-bold capitalize text-gray-900 leading-tight"
                                )}
                            >
                                {profile.full_name}
                            </h3>
                            {profile.is_verified && (
                                <Icon
                                    icon="solar:verified-check-bold"
                                    className="size-4 text-amber-400 shrink-0"
                                />
                            )}
                        </div>
                        <p className="text-xs text-brand-neutral-7 mt-0.5">{profile.phone_number || "No phone"}</p>
                        <p className="text-xs text-brand-neutral-7 truncate">{profile.email}</p>

                        {/* Business info */}
                        <div className="mt-2 space-y-0.5">
                            <p className="text-xs text-brand-neutral-8">
                                <span className="font-bold">Business Info:</span>
                            </p>
                            <p className="text-[11px] text-brand-neutral-7">
                                <span className="font-semibold">Name:</span> {profile.business_name}
                            </p>
                            {profile.registration_number && (
                                <p className="text-[11px] text-brand-neutral-7">
                                    <span className="font-semibold">RC:</span> {profile.registration_number}
                                </p>
                            )}
                            {profile.tax_id && (
                                <p className="text-[11px] text-brand-neutral-7">
                                    <span className="font-semibold">Tax ID/TIN:</span> {profile.tax_id}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100 mt-4" />

                {/* ── NIN + DOB ── */}
                <div className="flex items-center gap-6 text-[12px] mb-4">
                    {profile.nin && (
                        <div>
                            <span className="font-medium text-brand-secondary-9">NIN: </span>
                            <span className="text-brand-neutral-7">{profile.nin}</span>
                        </div>
                    )}
                    {profile.dob && (
                        <div>
                            <span className="font-medium text-brand-secondary-9">DOB: </span>
                            <span className="text-brand-neutral-7">{profile.dob}</span>
                        </div>
                    )}
                </div>

                {/* ── Location ── */}
                <div className="flex justify-between items-center gap-3 mb-4">
                    <div>
                        <p className="text-[12.77px] font-semibold text-brand-secondary-9 mb-0.5">Country</p>
                        <p className="text-xs text-gray-500 leading-snug">
                            {profile.country || "—"}
                        </p>
                    </div>
                    <div>
                        <p className="text-[12.77px] font-semibold text-brand-secondary-9 mb-0.5">State</p>
                        <p className="text-xs text-gray-500 leading-snug">
                            {profile.state || "—"}
                        </p>
                    </div>
                    <div>
                        <p className="text-[12.77px] font-semibold text-brand-secondary-9 mb-0.5">City</p>
                        <p className="text-xs text-gray-500 leading-snug">
                            {profile.city || "—"}
                        </p>
                    </div>
                </div>

                <hr className="border-gray-100 my-4" />

                {/* ── Linked Bank Accounts ── */}
                {profile.bank_accounts.length > 0 && (
                    <>
                        <h4 className="text-sm font-bold text-brand-secondary-9 mb-3">Linked Bank Accounts</h4>
                        <div className="space-y-2.5 mb-4">
                            {profile.bank_accounts.map(acc => (
                                <div key={acc.id} className="flex items-center gap-3">
                                    {/* Bank logo placeholder */}
                                    <div className="size-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
                                        <BankLogo bankName={acc.bank_name} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-brand-secondary-7 truncate">
                                            {acc.account_name}
                                        </p>
                                        <p className="text-[10px] text-brand-neutral-7">{acc.bank_name}</p>
                                    </div>
                                    {acc.is_default && (
                                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                                            Default
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <hr className="border-gray-100 my-4" />
                    </>
                )}

                {/* ── Contact Host + Auto Payout ── */}
                <div className="flex items-start justify-between gap-4 mb-5">
                    {/* Social links */}
                    <div>
                        <p className="text-sm font-bold text-brand-secondary-9 mb-2">Contact Host</p>
                        <div className="flex items-center gap-3">
                            {/* Always show globe for website */}
                            <Link
                                href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/host/profile/${profile.host_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-gray-900 transition-colors"
                                aria-label="Website"
                            >
                                <Icon icon="humbleicons:globe" className="size-5" />
                            </Link>
                            {profile.relevant_links?.[0] && Object.entries(profile.relevant_links[0]).map(([platform, url]) => {
                                if (!url) return null;
                                return (
                                    <Link
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-700 hover:text-gray-900 transition-colors"
                                        aria-label={socialAriaLabel(platform)}
                                    >
                                        <Icon
                                            icon={socialPlatformIcon(platform)}
                                            className="size-5"
                                        />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Auto Payout */}
                    <div>
                        <div className="flex items-center gap-1 mb-2">
                            <p className="text-[12px] font-bold text-gray-900">Auto Payout</p>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="text-amber-400 hover:text-amber-500 transition-colors">
                                        <Icon icon="mdi:information-outline" className="size-3.5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    className="max-w-[200px] text-xs text-center"
                                >
                                    Automatically process a seller&apos;s payout as soon as they request it, without manual approval.
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] text-gray-500">Allow auto payout</span>
                            <Switch
                                checked={autoPayout}
                                onCheckedChange={handleToggleAutoPayout}
                                className="data-[state=checked]:bg-blue-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <ActionButton1
                        buttonText={isSuspended ? "Restore" : "Suspend"}
                        buttonType="button"
                        className="flex-1 text-sm! h-12! rounded-full"
                        action={handleSuspendOrRestore}
                        isDisabled={isActionLoading}
                        isLoading={isActionLoading}
                    />
                    <Button
                        onClick={onForcePayout}
                        variant="outline"
                        disabled={isActionLoading}
                        className="flex-1 h-12 border-gray-300 text-gray-800 rounded-full font-medium hover:bg-gray-50 text-sm"
                    >
                        Force Payout
                    </Button>
                </div>
            </div>
        </TooltipProvider>
    )
}