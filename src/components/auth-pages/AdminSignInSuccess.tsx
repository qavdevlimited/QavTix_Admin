"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog";
import { DialogDescription, DialogTitle } from "../ui/dialog";

/** Milliseconds to show the success modal before auto-redirecting */
const REDIRECT_DELAY = 5000

interface AdminSignInSuccessProps {
    open: boolean;
}

export default function AdminSignInSuccess({ open }: AdminSignInSuccessProps) {
    const router  = useRouter()
    const [countdown, setCountdown] = useState(Math.ceil(REDIRECT_DELAY / 1000))

    useEffect(() => {
        if (!open) return

        // Reset countdown when modal opens
        setCountdown(Math.ceil(REDIRECT_DELAY / 1000))

        // Decrement every second for the visual countdown
        const tick = setInterval(() => {
            setCountdown(prev => Math.max(0, prev - 1))
        }, 1000)

        // Redirect after the full delay
        const redirect = setTimeout(() => {
            window.location.href = "/dashboard"
        }, REDIRECT_DELAY)

        return () => {
            clearInterval(tick)
            clearTimeout(redirect)
        }
    }, [open, router])

    return (
        <AnimatedDialog open={open} showCloseButton={false} className="rounded-[40px]" childrenContainerStyles="px-8 pt-0! pb-10">
            <div className="text-center relative overflow-hidden">
                <Image
                    src="/images/vectors/confetti.svg"
                    alt="" aria-hidden="true"
                    width={500} height={400}
                    className="block md:hidden absolute w-full top-0 left-0 pointer-events-none select-none"
                />
                <Image
                    src="/images/vectors/confetti-lg.svg"
                    alt="" aria-hidden="true"
                    width={500} height={400}
                    className="hidden md:block absolute w-full top-0 left-0 pointer-events-none select-none"
                />

                <div className="relative z-10 mt-10">
                    <Image
                        src="/images/vectors/success-indicator2.svg"
                        alt="Success Indicator"
                        width={190} height={190}
                        className="mx-auto mb-4 size-32 lg:size-36"
                    />

                    <DialogTitle className={cn(
                        "text-2xl font-bold text-brand-secondary-9 mb-2",
                        space_grotesk.className
                    )}>
                        Welcome to QavTix Admin
                    </DialogTitle>
                    <DialogDescription className="text-brand-neutral-7 text-sm mb-6">
                        Manage events, users, and operations from one central dashboard.
                    </DialogDescription>

                    {/* Auto-redirect indicator */}
                    <p className="text-xs text-brand-neutral-6 animate-pulse">
                        Redirecting to dashboard in {countdown}s…
                    </p>
                </div>
            </div>
        </AnimatedDialog>
    )
}