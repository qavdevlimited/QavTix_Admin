import { SYSTEM_STATUS_CONFIG, SystemStatusKey } from "./resources/system-status-config";

interface SystemStatusProps {
    status: SystemStatusKey;
}

export default function SystemStatus({ status }: SystemStatusProps) {
    const config = SYSTEM_STATUS_CONFIG[status]

    return (
        <div
            className="inline-flex mb-6 items-center gap-2 px-2 py-2.5 rounded-full w-fit transition-colors duration-300"
            style={{ backgroundColor: config.color }}
        >
            <div className="size-2 bg-white rounded-full animate-pulse" />

            <span className="text-white font-medium text-[11px] leading-none">
                {config.label}
            </span>
        </div>
    )
}