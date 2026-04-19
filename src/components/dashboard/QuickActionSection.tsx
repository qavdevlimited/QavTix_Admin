import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { QUICK_ACTIONS } from "../cards/resources/configs/quick-actions-config";
import QuickActionCard from "../cards/QuickActionCard";
import { buildQuickActionMetricsFromConfig } from "@/helper-fns/buildMetricsConfig";

export default function QuickActionsSection({ sectionThree }: { sectionThree?: AdminDashboardSectionThree }) {

    const apiData = {
        'manage-users': `+${sectionThree?.users_this_week ?? 0} this week`,
        'review-sellers': `+${sectionThree?.hosts_this_week ?? 0} this week`,
        'moderate-events': `${sectionThree?.events_this_week ?? 0} this week`,
        'process-payouts': `${sectionThree?.payouts_this_week ?? 0} Pending`
    };

    const dynamicQuickActions = buildQuickActionMetricsFromConfig(QUICK_ACTIONS, apiData);

    return (
        <section>
            <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>Quick Actions</h2>

            <div className="grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
                {dynamicQuickActions.map((action: any) => (
                    <QuickActionCard key={action.id} action={action} />
                ))}
            </div>
        </section>
    )
}