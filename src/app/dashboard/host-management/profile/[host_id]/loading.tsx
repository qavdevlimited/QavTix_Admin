import MetricsContainerLoader from "@/components/loaders/MetricsContainerLoader";
import TableLoader from "@/components/loaders/TableLoader";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCustomerProfilePage() {
    return (
        <div>
            <MetricsContainerLoader />

            <div className="h-110 grid grid-cols-1 md:grid-cols-[20em_1fr] gap-4 gap-y-7 my-10">
                <Skeleton className="rounded-2xl w-full bg-[#E0E0E0]" />
                <Skeleton className="rounded-2xl w-full bg-[#E0E0E0]" />
            </div>

            <TableLoader />
        </div>
    )
}