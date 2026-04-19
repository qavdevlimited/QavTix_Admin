import { Icon } from "@iconify/react"

interface TagProps {
    flag: string
    label: string
    onRemove: () => void
}

export default function SettingsLocalizationTag({ flag, label, onRemove }: TagProps) {
    return (
        <div className="inline-flex h-11 items-center gap-2 px-3 py-2 bg-brand-primary-1 rounded-lg border border-brand-primary-2">
            <span className="text-base">{flag}</span>
            <span className="text-sm text-brand-secondary-9 font-medium">{label}</span>
            <button
                type="button"
                onClick={onRemove}
                className="ml-1 text-brand-secondary-7 hover:text-brand-secondary-9 transition-colors"
            >
                <Icon icon="mdi:close" className="size-4" />
            </button>
        </div>
    )
}