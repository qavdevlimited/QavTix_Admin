"use client"

import { cn } from "@/lib/utils"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button" 
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { BankItem } from "../custom-utils/bank/BankItem"
import { space_grotesk } from "@/lib/fonts"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"

interface HostCardProps {
    host: Host | null
    className?: string
}

export function HostProfileDetailsCard({ host, className }: HostCardProps) {

    const [allowAutoPayout, setAllowAutoPayout] = useState(true)

    return (
        <div className={cn('bg-white rounded-3xl h-full border border-gray-200 py-8 px-6 w-full max-w-105 shadow-[0px_5.8px_23.17px_0px_#3326AE14]', className)}>
            
            {/* Header Section: Profile + Info */}
            <div className="flex items-center gap-5 mb-8">
                <CustomAvatar 
                    name="Shola Martins" 
                    profileImg="/path-to-shola.jpg" 
                    id="1" 
                    size="size-[90px]"
                />
                <div className="flex flex-col pt-2">
                    <h3 className={cn(space_grotesk.className, "text-xl font-bold text-brand-secondary-9 leading-tight")}>
                        Shola Martins
                    </h3>
                    <div className="text-xs text-brand-neutral-7">
                        <p>+234(0)901 2345 678</p>
                        <p>Shola@pulseconcerts.com</p>
                        <p className="text-brand-neutral-8 font-bold mt-2">Business Name:</p>
                        <p className="text-[10px]">Pulse Concerts</p>
                    </div>
                </div>
            </div>

            {/* Linked Bank Accounts */}
            <div className="mb-10">
                <h4 className="text-sm font-bold text-brand-secondary-9 mb-4">Linked Bank Accounts</h4>
                <div className="space-y-4">
                    <BankItem 
                        icon="logos:firstbank" 
                        name="Olushola Akinwole Martins" 
                        bank="First Bank Nigeria" 
                    />
                    <BankItem 
                        icon="simple-icons:moniepoint" 
                        name="Shola Martins Akinwole" 
                        bank="Moniepoint Microfinance Bank" 
                    />
                    <BankItem 
                        icon="logos:gtbank" 
                        name="Olushola Akinwole Martins" 
                        bank="Guaranty Trust Bank" 
                    />
                </div>
            </div>

            {/* Socials & Auto Payout Row */}
            <div className="flex items-start justify-between mb-10">
                <div>
                    <h4 className="text-sm font-bold text-brand-secondary-9 mb-4">Contact Host</h4>
                    <div className="flex gap-2 text-brand-secondary-9">
                        <Icon icon="lucide:globe" className="size-5 cursor-pointer hover:text-blue-600" />
                        <Icon icon="fa-brands:facebook" className="size-5 cursor-pointer hover:text-blue-600" />
                        <Icon icon="ri:twitter-x-fill" className="size-5 cursor-pointer hover:text-blue-600" />
                        <Icon icon="lucide:instagram" className="size-5 cursor-pointer hover:text-pink-600" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-sm font-bold text-brand-secondary-9">Auto Payout</h4>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Split payment info"
                                    className="text-brand-neutral-6 hover:text-brand-neutral-8 transition-colors"
                                >
                                    <Icon icon="carbon:information" className="size-4 text-brand-accent-6" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-brand-secondary-8 max-w-sm text-center">
                                <p>Automatically process a seller’s payout as soon as they request it, without manual approval.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-brand-secondary-9">Allow auto payout</span>
                        <Switch 
                            checked={allowAutoPayout} 
                            onCheckedChange={setAllowAutoPayout} 
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <ActionButton1
                    buttonText="Suspend"
                    buttonType="button"
                    className="h-12.5! flex-1"
                />
                <Button variant="outline" className="flex-1 h-12.5 border-brand-secondary-6 text-brand-secondary-8 rounded-full py-6 font-medium hover:bg-brand-primary-1/50">
                    Force Payout
                </Button>
            </div>
        </div>
    )
}