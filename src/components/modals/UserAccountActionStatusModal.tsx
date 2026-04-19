'use client'

import { Icon } from '@iconify/react'
import Image from 'next/image'
import { AnimatedDialog } from '@/components/custom-utils/dialogs/AnimatedDialog'
import { DialogClose, DialogTitle } from '@/components/ui/dialog'
import { AccountActionType, useraccountActionConfig } from './resources/user-account-action-status'

interface UserAccountActionStatusModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    resultType: AccountActionType
}

export default function UserAccountActionStatusModal({
    open,
    onOpenChange,
    resultType
}: UserAccountActionStatusModalProps) {
    

    const config = useraccountActionConfig[resultType] || {
        title: "",
        message: "",
        icon: ""
    }

    return (
        <AnimatedDialog 
            open={open} 
            showCloseButton={false} 
            className='sm:max-w-96.5!'
        >
            <DialogTitle className="sr-only">
                {config.title}
            </DialogTitle>

            <DialogClose onClick={() => onOpenChange(false)} className="absolute top-6 right-6 transition-transform hover:scale-103 active:scale-90 z-20">
                <Icon 
                    icon="material-symbols:cancel" 
                    width="25" 
                    height="25"
                    className="text-brand-neutral-6 hover:text-brand-neutral-7 rounded-full" 
                />
            </DialogClose>

            <div className="flex flex-col items-center text-center">
                
                <div className="mb-8 relative size-28 animate-in zoom-in-75 duration-500 ease-out fill-mode-forward">
                    {config.icon && (
                        <Image
                            src={config.icon}
                            alt={config.title}
                            fill
                            className="object-contain"
                            priority
                        />
                    )}
                </div>

                <div className="space-y-3">
                    <h2 className="font-bold text-brand-secondary-9 leading-tight">
                        {config.title}
                    </h2>

                    <p className="text-sm text-brand-secondary-8 leading-relaxed max-w-70 mx-auto">
                        {config.message}
                    </p>
                </div>
            </div>
        </AnimatedDialog>
    )
}