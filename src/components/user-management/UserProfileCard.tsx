"use client"

import { cn } from "@/lib/utils"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"
import { Icon } from "@iconify/react"
import { formatDateTime } from "@/helper-fns/date-utils"
import { Button } from "@/components/ui/button"
import { space_grotesk } from "@/lib/fonts"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { AccountActionType } from "../modals/resources/user-account-action-status"
import { openConfirmation, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice"
import UserAccountActionStatusModal from "../modals/UserAccountActionStatusModal"
import { toggleUserSuspension } from "@/actions/user-management/client"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { formatPrice } from "@/helper-fns/formatPrice"

interface UserProfileDetailsCardProps {
    profile: UserProfileDetails
    className?: string
}

export function UserProfileDetailsCard({ profile, className }: UserProfileDetailsCardProps) {

    const [accountStatus, setAccountStatus] = useState(profile.account_status)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [showAccountActionStatusModal, setShowAccountActionStatusModal] = useState<{ actionType: AccountActionType, show: boolean } | null>(null)
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(store => store.authUser)
    const { isConfirmed, lastConfirmedAction } = useAppSelector(store => store.confirmation)
    const isMounted = useIsMounted()

    const isSuspended = accountStatus === "suspended"

    const handleSuspendOrRestore = () => {
        dispatch(openConfirmation({
            actionType: "SUSPEND_USER",
            title: isSuspended ? "Restore User Access" : "Suspend User",
            description: isSuspended
                ? "Are you sure you want to restore access for this user?"
                : "Are you sure you want to suspend this user?"
        }))
    }

    useEffect(() => {
        if (isConfirmed && lastConfirmedAction === "SUSPEND_USER") {
            dispatch(resetConfirmationStatus())

            setIsActionLoading(true)
            toggleUserSuspension(profile.user_id).then((res) => {
                setIsActionLoading(false)
                if (res.success) {
                    const newStatus = isSuspended ? "active" : "suspended"
                    setAccountStatus(newStatus)
                    setShowAccountActionStatusModal({
                        actionType: isSuspended ? "unsuspended" : "suspended",
                        show: true
                    })
                }
            })
        }
    }, [isConfirmed, lastConfirmedAction])

    const address = [profile.city, profile.state, profile.country].filter(Boolean).join(", ")

    const statusColor = accountStatus === "active" ? "text-[#359160]"
        : accountStatus === "suspended" ? "text-amber-500"
            : "text-red-500"

    return (
        <div className={cn('bg-white rounded-3xl h-full border border-gray-200 py-8 px-6 w-full max-w-105 shadow-[0px_5.8px_23.17px_0px_#3326AE14]', className)}>
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
                <div className="mb-3">
                    <CustomAvatar
                        name={profile.full_name}
                        profileImg={profile.profile_picture}
                        id={String(profile.user_id)}
                        size="size-[100px] text-3xl"
                    />
                </div>

                <h3 className={cn(space_grotesk.className, "text-2xl font-bold text-brand-secondary-9 mb-1")}>
                    {profile.full_name}
                </h3>
                <p className="text-xs font-bold text-brand-neutral-7 mb-3">
                    Joined: <span className="font-normal">{formatDateTime(profile.date_joined)}</span>
                </p>

                {/* Status Badge */}
                <div className={cn("flex items-center gap-1 whitespace-nowrap", statusColor)}>
                    <Icon icon="mdi:circle" className="w-2 h-2" />
                    <span className="text-xs font-medium capitalize">
                        {accountStatus}
                    </span>
                </div>
            </div>

            <hr className="border-brand-neutral-5 my-4" />

            {/* Quick Stats Row */}
            <div className="flex gap-4 my-6">
                <div className="flex-1 flex items-center gap-3">
                    <div className="size-8 rounded-md bg-[#359160] flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
                        <Icon icon="hugeicons:ticket-02" className="text-white size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-brand-neutral-7 leading-none mb-2">All-Time Purchases</p>
                        <p className="text-sm font-bold text-brand-secondary-7 leading-none">
                            {profile.all_time_tickets} Tickets
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex items-center gap-3">
                    <div className="size-8 rounded-md bg-[#FF9249] flex items-center justify-center shrink-0 shadow-sm shadow-orange-200">
                        <Icon icon="hugeicons:wallet-01" className="text-white size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-brand-neutral-7 leading-none mb-2">Wallet Balance</p>
                        <p className="text-sm font-bold text-brand-secondary-7 leading-none">
                            {isMounted && formatPrice(Number(profile.wallet_balance), user?.currency)}
                        </p>
                    </div>
                </div>
            </div>

            <hr className="border-brand-neutral-5 my-4" />

            {/* Details Section */}
            <div className="space-y-6 mb-8 text-brand-secondary-9">
                <h4 className="text-base font-bold text-brand-secondary-9">Details:</h4>

                <div className="flex gap-4 items-start">
                    <Icon icon="lucide:mail" className="text-slate-300 size-5 mt-0.5" />
                    <div>
                        <p className="text-[13px] font-semibold leading-none mb-1">Email</p>
                        <p className="text-xs text-brand-neutral-7">{profile.email}</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <Icon icon="ic:baseline-phone" className="text-slate-300 size-5 mt-0.5" />
                    <div>
                        <p className="text-[13px] font-semibold leading-none mb-1">Phone</p>
                        <p className="text-xs text-brand-neutral-7">{profile.phone_number}</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <Icon icon="lucide:map-pin" className="text-brand-secondary-3 size-5 mt-0.5" />
                    <div>
                        <p className="text-[13px] font-semibold leading-none mb-1">Address</p>
                        <p className="text-xs text-brand-neutral-7 leading-relaxed">
                            {address || "Not provided"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Activity Section */}
            <div className="space-y-6 mb-10">
                <h4 className="text-base font-bold text-slate-800">Activity:</h4>

                <div className="flex gap-4 items-start">
                    <Icon icon="lucide:calendar" className="text-slate-300 size-5 mt-0.5" />
                    <div>
                        <p className="text-[13px] font-semibold leading-none mb-1">First Purchase</p>
                        <p className="text-xs text-brand-neutral-7">
                            {profile.first_purchase ? formatDateTime(profile.first_purchase) : "No purchases yet"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <Icon icon="lucide:calendar" className="text-slate-300 size-5 mt-0.5" />
                    <div>
                        <p className="text-[13px] font-semibold leading-none mb-1">Latest Purchase</p>
                        <p className="text-xs text-brand-neutral-7">
                            {profile.last_purchase ? formatDateTime(profile.last_purchase) : "No purchases yet"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <ActionButton1
                    buttonText={isSuspended ? "Suspended" : "Suspend"}
                    buttonType="button"
                    className="h-12.5! w-[55%]"
                    action={handleSuspendOrRestore}
                    isDisabled={isSuspended || isActionLoading}
                    isLoading={isActionLoading}
                />
                {
                    isSuspended &&
                    <Button
                        onClick={handleSuspendOrRestore}
                        variant="outline"
                        disabled={!isSuspended || isActionLoading}
                        className="flex-1 h-12.5 border-brand-secondary-6 text-brand-secondary-8 rounded-full py-6 font-medium hover:bg-brand-primary-1/50"
                    >
                        Restore Access
                    </Button>
                }
            </div>

            <UserAccountActionStatusModal
                open={!!showAccountActionStatusModal?.show}
                resultType={showAccountActionStatusModal?.actionType!}
                onOpenChange={() => setShowAccountActionStatusModal(null)}
            />
        </div>
    )
}