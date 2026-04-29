"use server";

import { cookies } from "next/headers";
import { sendEmailCampaign, sendSingleEmail, sendSingleSms } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("admin_access_token")?.value;
}

export async function sendEmailCampaignClient(...args: any[]) {
    return (sendEmailCampaign as any)(await getToken(), ...args);
}

export async function sendSingleEmailClient(...args: any[]) {
    return (sendSingleEmail as any)(await getToken(), ...args);
}

export async function sendSingleSmsClient(...args: any[]) {
    return (sendSingleSms as any)(await getToken(), ...args);
}
