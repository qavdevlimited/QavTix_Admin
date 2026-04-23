'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { openConfirmation, resetConfirmationStatus } from '@/lib/redux/slices/confirmationSlice'
import { openSuccessModal } from '@/lib/redux/slices/successModalSlice'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import SettingsFormActions from '@/components/custom-utils/buttons/SettingsFormActionBtn'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import { SecuritySettingsFormData, securitySettingsSchema } from '@/schemas/settings.schema'
import { FRAUD_SENSITIVITY_OPTIONS } from '@/components-data/settings-data-options'
import { getFraudSettings, updateFraudSettings, ResetAllSettings } from '@/actions/settings'

export default function SecurityAbusePage() {
    const dispatch = useAppDispatch()
    const { lastConfirmedAction, isConfirmed } = useAppSelector(s => s.confirmation)
    const [isLoading, setIsLoading] = useState(true)

    const {
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm<SecuritySettingsFormData>({
        resolver: zodResolver(securitySettingsSchema),
        defaultValues: { fraudDetectionSensitivity: 'low' },
    })

    // Fetch initial data
    useEffect(() => {
        getFraudSettings().then(res => {
            if (res.success) {
                reset({ fraudDetectionSensitivity: res.data.fraud_sensitivity })
            } else {
                dispatch(showAlert({ title: 'Failed to load settings', description: res.message, variant: 'destructive' }))
            }
            setIsLoading(false)
        })
    }, [reset, dispatch])

    // RESET_SETTINGS confirmation — call API and use returned factory defaults
    useEffect(() => {
        if (!isConfirmed || lastConfirmedAction !== 'RESET_SETTINGS') return
        dispatch(resetConfirmationStatus())
        ResetAllSettings().then(res => {
            if (res.success) {
                reset({ fraudDetectionSensitivity: res.data.fraud.fraud_sensitivity })
                dispatch(openSuccessModal({ title: 'Settings Reset', description: 'All settings restored to factory defaults.', variant: 'success' }))
            } else {
                dispatch(showAlert({ title: 'Reset Failed', description: res.message, variant: 'destructive' }))
            }
        })
    }, [isConfirmed, lastConfirmedAction, dispatch, reset])

    const onSubmit = async (data: SecuritySettingsFormData) => {
        const result = await updateFraudSettings({ fraud_sensitivity: data.fraudDetectionSensitivity })
        if (result.success) {
            reset(data)
            dispatch(openSuccessModal({ title: 'Settings Saved', description: 'Security settings updated successfully.', variant: 'success' }))
        } else {
            dispatch(showAlert({ title: 'Save Failed', description: result.message, variant: 'destructive' }))
        }
    }

    const handleReset = () => reset()

    const handleResetSystem = () => {
        dispatch(openConfirmation({
            actionType: 'RESET_SETTINGS',
            title: 'Reset Security Settings',
            description: 'This will restore all security settings to defaults.',
            confirmText: 'Yes, Reset',
        }))
    }

    const fraudSensitivity = watch('fraudDetectionSensitivity')

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mt-4 pb-16">
            <div className="flex gap-4 items-center justify-between mb-10">
                <h2 className={cn(space_grotesk.className, 'text-brand-secondary-8 font-bold text-lg')}>
                    Security & Abuse Prevention
                </h2>
                <button type="button" onClick={handleResetSystem}
                    className="text-sm whitespace-nowrap font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors">
                    Reset System
                </button>
            </div>

            <div className="space-y-6 mb-20">
                <div>
                    <h3 className="text-base font-bold text-brand-secondary-8 mb-1">Fraud Detection Sensitivity</h3>
                    <p className="text-sm text-brand-secondary-9">Adjust how sensitive the system is to potential fraud.</p>
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />

                <RadioGroup
                    value={fraudSensitivity}
                    onValueChange={v => setValue('fraudDetectionSensitivity', v as 'low' | 'medium' | 'high', { shouldDirty: true })}
                    className="space-y-2"
                    disabled={isLoading}
                >
                    {FRAUD_SENSITIVITY_OPTIONS.map(option => (
                        <div key={option.value} className="flex items-center space-x-3">
                            <RadioGroupItem value={option.value} id={option.value} className="size-5 border-brand-secondary-5" />
                            <Label htmlFor={option.value} className="text-sm font-normal text-brand-secondary-9 cursor-pointer">
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
                isDisabled={!isDirty || isLoading}
            />
        </form>
    )
}