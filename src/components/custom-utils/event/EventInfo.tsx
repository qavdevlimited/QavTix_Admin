import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

interface EventInfoProps {
    image: string | null;
    title: string;
    category: string;
    variant?: "desktop" | "mobile";
    className?: string;
}

export default function EventInfo({
    image,
    title,
    category,
    variant = "desktop",
    className,
}: EventInfoProps) {

    const isDesktop = variant === "desktop";

    return (
        <div className={cn("flex gap-2 items-center", !isDesktop && "items-center gap-3", className)}>
            {/* Image Container */}
            <div
                className={cn(
                    "relative overflow-hidden shrink-0 rounded-lg",
                    isDesktop ? "size-10" : "w-10 aspect-square rounded-md"
                )}
            >
                {
                    image ?
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                        :
                        <div className="w-full h-full flex items-center justify-center">
                            <Icon icon="mynaui:image" className="size-8 text-brand-neutral-6" />
                        </div>
                }
            </div>

            {/* Text Content */}
            <div className={cn(isDesktop ? "flex-1 min-w-25" : "min-w-0")}>
                <h3
                    className={cn(
                        "font-bold leading-tight text-brand-secondary-9 text-xs"
                    )}
                >
                    {title}
                </h3>
                <p
                    className={cn(
                        isDesktop ? "text-[11px] text-brand-secondary-6" : "text-[11px] text-brand-secondary-8"
                    )}
                >
                    {category}
                </p>
            </div>
        </div>
    )
}