import DesktopHeaderSection from "@/components/layout/DesktopHeaderSection"
import DesktopSideNav from "@/components/layout/DesktopSideNav"
import MobileHeaderSection from "@/components/layout/MobileHeaderSection"
import { ReactNode } from "react"

type LayoutProps = {
    children: ReactNode
    modal: ReactNode
}

export default async function Layout({ children, modal }: LayoutProps) {

    return (
        <>
            <div className="flex justify-end min-h-screen bg-gray-100/80">
                {/* Fixed Sidebar - Takes no space in flex layout */}
                <DesktopSideNav />

                {/* Main Content Area */}
                <div className="w-full lg:w-[calc(100%-240px)] overflow-x-hidden">
                    {/* Scrollable Content */}
                    <div className="w-full">
                        <MobileHeaderSection />
                        <div className="relative w-full lg:pt-28 px-4 md:px-6">
                            {/* Desktop Header - Fixed at top */}
                            <DesktopHeaderSection />
                            {children}
                            {modal}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}