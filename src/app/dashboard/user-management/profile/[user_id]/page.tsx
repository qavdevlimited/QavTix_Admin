import UserProfilePageCW from "@/components/page-content-wrappers/UserProfilePageCW"
import { getAdminUserProfile, getAdminUserCards, getAdminUserChart, getAdminUserOrders } from "@/actions/user-management/index"
import { cookies } from "next/headers";

interface UserProfilePageProps {
    params: Promise<{ user_id: string }>
}

export default async function UserProfilePage(props: UserProfilePageProps) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;
    const { user_id } = await props.params

    const [{ data: profile }, { cards }, { chart }, initialOrders] = await Promise.all([
        getAdminUserProfile(token, user_id),
        getAdminUserCards(token, user_id),
        getAdminUserChart(token, user_id),
        getAdminUserOrders(token, user_id),
    ])

    return (
        <UserProfilePageCW
            userId={user_id}
            initialProfile={profile}
            initialCards={cards}
            initialChart={chart}
            initialOrders={initialOrders}
        />
    )
}