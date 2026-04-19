import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { QuickActionConfig } from './resources/configs/quick-actions-config';


export default function QuickActionCard({ action }: { action: QuickActionConfig }) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-[0px_5.8px_23.17px_0px_#3326AE14] border border-gray-50 flex flex-col justify-between transition-all hover:shadow-md hover:scale-103 duration-200 ease-linear">
            <div className="flex flex-col gap-4">
                <Image 
                    src={action.icon} 
                    alt={action.label} 
                    width={36} 
                    height={36} 
                    className="object-contain"
                />

                {/* Content */}
                <div>
                    <h3 className="text-brand-secondary-9 font-medium text-sm">
                        {action.label}
                    </h3>
                    <p className="text-brand-secondary-6 text-xs mt-1">
                        {action.description}
                    </p>
                </div>
            </div>

            {/* Action Link */}
            <Link 
                href={action.href}
                className="flex items-center mt-5 gap-2 text-brand-primary-6 font-bold text-xs group"
            >
                {action.linkText}
                <Icon 
                    icon="lucide:arrow-right" 
                    className="size-4 transition-transform group-hover:translate-x-1" 
                />
            </Link>
        </div>
    )
}