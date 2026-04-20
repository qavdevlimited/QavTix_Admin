import UserProfilePageCW from "@/components/page-content-wrappers/UserProfilePageCW"
import { getAdminUserProfile, getAdminUserCards, getAdminUserChart, getAdminUserOrders } from "@/actions/user-management"

interface UserProfilePageProps {
    params: Promise<{ user_id: string }>
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
    const { user_id } = await params

    const [{ data: profile }, { cards }, { chart }, initialOrders] = await Promise.all([
        getAdminUserProfile(user_id),
        getAdminUserCards(user_id),
        getAdminUserChart(user_id),
        getAdminUserOrders(user_id),
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