import Image from "next/image";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import SystemStatus from "@/lib/features/export/system-status/SystemStatus";
import DashboardStatusMetricsCard from "../cards/DashboardStatusMetricsCard";
import { dashboardStatusMetricsCardsConfig } from "../cards/resources/configs/dashboard-metrics";
import { formatPrice } from "@/helper-fns/formatPrice";
import { useAppSelector } from "@/lib/redux/hooks";
import { useIsMounted } from "@/custom-hooks/UseIsMounted";
import { getGreeting } from "@/helper-fns/date-utils";

interface OverviewSectionProps {
    sectionTwo?: AdminDashboardSectionTwo;
}

export default function OverviewSection({ sectionTwo }: OverviewSectionProps) {

    const { user } = useAppSelector(store => store.authUser)
    const statusMetricsData = dashboardStatusMetricsCardsConfig.map(config => {
        let value = "0";
        if (config.id === 'active-users') value = sectionTwo?.active_users.toString() ?? "0";
        if (config.id === 'active-sellers') value = sectionTwo?.active_sellers.toString() ?? "0";
        if (config.id === 'monthly-gmv') value = formatPrice(sectionTwo?.sales_this_month ?? 0, user?.currency, true, true);
        return { ...config, value }
    })

    const isMounted = useIsMounted()

    return (
        <>
            <section className="w-full">
                <div className="relative space-y-6 px-6 py-6 md:px-10 min-h-40 bg-linear-to-br from-brand-primary-5.2 to-brand-primary w-full rounded-xl">

                    <div className="text-white relative z-20">
                        <SystemStatus status="OPERATIONAL" />
                        <h3 className={cn(
                            space_grotesk.className,
                            'capitalize text-lg md:text-2xl leading-tight font-bold',
                            'drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                        )}>
                            {getGreeting()} {isMounted && user?.full_name.split(" ")[0]}!
                        </h3>
                        <p className="text-xs md:text-sm mt-2 opacity-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                            Here is what's happening on your platform today.
                        </p>
                    </div>

                    <div className="hidden md:grid relative z-20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 lg:max-w-3xl">
                        {statusMetricsData.map(config => (
                            <DashboardStatusMetricsCard key={config.id} config={config} />
                        ))}
                    </div>



                    {/* Background Elements */}
                    <Image
                        src="/images/illustrations/c428cb7bce2f512ad472f5ca3f06ccca12e0afc8.png"
                        alt="task management"
                        width={400}
                        height={400}
                        className="absolute z-10 right-0 w-78 h-90 object-cover -bottom-16.75"
                    />
                    <div className="overflow-hidden">
                        <div
                            className="absolute hidden md:block right-0 rounded-xl opacity-75 top-0 bottom-0 w-[90%] h-full bg-no-repeat bg-contain bg-right"
                            style={{
                                backgroundImage: "url('/images/vectors/logo-bg-element.svg')"
                            }}
                        />
                    </div>
                </div>

                {/* Status Metric Cards */}
                <div className="md:hidden grid relative z-20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 lg:max-w-3xl">
                    {statusMetricsData.map(config => (
                        <DashboardStatusMetricsCard key={config.id} config={config} />
                    ))}
                </div>
            </section>
        </>
    )
}