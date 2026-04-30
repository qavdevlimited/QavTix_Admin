"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon } from "@iconify/react"
import Logo from "./Logo"
import AuthUserDetails from "./AuthUserDetails"
import { cn } from "@/lib/utils"
import { ADMIN_SETTINGS_SUB_LINKS, DASHBOARD_NAVIGATION_LINKS } from "@/enums/navigation"


function DesktopSideNav() {

    const pathName = usePathname()

    // Check if we're in the settings section
    const isSettingsActive = pathName?.startsWith(DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href)

    const isActiveRoute = (route: string) => {
        if (!pathName) return false;

        if (route === DASHBOARD_NAVIGATION_LINKS.DASHBOARD.href) {
            return pathName === DASHBOARD_NAVIGATION_LINKS.DASHBOARD.href;
        }

        return pathName === route || pathName.startsWith(`${route}/`)
    }

    return (
        <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-60 flex-col justify-between gap-8 bg-white p-4 py-6 text-sm font-medium text-brand-secondary-9 border-r border-gray-100 overflow-y-auto">
            <div>
                <Logo width={120} />
                <ul className="mt-8 flex flex-col gap-2">
                    {Object.values(DASHBOARD_NAVIGATION_LINKS).map((v) => {
                        const isActive = isActiveRoute(v.href)
                        const isSettingsLink = v.href === DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href

                        return (
                            <li key={v.href} className="flex flex-col">
                                <Link
                                    href={isSettingsLink ? ADMIN_SETTINGS_SUB_LINKS[0].href : v.href}
                                    className={cn(
                                        "relative flex items-center gap-2 text-sm px-3 min-h-12 rounded-md transition-all duration-200",
                                        isActive || (isSettingsLink && isSettingsActive)
                                            ? "bg-brand-primary-1 text-brand-primary-6"
                                            : "hover:bg-brand-primary-1/50 text-brand-secondary-9 font-normal"
                                    )}
                                >
                                    <Icon icon={v.icon || ""} width="20" height="20" />
                                    <span>{v.label}</span>

                                    {isActive && (
                                        <Icon
                                            icon="basil:caret-right-outline"
                                            width="24"
                                            height="24"
                                            className={cn(
                                                "absolute right-1 transition-transform duration-300",
                                                isSettingsActive && "rotate-90"
                                            )}
                                        />
                                    )}
                                </Link>

                                {/* Dropdown Menu: Only for settings link */}
                                {isSettingsLink && (
                                    <div className={cn(
                                        "grid transition-all duration-300 ease-in-out overflow-hidden",
                                        isSettingsActive ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                                    )}>
                                        <div className="relative ml-3 flex flex-col min-h-0 space-y-1.5">
                                            <div className="absolute left-0 top-0 h-[88%] my-auto bottom-0 w-px bg-brand-neutral-5" />
                                            <ul className="flex flex-col w-full">
                                            {ADMIN_SETTINGS_SUB_LINKS.map((sub) => {
                                                const isSubActive = pathName === sub.href
                                                return (
                                                    <li key={sub.href} className="relative flex items-center">
                                                        {/* Connecting Dot */}
                                                        <div className={cn(
                                                            "absolute -left-[3.5px] z-10 size-2 rounded-full border transition-colors border-brand-secondary-3/50 bg-brand-secondary-2"
                                                        )} />

                                                        <Link
                                                            href={sub.href}
                                                            className={cn(
                                                                "flex-1 py-3 ml-3 pl-3 text-xs transition-colors rounded-md",
                                                                isSubActive
                                                                    ? "text-brand-secondary-9 bg-brand-accent-1 font-medium"
                                                                    : "text-brand-secondary-7 hover:text-brand-secondary-8 hover:bg-brand-accent-1/40"
                                                            )}
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
            <AuthUserDetails />
        </nav>
    )
}

export default DesktopSideNav