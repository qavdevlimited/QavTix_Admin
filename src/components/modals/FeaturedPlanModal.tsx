"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"

interface FeaturedPlan {
    id: string
    name: string
    duration: string
    price: number
    features: string[]
}

const FEATURED_PLANS: FeaturedPlan[] = [
    {
        id: "basic",
        name: "Basic",
        duration: "1-Day Feature",
        price: 45000,
        features: [
            'Featured in Top Events for 24 hours',
            'Priority placement in event feed',
            '"Featured" badge on your post',
        ],
    },
    {
        id: "standard",
        name: "Standard",
        duration: "3-Day Feature",
        price: 85000,
        features: [
            "Featured for 72 hours",
            "Higher visibility across homepage & search",
            "Featured badge + boosted impressions",
            "Social media story promotion",
        ],
    },
    {
        id: "advanced",
        name: "Advanced",
        duration: "7-Day Feature",
        price: 165000,
        features: [
            "Featured for 7 days",
            "Maximum visibility & sustained reach",
            "Featured badge + boosted impressions",
            "Weekly main social media post + story promotion",
        ],
    },
]

interface FeaturedPlanModalProps {
    open: boolean
    onClose: () => void
    onConfirm: (planId: string) => void
    isLoading?: boolean
}

export default function FeaturedPlanModal({ open, onClose, onConfirm, isLoading }: FeaturedPlanModalProps) {
    const [selectedPlanId, setSelectedPlanId] = useState<string>("standard")

    if (!open) return null

    const selectedPlan = FEATURED_PLANS.find(p => p.id === selectedPlanId)

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose() }}
        >
            <div className={cn(
                "relative bg-white w-full sm:max-w-md",
                "rounded-t-3xl sm:rounded-3xl",
                "flex flex-col",
                "max-h-[92dvh] sm:max-h-[88dvh]",
                "shadow-2xl",
            )}>
                {/* Drag pill */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-brand-neutral-3 sm:hidden" />
                {/* Plan options */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3">
                    {FEATURED_PLANS.map(plan => {
                        const isSelected = selectedPlanId === plan.id
                        return (
                            <button
                                key={plan.id}
                                onClick={() => setSelectedPlanId(plan.id)}
                                className={cn(
                                    "w-full text-left rounded-2xl border-2 p-4 transition-all duration-150",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                                    isSelected
                                        ? "border-brand-primary-5 bg-brand-primary-1"
                                        : "border-brand-neutral-3 bg-white hover:border-brand-neutral-4",
                                )}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className={cn(
                                        "mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                        isSelected ? "border-brand-primary-5 bg-brand-primary-5" : "border-brand-neutral-4",
                                    )}>
                                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-[15px] font-semibold text-brand-secondary-9">{plan.name}</p>
                                        <p className="text-[11px] text-brand-neutral-7">{plan.duration}</p>
                                    </div>
                                    <p className={cn(
                                        "text-[15px] font-bold shrink-0",
                                        isSelected ? "text-brand-primary-6" : "text-brand-secondary-9",
                                    )}>
                                        ₦{plan.price.toLocaleString()}
                                    </p>
                                </div>
                                <ul className="mt-3 pl-7 space-y-1.5">
                                    {plan.features.map(feat => (
                                        <li key={feat} className="flex items-start gap-2 text-[12px] text-brand-secondary-7">
                                            <Icon
                                                icon="solar:check-circle-bold"
                                                className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", isSelected ? "text-brand-primary-5" : "text-brand-neutral-5")}
                                            />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </button>
                        )
                    })}
                </div>

                {/* Footer */}
                <div className="shrink-0 px-4 pb-6 pt-4 border-t border-brand-neutral-2 space-y-2.5">
                    {selectedPlan && (
                        <p className="text-center text-[11px] text-brand-neutral-7 mb-1">
                            Promoting with <span className="font-semibold text-brand-secondary-8">{selectedPlan.name}</span> plan · ₦{selectedPlan.price.toLocaleString()}
                        </p>
                    )}
                    <button
                        onClick={() => selectedPlanId && onConfirm(selectedPlanId)}
                        disabled={!selectedPlanId || isLoading}
                        className={cn(
                            "w-full py-3.5 rounded-2xl text-[14px] font-semibold transition-all",
                            "bg-brand-primary-5 text-white hover:bg-brand-primary-6 active:scale-[0.98]",
                            "disabled:opacity-40 disabled:cursor-not-allowed",
                        )}
                    >
                        {isLoading ? "Processing..." : "Confirm"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={cn(
                            "w-full py-3.5 rounded-2xl text-[14px] font-semibold transition-all",
                            "bg-brand-neutral-2 text-brand-secondary-8 hover:bg-brand-neutral-3 active:scale-[0.98]",
                            "disabled:opacity-40",
                        )}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
