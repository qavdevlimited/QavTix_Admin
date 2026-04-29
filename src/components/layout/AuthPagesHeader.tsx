"use client"

import { cn } from "@/lib/utils";
import Logo from "./Logo";
import logoSrc from "@/public-assets/logo/logo-2.svg"
import { space_grotesk } from "@/lib/fonts";
import { useSearchParams } from "next/navigation";

export default function AuthPagesHeader() {

    const searchParams = useSearchParams()
    const signInStatus = searchParams.get("status")

    return (
        !signInStatus && signInStatus !== "success" &&
        <header className="px-24 flex flex-col text-center md:text-left md:flex-row justify-center md:justify-between items-center gap-y-4 gap-x-10 mt-10 relative z-10">
            <div className="flex justify-center flex-col md:flex-row items-center gap-3">
                <Logo logo={logoSrc} width={55} className="size-[35px] md:size-[55px]" />
                <h2 className={cn(space_grotesk.className, "font-bold text-2xl md:text-3xl text-brand-primary-6")}>QavTix Admin Portal</h2>
            </div>
            <p className="text-xs md:text-sm text-brand-neutral-8">Platform Oversight & Management</p>
        </header>
    )
}