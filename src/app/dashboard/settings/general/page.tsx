'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { CURRENCIES, TIMEZONES } from '@/components-data/settings-data-options'
import { openConfirmation, resetConfirmationStatus } from '@/lib/redux/slices/confirmationSlice'
import { openSuccessModal } from '@/lib/redux/slices/successModalSlice'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import SettingsFormActions from '@/components/custom-utils/buttons/SettingsFormActionBtn'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import CustomInput2 from '@/components/custom-utils/inputs/CustomInput2'
import { GeneralSettingsForm, generalSettingsSchema } from '@/schemas/settings.schema'
import { getGeneralSettings, updateGeneralSettings } from '@/actions/settings'

export default function GeneralSettingsPage() {
    const dispatch = useAppDispatch()
    const { lastConfirmedAction, isConfirmed } = useAppSelector(s => s.confirmation)
    const [isLoading, setIsLoading] = useState(true)
    const [, startTransition] = useTransition()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isDirty, isSubmitting },
    } = useForm<GeneralSettingsForm>({
        resolver: zodResolver(generalSettingsSchema),
        defaultValues: { platformSupportEmail: '', defaultCurrencyCode: 'USD', defaultTimezone: 'Africa/Lagos' },
    })

    // Fetch initial data
    useEffect(() => {
        getGeneralSettings().then(res => {
            if (res.success) {
                reset({
                    platformSupportEmail: res.data.platform_support_email,
                    defaultCurrencyCode: res.data.default_currency.code,
                    defaultTimezone: res.data.default_timezone,
                })
            } else {
                dispatch(showAlert({ title: 'Failed to load settings', description: res.message, variant: 'destructive' }))
            }
            setIsLoading(false)
        })
    }, [reset, dispatch])

    // RESET_SETTINGS confirmation
    useEffect(() => {
        if (!isConfirmed || lastConfirmedAction !== 'RESET_SETTINGS') return
        dispatch(resetConfirmationStatus())
        const defaults: GeneralSettingsForm = { platformSupportEmail: 'support@qavtix.com', defaultCurrencyCode: 'USD', defaultTimezone: 'UTC' }
        reset(defaults, { keepDirty: true })
    }, [isConfirmed, lastConfirmedAction, dispatch, reset])

    const onSubmit = async (data: GeneralSettingsForm) => {
        const result = await updateGeneralSettings({
            platform_support_email: data.platformSupportEmail,
            default_currency: { code: data.defaultCurrencyCode, label: CURRENCIES.find(c => c.value === data.defaultCurrencyCode)?.label ?? data.defaultCurrencyCode },
            default_timezone: data.defaultTimezone,
        })
        if (result.success) {
            reset(data)
            dispatch(openSuccessModal({ title: 'Settings Saved', description: 'General settings updated successfully.', variant: 'success' }))
        } else {
            dispatch(showAlert({ title: 'Save Failed', description: result.message, variant: 'destructive' }))
        }
    }

    const handleReset = () => reset()

    const handleResetSystem = () => {
        dispatch(openConfirmation({
            actionType: 'RESET_SETTINGS',
            title: 'Reset General Settings',
            description: 'This will restore all general settings to factory defaults. Continue?',
            confirmText: 'Yes, Reset',
        }))
    }

    const selectedCurrency = CURRENCIES.find(c => c.value === watch('defaultCurrencyCode'))

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mt-4 pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, 'text-brand-secondary-8 font-bold text-lg')}>General Settings</h2>
                <button type="button" onClick={handleResetSystem}
                    className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors">
                    Reset System
                </button>
            </div>

            {/* System section */}
            <div className="space-y-6 mb-10">
                <div>
                    <h2 className="text-base font-bold text-brand-secondary-8 mb-1">System</h2>
                </div>

                {/* Platform Support Email */}
                <div className="max-w-sm">
                    <CustomInput2
                        label="Platform Support Email"
                        id="platform-email"
                        type="email"
                        placeholder="inquiries@qavtix.com"
                        className="h-14 rounded-md!"
                        disabled={isLoading}
                        {...register('platformSupportEmail')}
                    />
                </div>

                {/* Default Currency */}
                <div className="max-w-sm">
                    <Label htmlFor="default-currency" className="text-sm font-medium text-brand-secondary-9 mb-2 block">
                        Default Currency
                    </Label>
                    <Select
                        value={watch('defaultCurrencyCode')}
                        onValueChange={v => setValue('defaultCurrencyCode', v, { shouldDirty: true })}
                        disabled={isLoading}
                    >
                        <SelectTrigger id="default-currency" className="h-14! w-full bg-white rounded-md outline-none text-brand-neutral-9 border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6">
                            <SelectValue>
                                {selectedCurrency && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{selectedCurrency.flag}</span>
                                        <span>{selectedCurrency.label}</span>
                                        <span className="text-brand-neutral-6 text-xs">({selectedCurrency.code})</span>
                                    </div>
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {CURRENCIES.map(c => (
                                <SelectItem key={c.value} value={c.value}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{c.flag}</span>
                                        <span>{c.label}</span>
                                        <span className="text-brand-neutral-6 text-xs">({c.code})</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Default Timezone */}
                <div className="max-w-sm">
                    <Label htmlFor="default-timezone" className="text-sm font-medium text-brand-secondary-9 mb-2 block">
                        Default Timezone
                    </Label>
                    <Select
                        value={watch('defaultTimezone')}
                        onValueChange={v => setValue('defaultTimezone', v, { shouldDirty: true })}
                        disabled={isLoading}
                    >
                        <SelectTrigger id="default-timezone" className="h-14! w-full bg-white rounded-md outline-none text-brand-neutral-9 border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {TIMEZONES.map(tz => (
                                <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
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