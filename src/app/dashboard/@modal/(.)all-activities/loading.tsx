import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-brand-neutral-2">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40 bg-brand-neutral-3" />
                        <Skeleton className="h-3 w-64 bg-brand-neutral-2" />
                    </div>
                    <Icon icon="line-md:close-circle-filled" className="size-6 text-brand-neutral-4" />
                </div>

                {/* Content Skeleton */}
                <div className="p-6 space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex gap-4 items-center p-3 border border-brand-neutral-2 rounded-xl">
                            <Skeleton className="size-10 rounded-lg bg-brand-neutral-3 shrink-0" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-1/3 bg-brand-neutral-3" />
                                <Skeleton className="h-3 w-1/2 bg-brand-neutral-2" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full bg-brand-neutral-2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
