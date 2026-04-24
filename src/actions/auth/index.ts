"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
    ADMIN_FORGOT_PASSWORD_ENDPOINT,
    ADMIN_VERIFY_RESET_OTP_ENDPOINT,
    ADMIN_RESET_PASSWORD_ENDPOINT,
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"

interface ActionResult {
    success:  boolean
    message?: string
}

interface VerifyOtpResult {
    success:  boolean
    token?:   string
    message?: string
}

export const logOut = async () => {
    const cookiesStore = await cookies()
    cookiesStore.delete("admin_access_token")
    cookiesStore.delete("admin_refresh_token")
    redirect(process.env.NEXT_PUBLIC_APP_DOMAIN || "/")
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_FORGOT_PASSWORD_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ email }),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[requestPasswordReset] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true }

    } catch (err) {
        console.log("[requestPasswordReset] error:", err)
        return { success: false, message: "Request failed. Please try again." }
    }
}

export async function verifyOtp(email: string, otp: string): Promise<VerifyOtpResult> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_VERIFY_RESET_OTP_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ email, otp }),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[verifyOtp] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true, token: json.data?.reset_token ?? json.reset_token }

    } catch (err) {
        console.log("[verifyOtp] error:", err)
        return { success: false, message: "Verification failed. Please try again." }
    }
}

export async function resetPassword(token: string, newPassword: string): Promise<ActionResult> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_RESET_PASSWORD_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ token, new_password: newPassword }),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[resetPassword] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true }

    } catch (err) {
        console.log("[resetPassword] error:", err)
        return { success: false, message: "Reset failed. Please try again." }
    }
}