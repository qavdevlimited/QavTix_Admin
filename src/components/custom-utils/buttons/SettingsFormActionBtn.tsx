'use client'

import ActionButton1 from "./ActionBtn1"
import ActionButton2 from "./ActionBtn2"


interface SettingsFormActionsProps {
    onSave: () => void
    onReset: () => void
    isSaving?: boolean
    isDisabled?: boolean
    saveLabel?: string
    resetLabel?: string
}

export default function SettingsFormActions({
    onSave,
    onReset,
    isSaving = false,
    isDisabled = false,
    saveLabel = "Save Changes",
    resetLabel = "Reset to Last Saved"
}: SettingsFormActionsProps) {
    return (
        <div className="flex items-center gap-4 mt-8">
            <ActionButton1
                buttonText={saveLabel}
                action={onSave}
                isLoading={isSaving}
                isDisabled={isDisabled}
                icon="ph:arrow-right"
                iconPosition="right"
            />

            <ActionButton2
                buttonText={resetLabel}
                action={onReset}
                isDisabled={isDisabled || isSaving}
            />
        </div>
    )
}