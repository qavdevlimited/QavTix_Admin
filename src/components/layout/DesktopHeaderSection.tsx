import Link from "next/link";
import RegionSwitcher from "../settings/RegionSwitcher";
import AuthUserDetailsWithActiveStatus from "./AuthUserDetailsWithActiveStatus";
import { DashboardHeaderSectionPathName } from "./DashboardHeaderSectionPathName";
import { NotificationBell } from "./NotificationBell";



export default function DesktopHeaderSection(){
    return (
        <header className="hidden lg:flex bg-white py-10 items-center px-6 absolute mx-auto h-24.5 border-b-2 border-b-gray-200/70 top-0 left-0 w-full justify-between">
            <DashboardHeaderSectionPathName />

            <div className="flex items-center gap-4 w-fit">
                <RegionSwitcher />
                <NotificationBell />
                <Link href="/" className="text-[#585562] text-sm">Need Help?</Link>
                <hr className="w-[1.5px] h-8 bg-brand-secondary-3" />
                <AuthUserDetailsWithActiveStatus />
            </div>
        </header>
    )
}