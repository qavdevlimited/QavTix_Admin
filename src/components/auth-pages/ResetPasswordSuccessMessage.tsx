import { AUTH_LINKS } from "@/enums/navigation";
import { space_grotesk } from "@/lib/fonts";
import Image from "next/image";
import Link from "next/link";
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordSuccessMessage() {
    const router = useRouter()
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        // Reset countdown when component mounts
        setCountdown(5)

        // Decrement every second
        const tick = setInterval(() => {
            setCountdown(prev => Math.max(0, prev - 1))
        }, 1000)

        // Redirect after 5 seconds
        const timer = setTimeout(() => {
            router.push(AUTH_LINKS.SIGN_IN.href)
        }, 5000)

        return () => {
            clearInterval(tick)
            clearTimeout(timer)
        }
    }, [router])

    return (
        <AnimatedDialog open={true} showCloseButton={false} className="rounded-[40px]" childrenContainerStyles="px-8 py-20">
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
            <div className="text-center">
                <Image
                    src="/images/vectors/success-indicator.svg"
                    alt="Success Indicator"
                    width={200}
                    height={200}
                    className="mx-auto mb-6 size-36"
                />
                <DialogTitle className={`text-2xl font-bold text-brand-secondary-9 mb-2 ${space_grotesk.className}`}>
                    Password changed successfully!
                </DialogTitle>
                <DialogDescription className="text-[#616166] text-sm">
                    Your password has been changed successfully.{" "}
                    <Link href={AUTH_LINKS.SIGN_IN.href} className="text-brand-accent-6 font-medium">
                        Log in
                    </Link>
                    <p className="mt-4 text-xs text-brand-neutral-6 animate-pulse">
                        Redirecting to login in {countdown}s…
                    </p>
                </DialogDescription>
            </div>
        </AnimatedDialog>
    )
}