import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HOST_PROFILE } from "@/enums/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Link from "next/link";
import CustomAvatar from "../custom-utils/avatars/CustomAvatar";

const HostDetailsArea = ({ className }:{ className?: string }) => {

    return (
        <div className={cn(
            className
        )}>
            <div className={cn(
                "flex flex-wrap justify-between items-center gap-4",
                "md:justify-start md:gap-6"
            )}
                >
                <div className="flex items-center gap-2">
                    <CustomAvatar id="1" name="Qavdev Limited" size="size-12" profileImg="/images/demo-images/host-img.png" />

                    <div>
                        <p className="text-xs text-brand-neutral-7">Hosted by</p>
                        <Link 
                            className="flex items-center text-brand-secondary-9 text-sm"
                            href={HOST_PROFILE.href.replace('[host_id]', "3636273")}
                            >
                            <strong className="font-normal whitespace-nowrap">Qavdev Limited</strong>
                            <Icon icon="line-md:chevron-right" width="20" height="20" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center mt-7">
                {
                    ["#Networking","#Lagos"].map((v,index) => (
                        <Badge key={`${v}${index}`} variant="default" className={`py-1 px-2 bg-brand-accent-1 text-brand-accent-7 rounded-2xl text-center text-sm font-medium capitalize`}>
                            {v}
                        </Badge>
                    ))
                }
            </div>
        </div>
    )
}


export default HostDetailsArea;