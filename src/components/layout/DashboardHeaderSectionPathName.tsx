"use client"

import { space_grotesk } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { DASHBOARD_NAVIGATION_LINKS } from '@/enums/navigation';


const useDashboardSegment = () => {

    const pathName = usePathname()
    
    if (pathName === "/dashboard" || pathName === "/dashboard/") {
        return "Dashboard"
    }
    // Convert the Record into an array so we can search it
    const navLinks = Object.values(DASHBOARD_NAVIGATION_LINKS);

    // Find the link that matches the start of the current path
    // We sort by length descending so that specific long paths match before the base "/dashboard"
    const activeLink = navLinks
        .sort((a, b) => b.href.length - a.href.length)
        .find(link => pathName.startsWith(link.href));

    // Return the label if found, otherwise default to "Dashboard"
    return activeLink?.label || "Dashboard";
}

export function DashboardHeaderSectionPathName() {
    const label = useDashboardSegment();
    
    return (
        <div className="relative basis-2/6 w-2/6">
            <h1 className={cn(
                space_grotesk.className,
                'capitalize text-xl text-brand-secondary-9 font-bold'
            )}>
                {label}
            </h1>
        </div>
    )
}