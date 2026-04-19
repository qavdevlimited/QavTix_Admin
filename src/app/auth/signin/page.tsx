"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";

import TextInput1 from "@/components/custom-utils/inputs/TextInput1";
import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";
import { adminSignInSchema, AdminSignInValues } from "@/schemas/admin-signin.schema";
import PasswordInput1 from "@/components/custom-utils/inputs/PasswordInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1";
import { AUTH_LINKS } from "@/enums/navigation";
import OTPInput from "@/components/custom-utils/inputs/OTPInput";
import AdminSignInSuccess from "@/components/auth-pages/AdminSignInSuccess";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/slices/authUserSlice";
import { showAlert } from "@/lib/redux/slices/alertSlice";


export default function AdminSignInPage() {
    const dispatch = useAppDispatch();
    const [step, setStep] = useState<1 | 2>(1);
    const [tempToken, setTempToken] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [isVerifying, setIsVerifying] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<AdminSignInValues>({
        resolver: zodResolver(adminSignInSchema),
        defaultValues: {
            rememberDevice: false,
        }
    });

    const onSubmit: SubmitHandler<AdminSignInValues> = async (data) => {
        setSubmitError(null);
        try {
            const res = await axios.post("/api/auth/login", data);
            if (res.data.temp_token) {
                setTempToken(res.data.temp_token);
                setStep(2);
            }
        } catch (error) {
            let message = "Login failed"
            if (error instanceof AxiosError) {
                message = error.response?.data?.message;
            } else {
                message = "An unexpected error occurred";
            }
            setSubmitError(message);
            dispatch(showAlert({
                description: message,
                variant: "destructive",
                title: ""
            }))
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) return;

        setSubmitError(null);
        setIsVerifying(true);

        try {
            const res = await axios.post("/api/auth/verify-otp", {
                temp_token: tempToken,
                otp: otpString
            });
            if (res.data.user) {
                dispatch(setUser(res.data.user));
            }
            setShowSuccess(true);
        } catch (error) {
            if (error instanceof AxiosError) {
                setSubmitError(error.response?.data?.message || "Verification failed");
            } else {
                setSubmitError("An unexpected error occurred");
            }
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div>
            <div className="space-y-12">
                <header className="text-center space-y-2">
                    <h1 className={cn(space_grotesk.className, "text-3xl font-bold text-brand-secondary-9")}>
                        {step === 1 ? "Welcome back!" : "Enter OTP"}
                    </h1>
                    {step === 2 && (
                        <p className="text-brand-neutral-7 text-sm max-w-[320px] mx-auto mt-2">
                            Please enter the 6-digit code sent to your email.
                        </p>
                    )}
                </header>

                {step === 1 ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brand-neutral-10 block">Email Address</label>
                            <TextInput1
                                type="email"
                                placeholder="Input"
                                error={errors.email?.message}
                                {...register("email")}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brand-neutral-10 block">Password</label>
                            <PasswordInput1
                                placeholder="Enter Password"
                                error={errors.password?.message}
                                {...register("password")}
                            />
                        </div>

                        {/* Remember Device */}
                        <div className="flex items-center gap-3 group cursor-pointer w-fit">
                            <Controller
                                name="rememberDevice"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <label htmlFor="remember" className="text-sm text-brand-neutral-10 flex items-center gap-1.5 cursor-pointer">
                                Remember this device
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            aria-label="Split payment info"
                                            className="text-brand-neutral-6 hover:text-brand-neutral-8 transition-colors"
                                        >
                                            <Icon icon="carbon:information" className="size-4 text-brand-accent-6" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-brand-secondary-8">
                                        <p>For your security, don’t use this on shared or public devices.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </label>
                        </div>

                        {submitError && (
                            <p className="flex items-center gap-1.5 mt-2 text-sm text-red-500">
                                <Icon icon="mage:exclamation-circle" className="size-4 shrink-0" />
                                {submitError}
                            </p>
                        )}

                        {/* Submit Button */}
                        <ActionButton1
                            buttonText="Sign In"
                            buttonType="submit"
                            className="w-full mt-8"
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting}
                        />

                        <p className="text-sm text-center text-brand-secondary-9">
                            Forgot Password? <Link href={AUTH_LINKS.FORGOT_PASSWORD.href} className="text-brand-accent-6 font-medium hover:underline">Recover</Link>
                        </p>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <OTPInput otp={otp} setOtp={setOtp} />

                        {submitError && (
                            <p className="flex items-center justify-center gap-1.5 mt-2 text-sm text-red-500">
                                <Icon icon="mage:exclamation-circle" className="size-4 shrink-0" />
                                {submitError}
                            </p>
                        )}

                        <ActionButton1
                            buttonText="Verify OTP"
                            buttonType="button"
                            action={handleVerifyOtp}
                            className="w-full mt-8"
                            isLoading={isVerifying}
                            isDisabled={isVerifying || otp.join('').length !== 6}
                        />

                        <p className="text-sm text-center text-brand-secondary-9">
                            Didn't receive code? <button type="button" onClick={handleSubmit(onSubmit)} className="text-brand-accent-6 font-medium hover:underline">Resend</button>
                        </p>
                    </div>
                )}
            </div>

            <AdminSignInSuccess open={showSuccess} />
        </div>
    )
}