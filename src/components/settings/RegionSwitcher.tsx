"use client"

import { regions } from "@/components-data/settings-data-options";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useIsMounted } from "@/custom-hooks/UseIsMounted";
import { useUserSettings } from "@/custom-hooks/useUserSettings";
import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";
import { CircleFlag } from 'react-circle-flags'



export default function RegionSwitcher({ className }: { className?: string }) {

    const { region, isPending, updateRegion } = useUserSettings()

    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()

    const handleRegionChange = (v: string) => {
        const regionObj = regions.find(r => r.code === v)
        regionObj && updateRegion(regionObj)
    }

    return (
        isMounted &&
        <Select value={user?.currency} onValueChange={handleRegionChange}>
            <SelectTrigger
                disabled={true}
                className={cn(
                    className,
                    "disabled:opacity-65 text-xs disabled:cursor-not-allowed w-27 px-2 bg-brand-primary-1 rounded-lg border-brand-primary-6 hover:border-[1.4px] focus:border-brand-primary-6"
                )}
            >
                <SelectValue>
                    <span className="flex items-center gap-2">
                        <CircleFlag countryCode={region.code.toLowerCase()} className="size-6" />
                        <span>{region.code}</span>
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {regions.map((r) => (
                    <SelectItem key={r.code} value={r.code}>
                        <span className="flex items-center gap-2">
                            <CircleFlag countryCode={r.code.toLowerCase()} className="size-6" />
                            <span className="text-xs">{r.code}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}