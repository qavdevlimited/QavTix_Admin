"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";

export default function DashboardMetricCardsContainer({ children }: { children: React.ReactNode }) {

    const scrollRef = useRef<HTMLDivElement>(null)
    // At the start, we can only scroll right
    const [isAtEnd, setIsAtEnd] = useState(false)
    const [showControls, setShowControls] = useState(true)

    const handleScrollAction = () => {
        if (!scrollRef.current) return

        const container = scrollRef.current
        const cards = Array.from(container.children) as HTMLElement[]
        if (!cards.length) return

        const containerRect = container.getBoundingClientRect()
        const padding = 12

        if (isAtEnd) {
            const target = [...cards].reverse().find(card => {
                return card.getBoundingClientRect().right < containerRect.left
            })
            if (target) {
                container.scrollTo({
                    left: target.offsetLeft - padding,
                    behavior: "smooth"
                })
            }
        } else {
            const target = cards.find(card => {
                return card.getBoundingClientRect().right > containerRect.right
            })
            if (target) {
                container.scrollTo({
                    left: target.offsetLeft - padding,
                    behavior: "smooth"
                })
            }
        }
    }

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            // If we are near the end (within 20px), toggle the button to "Left" mode
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 20)

            // Hide the entire overlay only if it's impossible to scroll either way 
            // (e.g., container is larger than content)
            setShowControls(scrollWidth > clientWidth)
        }
    }

    if (!showControls) return (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">{children}</div>
    )

    return (
        <div className="relative w-full group bg-white shadow-xs p-3 rounded-lg">
            {/* Fade effect - disappears when at the end to match your "isAtEnd" logic */}
            {!isAtEnd && (
                <div className="absolute top-0 bottom-0 my-auto right-0 w-25 bg-linear-to-l from-white via-white/90 to-transparent transition-opacity duration-300" />
            )}

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
            >
                {children}
            </div>

            <div className="absolute top-0 right-0 h-32.5 flex items-center z-20 pointer-events-none">
                {/* Single Conditional Button */}
                <div className="relative flex items-center pr-2 pointer-events-auto">
                    <button
                        onClick={handleScrollAction}
                        className="size-10 rounded-xl bg-brand-primary-6 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-brand-primary-7 active:scale-95 translate-x-2 group-hover:translate-x-0"
                    >
                        <Icon
                            icon={isAtEnd ? "lucide:chevron-left" : "lucide:chevron-right"}
                            className="size-6 transition-transform duration-300"
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}