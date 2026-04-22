"use client"

import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { HOST_PROFILE } from "@/enums/navigation"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import Link from "next/link"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"

interface HostDetailsAreaProps {
    className?: string
    organizerName: string
    organizerDescription?: string
    organizerId: string
    tags: string[]
}

const HostDetailsArea = ({
    className,
    organizerName,
    organizerDescription,
    organizerId,
    tags,
}: HostDetailsAreaProps) => {
    return (
        <div className={cn(className)}>
            <div className={cn(
                "flex flex-wrap justify-between items-center gap-4",
                "md:justify-start md:gap-6",
            )}>
                <div className="flex items-center gap-2">
                    <CustomAvatar id={organizerId} name={organizerName} size="size-12" />
                    <div>
                        <p className="text-xs text-brand-neutral-7">Hosted by</p>
                        <Link
                            className="flex items-center text-brand-secondary-9 text-sm"
                            href={HOST_PROFILE.href.replace("[host_id]", organizerId)}
                        >
                            <strong className="font-normal whitespace-nowrap">{organizerName}</strong>
                            <Icon icon="line-md:chevron-right" width="20" height="20" />
                        </Link>
                    </div>
                </div>
            </div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center mt-7">
                    {tags.map((tag, i) => (
                        <Badge
                            key={`${tag}${i}`}
                            variant="default"
                            className="py-1 px-2 bg-brand-accent-1 text-brand-accent-7 rounded-2xl text-center text-sm font-medium capitalize"
                        >
                            #{tag}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}

export default HostDetailsArea