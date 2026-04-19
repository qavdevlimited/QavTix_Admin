import DesktopHeaderSection from "@/components/layout/DesktopHeaderSection"
import DesktopSideNav from "@/components/layout/DesktopSideNav"
import MobileHeaderSection from "@/components/layout/MobileHeaderSection"
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider"
import { Metadata } from "next"
import { ReactNode } from "react"
import PopUpsRenderer from "@/components/modals/"


type LayoutProps = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'Qavtix Admin - Under-development'
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <ReduxStoreProvider>
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
                            </div>
                        </div>
                    </div>
                </div>
                <PopUpsRenderer />
            </ReduxStoreProvider>
        </>
    )
}