"use server";

import { cookies } from "next/headers";
import { getAdminHosts, getAdminHostCards, getAdminPendingHosts, toggleHostSuspension, giftHostBadge, forceHostPayout, toggleHostAutoPayout, approveHostVerification, declineHostVerification, getHostProfile, getHostEarningsCards, getHostChart, getHostEvents, featureHostEvent, suspendHostEvent, deleteHostEvent, searchHosts } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("admin_access_token")?.value;
}

export async function getAdminHostsClient(...args: any[]) {
    return (getAdminHosts as any)(await getToken(), ...args);
}

export async function getAdminHostCardsClient(...args: any[]) {
    return (getAdminHostCards as any)(await getToken(), ...args);
}

export async function getAdminPendingHostsClient(...args: any[]) {
    return (getAdminPendingHosts as any)(await getToken(), ...args);
}

export async function toggleHostSuspensionClient(...args: any[]) {
    return (toggleHostSuspension as any)(await getToken(), ...args);
}

export async function giftHostBadgeClient(...args: any[]) {
    return (giftHostBadge as any)(await getToken(), ...args);
}

export async function forceHostPayoutClient(...args: any[]) {
    return (forceHostPayout as any)(await getToken(), ...args);
}

export async function toggleHostAutoPayoutClient(...args: any[]) {
    return (toggleHostAutoPayout as any)(await getToken(), ...args);
}

export async function approveHostVerificationClient(...args: any[]) {
    return (approveHostVerification as any)(await getToken(), ...args);
}

export async function declineHostVerificationClient(...args: any[]) {
    return (declineHostVerification as any)(await getToken(), ...args);
}

export async function getHostProfileClient(...args: any[]) {
    return (getHostProfile as any)(await getToken(), ...args);
}

export async function getHostEarningsCardsClient(...args: any[]) {
    return (getHostEarningsCards as any)(await getToken(), ...args);
}

export async function getHostChartClient(...args: any[]) {
    return (getHostChart as any)(await getToken(), ...args);
}

export async function getHostEventsClient(...args: any[]) {
    return (getHostEvents as any)(await getToken(), ...args);
}

export async function featureHostEventClient(...args: any[]) {
    return (featureHostEvent as any)(await getToken(), ...args);
}

export async function suspendHostEventClient(...args: any[]) {
    return (suspendHostEvent as any)(await getToken(), ...args);
}

export async function deleteHostEventClient(...args: any[]) {
    return (deleteHostEvent as any)(await getToken(), ...args);
}

export async function searchHostsClient(...args: any[]) {
    return (searchHosts as any)(await getToken(), ...args);
}
