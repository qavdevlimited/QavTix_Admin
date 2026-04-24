"use client"

import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1";
import TextInput1 from "@/components/custom-utils/inputs/TextInput1";
import { AUTH_LINKS } from "@/enums/navigation";
import { space_grotesk } from "@/lib/fonts";
import { requestPasswordReset } from "@/actions/auth";
import { resetEmailStore } from "@/lib/local-store/reset-email-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    email: z.email("Enter your email address"),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {

    const router = useRouter()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async ({ email }: FormValues) => {
        setSubmitError(null)

        const result = await requestPasswordReset(email)

        if (result.success) {
            resetEmailStore.set(email)
            router.push(AUTH_LINKS.RESET_PASSWORD.href)
        } else {
            setSubmitError(result.message ?? "Something went wrong. Please try again.")
        }
    }

    return (
        <div>
            <h1 className={`${space_grotesk.className} text-brand-secondary-9 text-2xl md:text-3xl font-bold mb-2 text-center`}>Forgot Password?</h1>
            <p className="text-brand-neutral-7 text-sm text-center">Enter the email address you used signing up, we&apos;ll send you reset instructions.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-8">
                <div>
                    <label className="text-sm font-medium text-neutral-10 mb-2 block">Email Address</label>
                    <TextInput1
                        placeholder="Enter your email address"
                        {...register("email")}
                        error={errors.email?.message}
                        onInput={() => setSubmitError(null)}
                    />

                    {submitError && (
                        <p className="flex items-center gap-1.5 mt-2 text-sm text-red-500">
                            <Icon icon="mage:exclamation-circle" className="size-4 shrink-0" />
                            {submitError}
                        </p>
                    )}
                </div>

                <ActionButton1
                    buttonText={isSubmitting ? "Sending..." : "Continue"}
                    className="mt-6 w-full"
                    buttonType="submit"
                    isDisabled={isSubmitting}
                    isLoading={isSubmitting}
                />

                <p className="text-sm text-center text-brand-secondary-9">
                    Remembered Password?{" "}
                    <Link href={AUTH_LINKS.SIGN_IN.href} className="text-brand-accent-6 font-medium hover:underline">
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    )
}