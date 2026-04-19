'use client'

import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation } from "@/lib/redux/slices/confirmationSlice"
import SettingsFormActions from "@/components/custom-utils/buttons/SettingsFormActionBtn"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { SecuritySettingsFormData, securitySettingsSchema } from "@/schemas/settings.schema"
import { FRAUD_SENSITIVITY_OPTIONS } from "@/components-data/settings-data-options"



export default function SecurityAbusePage() {
    
    const { lastConfirmedAction, isConfirmed } = useAppSelector(store => store.confirmation)
    const dispatch = useAppDispatch()

    const defaultValues: SecuritySettingsFormData = {
        fraudDetectionSensitivity: 'low'
    }

    const {
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting }
    } = useForm<SecuritySettingsFormData>({
        resolver: zodResolver(securitySettingsSchema),
        defaultValues
    })

    const fraudSensitivity = watch('fraudDetectionSensitivity')

    const onSubmit : SubmitHandler<SecuritySettingsFormData> = async (data) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log('Saving security settings:', data)
        reset(data) // Reset with new values to clear dirty state
    }

    const handleReset = () => {
        reset()
    }

    const handleResetSystem = () => {
        dispatch(openConfirmation({
            actionType: "RESET_SETTINGS",
            description: "Are you sure you want to reset security settings? This will restore all defaults.",
            title: "Reset System"
        }))
    }

    useEffect(() => {
        if (isConfirmed && lastConfirmedAction === "RESET_SETTINGS") {
            reset({ fraudDetectionSensitivity: 'medium' })
        }
    }, [isConfirmed, lastConfirmedAction, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mt-4 pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>
                    Security & Abuse Prevention
                </h2>
                <button
                    type="button"
                    onClick={handleResetSystem}
                    className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                >
                    Reset System
                </button>
            </div>

            {/* Fraud Detection Section */}
            <div className="space-y-6 mb-28">
                <div>
                    <h3 className="text-base font-bold text-brand-secondary-8 mb-1">
                        Fraud Detection Sensitivity
                    </h3>
                    <p className="text-sm text-brand-secondary-9">
                        Adjust how sensitive the system is to potential fraud.
                    </p>
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />


                <RadioGroup
                    value={fraudSensitivity}
                    onValueChange={(value) => setValue('fraudDetectionSensitivity', value as any, { shouldDirty: true })}
                    className="space-y-2"
                >
                    {FRAUD_SENSITIVITY_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3">
                            <RadioGroupItem
                                value={option.value}
                                id={option.value}
                                className="size-5 border-brand-secondary-5"
                            />
                            <Label
                                htmlFor={option.value}
                                className="text-sm font-normal text-brand-secondary-9 cursor-pointer"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <SettingsFormActions
                onSave={() => handleSubmit(onSubmit)()}
                onReset={handleReset}
                isSaving={isSubmitting}
                isDisabled={!isDirty}
            />
        </form>
    )
}