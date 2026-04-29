import AuthBackgroundDecorations from "@/components/auth-pages/AuthDecorations";
import SecurityBadges from "@/components/auth-pages/SecurityBadges";
import AuthPagesFooter from "@/components/layout/AuthPagesFooter";
import AuthPagesHeader from "@/components/layout/AuthPagesHeader";
import { Suspense } from "react";

export default function AuthPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-white">
      <Suspense fallback={null}>
        <AuthPagesHeader />
      </Suspense>

      {/* Main Content Area */}
      <main className="flex-1 z-10 flex flex-col space-y-12 items-center justify-center w-full py-12 pb-16 px-6">
        <Suspense fallback={null}>
          <SecurityBadges />
        </Suspense>

        <div className="max-w-full w-[480px]">
          {children}
        </div>
      </main>

      <Suspense fallback={null}>
        <AuthPagesFooter />
      </Suspense>

      <AuthBackgroundDecorations />
    </div>
  )
}