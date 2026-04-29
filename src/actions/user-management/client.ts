"use server";

import { cookies } from "next/headers";
import { getAdminUsers, getAdminUsersCards, getAdminAffiliates, getAdminAffiliatesCards, getAdminWithdrawals, toggleUserSuspension, getAdminUserProfile, getAdminUserCards, getAdminUserChart, getAdminUserOrders } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("admin_access_token")?.value;
}

export async function getAdminUsersClient(...args: any[]) {
    return (getAdminUsers as any)(await getToken(), ...args);
}

export async function getAdminUsersCardsClient(...args: any[]) {
    return (getAdminUsersCards as any)(await getToken(), ...args);
}

export async function getAdminAffiliatesClient(...args: any[]) {
    return (getAdminAffiliates as any)(await getToken(), ...args);
}

export async function getAdminAffiliatesCardsClient(...args: any[]) {
    return (getAdminAffiliatesCards as any)(await getToken(), ...args);
}

export async function getAdminWithdrawalsClient(...args: any[]) {
    return (getAdminWithdrawals as any)(await getToken(), ...args);
}

export async function toggleUserSuspensionClient(...args: any[]) {
    return (toggleUserSuspension as any)(await getToken(), ...args);
}

export async function getAdminUserProfileClient(...args: any[]) {
    return (getAdminUserProfile as any)(await getToken(), ...args);
}

export async function getAdminUserCardsClient(...args: any[]) {
    return (getAdminUserCards as any)(await getToken(), ...args);
}

export async function getAdminUserChartClient(...args: any[]) {
    return (getAdminUserChart as any)(await getToken(), ...args);
}

export async function getAdminUserOrdersClient(...args: any[]) {
    return (getAdminUserOrders as any)(await getToken(), ...args);
}
