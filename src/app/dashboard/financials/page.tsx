import FinancialsPageCW from "@/components/page-content-wrappers/FinancialsPageCW"
import {
    getAdminFinancialCards,
    getAdminPendingPayouts,
    getAdminApprovedPayouts,
    getAdminMarketplaceListings,
    getAdminFeaturedPayments,
    getAdminSubscriptions,
} from "@/actions/financials"
import { cookies } from "next/headers";

export const metadata = {
    title: "Financials | QavTix Admin",
    description: "Manage payouts, resale orders, featured payments, and subscriptions.",
}

export default async function FinancialsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;

    const [
        { cards },
        pendingPayouts,
        approvedPayouts,
        marketplace,
        featuredPayments,
        subscriptions,
    ] = await Promise.all([
        getAdminFinancialCards(token),
        getAdminPendingPayouts(token),
        getAdminApprovedPayouts(token),
        getAdminMarketplaceListings(token),
        getAdminFeaturedPayments(token),
        getAdminSubscriptions(token),
    ])

    return (
        <FinancialsPageCW
            initialCards={cards}
            initialResaleCards={null}
            initialPendingPayouts={pendingPayouts}
            initialApprovedPayouts={approvedPayouts}
            initialMarketplace={marketplace}
            initialFeaturedPayments={featuredPayments}
            initialSubscriptions={subscriptions}
        />
    )
}