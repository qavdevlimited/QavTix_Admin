"use server"

import { cookies } from "next/headers"
import {
    getAdminFinancialCards,
    getAdminResaleCards,
    getAdminPendingPayouts,
    getAdminApprovedPayouts,
    getAdminMarketplaceListings,
    getAdminFeaturedPayments,
    getAdminSubscriptions,
    approvePayout,
    declinePayout,
    forcePayout,
} from "./index"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("admin_access_token")?.value
}

export async function getAdminFinancialCardsClient(params?: Record<string, string>) {
    return getAdminFinancialCards(await getToken(), params)
}

export async function getAdminResaleCardsClient() {
    return getAdminResaleCards(await getToken())
}

export async function getAdminPendingPayoutsClient(params?: Record<string, any>) {
    return getAdminPendingPayouts(await getToken(), params)
}

export async function getAdminApprovedPayoutsClient(params?: Record<string, any>) {
    return getAdminApprovedPayouts(await getToken(), params)
}

export async function getAdminMarketplaceListingsClient(params?: Record<string, any>) {
    return getAdminMarketplaceListings(await getToken(), params)
}

export async function getAdminFeaturedPaymentsClient(params?: Record<string, any>) {
    return getAdminFeaturedPayments(await getToken(), params)
}

export async function getAdminSubscriptionsClient(params?: Record<string, any>) {
    return getAdminSubscriptions(await getToken(), params)
}

// Mutations read their own cookies internally
export { approvePayout, declinePayout, forcePayout }
