import FinancialsPageCW from "@/components/page-content-wrappers/FinancialsPageCW"
import {
    getAdminFinancialCards,
    getAdminPendingPayouts,
    getAdminApprovedPayouts,
    getAdminMarketplaceListings,
    getAdminFeaturedPayments,
    getAdminSubscriptions,
} from "@/actions/financials"

export const metadata = {
    title: "Financials | QavTix Admin",
    description: "Manage payouts, resale orders, featured payments, and subscriptions.",
}

export default async function FinancialsPage() {

    const [
        { cards },
        pendingPayouts,
        approvedPayouts,
        marketplace,
        featuredPayments,
        subscriptions,
    ] = await Promise.all([
        getAdminFinancialCards(),
        getAdminPendingPayouts(),
        getAdminApprovedPayouts(),
        getAdminMarketplaceListings(),
        getAdminFeaturedPayments(),
        getAdminSubscriptions(),
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