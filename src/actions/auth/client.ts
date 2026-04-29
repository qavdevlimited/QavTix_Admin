"use server";

import { cookies } from "next/headers";
import { requestPasswordReset, verifyOtp, resetPassword } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("admin_access_token")?.value;
}

export async function requestPasswordResetClient(...args: any[]) {
    return (requestPasswordReset as any)(await getToken(), ...args);
}

export async function verifyOtpClient(...args: any[]) {
    return (verifyOtp as any)(await getToken(), ...args);
}

export async function resetPasswordClient(...args: any[]) {
    return (resetPassword as any)(await getToken(), ...args);
}
