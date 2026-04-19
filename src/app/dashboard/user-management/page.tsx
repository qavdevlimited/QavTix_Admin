import UserManagementPageCW from "@/components/page-content-wrappers/UserManagementPageCW";
import {
    getAdminUsers,
    getAdminUsersCards,
    getAdminAffiliates,
    getAdminAffiliatesCards,
    getAdminWithdrawals,
} from "@/actions/user-management";

export default async function UserManagementPage() {
    const [
        usersResult,
        usersCardsResult,
        affiliatesResult,
        affiliatesCardsResult,
        withdrawalsData,
    ] = await Promise.all([
        getAdminUsers(),
        getAdminUsersCards(),
        getAdminAffiliates(),
        getAdminAffiliatesCards(),
        getAdminWithdrawals(),
    ])

    return (
        <UserManagementPageCW
            initialUsers={usersResult.data}
            initialUserCards={usersCardsResult.cards}
            initialAffiliates={affiliatesResult.data}
            initialAffiliateCards={affiliatesCardsResult.cards}
            initialWithdrawals={withdrawalsData}
        />
    )
}