import Image from "next/image";
import HostDetailsArea from "./HostDetailsArea";
import EventOverviewDetails from "./EventProfileOverviewDetails";
import { Icon } from "@iconify/react";
import Link from "next/link";
import TicketPricingArea from "./TicketPricingArea";
import { Badge } from "../ui/badge";
import { EventIconActionButton } from "../buttons/EventIconActionButton";
import { EventStatusBadgeMap, eventStatusBadgeRegistry } from "../custom-utils/TableDataDisplayAreas/resources/status-config";
import { copyToClipboard } from "@/helper-fns/copyToClipboard";
import { space_grotesk } from "@/lib/fonts";
import TableItemDropdown from "../custom-utils/dropdown/TableItemDropdown";
import { getEventProfileActions } from "../custom-utils/dropdown/resources/management-actions";
import { useParams } from "next/navigation";

export default function EventProfileOverviewTabContainer(){

    const params = useParams<{ event_id: string }>()

    return (
        <section>
            <div className="md:flex justify-between gap-8">
                <div className="md:w-95">
                    <figure>
                        <Image 
                            src="/images/demo-images/event-detail-img.png"
                            alt="Event Image"
                            width={900}
                            height={900}
                            className="rounded-4xl h-60 object-cover md:h-75"
                        />
                    </figure>
                    <HostDetailsArea className="md:mt-8" />
                </div>
                
                <div className="flex-1">
                    <div className="flex justify-between gap-5 items-start">
                        <h1 className={`${space_grotesk.className} font-bold text-2xl text-brand-secondary-9`}>Learn to create visually appealing  and user-friendly interfaces.</h1>
                        <TableItemDropdown actions={getEventProfileActions("live", params.event_id)} id={params.event_id} />
                    </div>
                    <div className="flex items-center flex-wrap gap-8 gap-y-4 md:justify-between">
                        <div className="mt-3 space-x-3">
                            <Badge variant="outline" className="py-1.5 px-3 outline outline-secondary-9 border-0">
                                <Icon icon="noto:fire" width="128" height="128" />Trending
                            </Badge>
                            <Badge variant="default" className={`py-1 px-2 rounded-2xl text-center text-[14px] font-medium ${eventStatusBadgeRegistry["filling-fast" as keyof EventStatusBadgeMap].bg} ${eventStatusBadgeRegistry["filling-fast" as keyof EventStatusBadgeMap].text} capitalize`}>
                                Filling Fast
                            </Badge>
                            <Image src="/images/vectors/18+.svg" width={40} height={40} alt="18+" className="inline size-7 pointer-events-none select-auto" />
                        </div>
        
                        <div className="flex justify-end text-secondary-9 gap-3 items-center">
                            <EventIconActionButton 
                                icon="hugeicons:share-08" 
                                onClick={() => {}} 
                                className="hover:text-white"
                                feedback=""
                            />
                            <EventIconActionButton 
                                icon="ph:link-bold" 
                                onClick={() => copyToClipboard("Hello")} 
                                className="hover:text-white"
                                feedback="Event link copied"
                            />
                            <EventIconActionButton 
                                icon="hugeicons:favourite" 
                                onClick={() => {}} 
                                className="hover:text-white"
                                feedback="Added to favourites"
                            />
                        </div>
                    </div>
        
                    {/* Date/Location */}
                    <div className="space-y-3 mt-7">
                        <div className="flex items-center gap-1">
                            <div className="flex items-center gap-0.5">
                                <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-accent-6" />
                                <hr className="w-px h-2 border border-neutral-6" />
                                <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-accent-6" />
                            </div>
                            <span className="text-brand-neutral-7 text-sm truncate flex-1">
                                Tomorrow, March 22, 9AM - 12PM WAT
                            </span>
                        </div>
        
                        <div className="flex items-center gap-1">
                            <Icon icon="hugeicons:location-01" className="size-4 shrink-0 text-accent-6" />
                            <Link href="" className="flex-1 text-brand-neutral-7 flex items-center gap-1">
                                <span className="text-sm truncate">
                                    1234, Shima Road, Victoria Island, Lagos
                                </span>
                                <Icon icon="system-uicons:arrow-top-right" width="21" height="21" />
                            </Link>
                        </div>
                    </div>
    
                    <TicketPricingArea />
                </div>
            </div>
            <EventOverviewDetails className="" />
        </section>
    )
}