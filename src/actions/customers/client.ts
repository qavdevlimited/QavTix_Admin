"use server";

import { cookies } from "next/headers";
import { getEventAttendees } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("admin_access_token")?.value;
}

export async function getEventAttendeesClient(...args: any[]) {
    return (getEventAttendees as any)(await getToken(), ...args);
}
