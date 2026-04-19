"use client"

import { useState } from "react";
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { UserManagementTabNFilterOptions } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters";
import UsersTable from "../custom-utils/TableDataDisplayAreas/tables/UsersTable";


export default function UsersListSection(){

    const { filterOptions } = UserManagementTabNFilterOptions;
    const [filters, setFilters] = useState<Partial<FilterValues>>({
        ticketType: [],
        purchaseDate: null
    })
    

    return (
        <section>
            <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>Users</h3>
            <DataDisplayTableWrapper 
                filters={filters}
                filterOptions={filterOptions}
                setFilters={setFilters}
                searchPlaceholder="Search User by name or email"
            >
                <UsersTable />
            </DataDisplayTableWrapper>
        </section>
    )
}