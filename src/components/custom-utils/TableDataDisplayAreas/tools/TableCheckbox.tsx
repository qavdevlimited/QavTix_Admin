import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"

interface TableCheckboxProps {
    checked: boolean
    indeterminate?: boolean
    onChange: (checked: boolean) => void
    ariaLabel?: string
    className?: string
}

/**
 * Reusable table checkbox — handles checked, indeterminate (select-all),
 * and unchecked states with a consistent design.
 */
export default function TableCheckbox({
    checked,
    indeterminate = false,
    onChange,
    ariaLabel,
    className,
}: TableCheckboxProps) {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={indeterminate ? "mixed" : checked}
            aria-label={ariaLabel}
            onClick={(e) => {
                e.stopPropagation()
                onChange(!checked)
            }}
            className={cn(
                "size-4 rounded border flex items-center justify-center shrink-0 transition-all duration-100",
                (checked || indeterminate)
                    ? "bg-brand-primary-6 border-brand-primary-6"
                    : "bg-white border-brand-neutral-5 hover:border-brand-primary-6",
                className,
            )}
        >
            {indeterminate && !checked && (
                <Icon icon="lucide:minus" className="size-2.5 text-white" />
            )}
            {checked && (
                <Icon icon="lucide:check" className="size-2.5 text-white" />
            )}
        </button>
    )
}
