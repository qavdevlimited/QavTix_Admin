"use client"

import CountdownTimer from "@/components/auth-pages/CountDownTimer";
import ResetPasswordSuccessMessage from "@/components/auth-pages/ResetPasswordSuccessMessage";
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1";
import OTPInput from "@/components/custom-utils/inputs/OTPInput";
import PasswordInput1 from "@/components/custom-utils/inputs/PasswordInput";
import { AUTH_LINKS } from "@/enums/navigation";
import { maskEmail } from "@/helper-fns/maskEmail";
import { space_grotesk } from "@/lib/fonts";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage(){

    const [hasValidToken, setHasValidToken] = useState(true)
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
    const [expiresIn, setExpiresIn] = useState(298) // 4 minutes 58 seconds
    const [resetSuccessful, setResetSuccessful] = useState(false)

    return (
        <main>
           <ResetPasswordSuccessMessage />
        </main>
    )
}