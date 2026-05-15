"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import CountdownTimer from "@/components/auth-pages/CountDownTimer";
import ResetPasswordSuccessMessage from "@/components/auth-pages/ResetPasswordSuccessMessage";
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1";
import OTPInput from "@/components/custom-utils/inputs/OTPInput";
import PasswordInput1 from "@/components/custom-utils/inputs/PasswordInput";
import { AUTH_LINKS } from "@/enums/navigation";
import { maskEmail } from "@/helper-fns/maskEmail";
import { space_grotesk } from "@/lib/fonts";
import { verifyOtp, resetPassword, requestPasswordReset } from "@/actions/auth/client";
import { resetEmailStore } from "@/lib/local-store/reset-email-store";
import Link from "next/link";

const OTP_EXPIRY_SECONDS = 180

const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
type Step = "otp" | "new-password"

export default function ResetPasswordPage() {

    const [email, setEmail] = useState<string | null>(null)
    const [resetToken, setResetToken] = useState<string | null>(null)
    const [step, setStep] = useState<Step>("otp")
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
    const [otpError, setOtpError] = useState<string | null>(null)
    const [otpSubmitting, setOtpSubmitting] = useState(false)
    const [resetSuccessful, setResetSuccessful] = useState(false)
    const [resending, setResending] = useState(false)
    const [timerKey, setTimerKey] = useState(0)
    const [timerExpired, setTimerExpired] = useState(false)

    useEffect(() => {
        const stored = resetEmailStore.get()
        if (stored) setEmail(stored)
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
    })

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otpSubmitting) return
        setOtpError(null)

        const code = otp.join("")

        if (code.length < 6) {
            setOtpError("Enter the full 6-digit code.")
            return
        }

        if (timerExpired) {
            setOtpError("Code has expired. Please request a new one.")
            return
        }

        if (!email) {
            setOtpError("Session expired. Please restart the reset process.")
            return
        }

        setOtpSubmitting(true)
        const result = await verifyOtp(email, code)
        setOtpSubmitting(false)

        if (result.success && result.token) {
            setResetToken(result.token)
            setStep("new-password")
        } else {
            setOtpError(result.message ?? "Invalid or expired code.")
        }
    }

    const handleResend = async () => {
        if (!email || resending || !timerExpired) return
        setResending(true)
        await requestPasswordReset(email)
        setResending(false)
        setOtp(Array(6).fill(""))
        setOtpError(null)
        setTimerExpired(false)
        setTimerKey(prev => prev + 1)
    }

    const onResetSubmit = async (values: ResetPasswordValues) => {
        if (!resetToken) return
        const result = await resetPassword(resetToken, values.password)
        if (result.success) {
            resetEmailStore.clear()
            setResetSuccessful(true)
        }
    }

    if (resetSuccessful) {
        return <ResetPasswordSuccessMessage />
    }

    return (
        <div>
            <h1 className={`${space_grotesk.className} text-brand-secondary-9 text-2xl md:text-3xl font-bold mb-2 text-center`}>
                {step === "new-password" ? "Create new password" : "Password reset"}
            </h1>

            <p className="text-brand-neutral-7 text-sm text-center">
                {step === "new-password"
                    ? "Set your new password to access the Admin dashboard."
                    : <>
                        We sent a code to {email ? maskEmail(email) : "your email"}.{" "}
                        {timerExpired ? (
                            <>
                                Didn&apos;t receive it?{" "}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="font-medium text-brand-accent-6 mx-1 disabled:opacity-50 transition-opacity"
                                >
                                    {resending ? "Resending..." : "Resend code"}
                                </button>
                            </>
                        ) : (
                            <span className="text-brand-neutral-5 text-xs ml-1">
                                Resend available once the timer expires.
                            </span>
                        )}
                    </>
                }
            </p>

            {step === "otp" && (
                <form
                    onSubmit={handleOtpSubmit}
                    className="mt-8 space-y-10 flex justify-center items-center flex-col"
                >
                    <OTPInput otp={otp} setOtp={(v) => {
                        setOtp(v)
                        setOtpError(null)
                    }} />

                    {otpError && (
                        <p className="flex items-center gap-1.5 text-sm text-red-500 -mt-6">
                            <Icon icon="bx:error-alt" className="size-4 shrink-0" />
                            {otpError}
                        </p>
                    )}

                    <CountdownTimer
                        key={timerKey}
                        initialSeconds={OTP_EXPIRY_SECONDS}
                        onExpire={() => setTimerExpired(true)}
                    />

                    <ActionButton1
                        buttonText={otpSubmitting ? "Verifying..." : "Continue"}
                        isDisabled={otpSubmitting}
                        isLoading={otpSubmitting}
                        className="w-full"
                        buttonType="submit"
                    />
                </form>
            )}

            {step === "new-password" && (
                <form
                    onSubmit={handleSubmit(onResetSubmit)}
                    className="mt-8 space-y-6"
                >
                    <div>
                        <label className="text-sm font-medium text-neutral-10 mb-2 block">
                            New Password
                        </label>
                        <PasswordInput1
                            {...register("password")}
                            error={errors.password?.message}
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-neutral-10 mb-2 block">
                            Confirm Password
                        </label>
                        <PasswordInput1
                            {...register("confirmPassword")}
                            error={errors.confirmPassword?.message}
                            autoComplete="new-password"
                        />
                    </div>

                    <ActionButton1
                        buttonText={isSubmitting ? "Saving..." : "Create Password"}
                        className="mt-6 w-full"
                        isDisabled={isSubmitting}
                        buttonType="submit"
                        isLoading={isSubmitting}
                    />
                </form>
            )}

            <p className="text-sm text-center text-brand-secondary-9 mt-6">
                Remembered Password?{" "}
                <Link href={AUTH_LINKS.SIGN_IN.href} className="text-brand-accent-6 font-medium hover:underline">
                    Sign In
                </Link>
            </p>
        </div>
    )
}