import AuthBackgroundDecorations from "@/components/auth-pages/AuthDecorations";
import SecurityBadges from "@/components/auth-pages/SecurityBadges";
import AuthPagesFooter from "@/components/layout/AuthPagesFooter";
import AuthPagesHeader from "@/components/layout/AuthPagesHeader";
import Image from "next/image";

export default function AuthPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-white">
      <AuthPagesHeader />
      
      {/* Main Content Area */}
      <main className="flex-1 z-10 flex flex-col space-y-12 items-center justify-center w-full py-12 pb-16 px-6">
        <SecurityBadges />

        <div style={{ width: "480px" }}>
          {children}
        </div>
      </main>

      <AuthPagesFooter />

      <AuthBackgroundDecorations />
    </div>
  )
}