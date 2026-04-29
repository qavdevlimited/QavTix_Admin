"use server";

import { cookies } from "next/headers";
import { getAdminEvents, getAdminEventCards, getAdminEventDetail, getAdminEventAttendees } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("admin_access_token")?.value;
}

export async function getAdminEventsClient(...args: any[]) {
    return (getAdminEvents as any)(await getToken(), ...args);
}

export async function getAdminEventCardsClient(...args: any[]) {
    return (getAdminEventCards as any)(await getToken(), ...args);
}

export async function getAdminEventDetailClient(...args: any[]) {
    return (getAdminEventDetail as any)(await getToken(), ...args);
}

export async function getAdminEventAttendeesClient(...args: any[]) {
    return (getAdminEventAttendees as any)(await getToken(), ...args);
}
