"use client"

import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthPagesFooter() {
    
    const currentYear = new Date().getFullYear()
    const searchParams = useSearchParams()
    const signInStatus = searchParams.get("status")

    return (
        !signInStatus && signInStatus !== "success" &&
        <footer className="w-full py-10 px-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center text-sm justify-between gap-6 text-brand-neutral-8">
                    
                    {/* Copyright Section */}
                    <div className="flex items-center gap-1">
                        <span className={cn(space_grotesk.className, "text-base text-brand-neutral-8")}>© {currentYear} QavTix</span>
                    </div>

                    {/* Support & Version Info */}
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold">Support:</span>
                            <a 
                                href="mailto:superadmin@qavtix.com" 
                                className="hover:text-brand-primary-6 transition-colors"
                            >
                                superadmin@qavtix.com
                            </a>
                        </div>
                        
                        <span className="hidden md:inline text-brand-neutral-6 text-lg">•</span>
                        
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold">Version:</span>
                            <span>Phase 1 • Build 1.2</span>
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link 
                            href="/privacy-policy" 
                            className="font-bold hover:text-brand-primary-6 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        
                        <span className="hidden md:inline text-brand-neutral-6 text-lg">•</span>
                        
                        <Link 
                            href="/terms-of-use" 
                            className="font-bold hover:text-brand-primary-6 transition-colors"
                        >
                            Terms of Use
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    )
}