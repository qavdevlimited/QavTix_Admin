"use server"

import { redirect } from "next/navigation"
import {
    ADMIN_FORGOT_PASSWORD_ENDPOINT,
    ADMIN_VERIFY_RESET_OTP_ENDPOINT,
    ADMIN_RESET_PASSWORD_ENDPOINT,
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cookies } from "next/headers"

export const logOut = async () => {
    const cookieStore = await cookies()
    cookieStore.delete("admin_access_token")
    cookieStore.delete("admin_refresh_token")
    redirect(process.env.NEXT_PUBLIC_APP_DOMAIN || "/")
}

export async function requestPasswordReset(email: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_FORGOT_PASSWORD_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ email }),
        })
        const json = await res.json()
        if (!res.ok) return { success: false, message: handleApiError(json) }
        return { success: true }
    } catch {
        return { success: false, message: "Request failed. Please try again." }
    }
}

export async function verifyOtp(email: string, otp: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_VERIFY_RESET_OTP_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ email, otp }),
        })
        const json = await res.json()
        if (!res.ok) return { success: false, message: handleApiError(json) }
        return { success: true, token: json.data?.reset_token ?? json.reset_token }
    } catch {
        return { success: false, message: "Verification failed. Please try again." }
    }
}

export async function resetPassword(token: string, newPassword: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ADMIN_RESET_PASSWORD_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ token, new_password: newPassword }),
        })
        const json = await res.json()
        if (!res.ok) return { success: false, message: handleApiError(json) }
        return { success: true }
    } catch {
        return { success: false, message: "Reset failed. Please try again." }
    }
}
