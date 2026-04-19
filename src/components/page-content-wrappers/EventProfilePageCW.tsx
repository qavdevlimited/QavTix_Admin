"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { EventProfileTabNFilterOptions } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters";
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper";
import EventProfileOverviewTabContainer from "../event-listing/EventProfileOverviewTabContainer";
import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";
import AttendeesTable from "../custom-utils/TableDataDisplayAreas/tables/events-listing/AttendeesTable";


export default function EventProfilePageCW(){
    
    const { filterOptions, tabList } = EventProfileTabNFilterOptions;
    const [activeTab, setActiveTab] = useState<typeof EventProfileTabNFilterOptions.tabList[number]["value"]>("overview")

    return (
        <main className="pb-10">
            <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>Event Profile</h2>
            <div className="mt-10">
                <DataDisplayTableWrapper 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filterOptions={filterOptions}
                    tabs={tabList}
                    showSearch={activeTab === "attendee-list"}
                >
                    {
                        activeTab === "overview" ?
                        <EventProfileOverviewTabContainer />
                        :
                        activeTab === "attendee-list" ?
                        <AttendeesTable />
                        :
                        null
                    }
                </DataDisplayTableWrapper>
            </div>
        </main>
    )
}