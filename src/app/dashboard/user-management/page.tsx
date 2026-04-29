import UserManagementPageCW from "@/components/page-content-wrappers/UserManagementPageCW";
import {
    getAdminUsers,
    getAdminUsersCards,
    getAdminAffiliates,
    getAdminAffiliatesCards,
    getAdminWithdrawals,
} from "@/actions/user-management";
import { cookies } from "next/headers";

export default async function UserManagementPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;
    const [
        usersResult,
        usersCardsResult,
        affiliatesResult,
        affiliatesCardsResult,
        withdrawalsData,
    ] = await Promise.all([
        getAdminUsers(token),
        getAdminUsersCards(token),
        getAdminAffiliates(token),
        getAdminAffiliatesCards(token),
        getAdminWithdrawals(token),
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