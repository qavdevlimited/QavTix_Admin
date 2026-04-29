'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { openConfirmation, resetConfirmationStatus } from '@/lib/redux/slices/confirmationSlice'
import { openSuccessModal } from '@/lib/redux/slices/successModalSlice'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import SettingsFormActions from '@/components/custom-utils/buttons/SettingsFormActionBtn'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import { NotificationsSettingsFormData, notificationsSettingsSchema } from '@/schemas/settings.schema'
import { NOTIFICATION_TYPES } from '@/components-data/settings-data-options'
import { getNotificationSettingsClient as getNotificationSettings, updateNotificationSettingsClient as updateNotificationSettings, ResetAllSettingsClient as ResetAllSettings } from "@/actions/settings/client"
export default function NotificationsPage() {
    const dispatch = useAppDispatch()
    const { lastConfirmedAction, isConfirmed } = useAppSelector(s => s.confirmation)
    const [isLoading, setIsLoading] = useState(true)

    const {
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm<NotificationsSettingsFormData>({
        resolver: zodResolver(notificationsSettingsSchema),
        defaultValues: {
            emailNotificationsEnabled: true,
            emailNotifications: { adminAlerts: true, fraudAlerts: false, highVolumeSales: false, failedPayouts: false },
            smsNotificationsEnabled: false,
            smsNotifications: { adminAlerts: false, fraudAlerts: false, highVolumeSales: false, failedPayouts: false },
        },
    })

    // Fetch initial data
    useEffect(() => {
        getNotificationSettings().then(res => {
            if (res.success) {
                const d = res.data
                // derive "enabled" from whether any notification type is true
                const emailOn = Object.values(d.email_notifications).some(Boolean)
                const smsOn = Object.values(d.sms_notifications).some(Boolean)
                reset({
                    emailNotificationsEnabled: emailOn,
                    emailNotifications: {
                        adminAlerts: d.email_notifications.admin_alerts,
                        fraudAlerts: d.email_notifications.fraud_alerts,
                        highVolumeSales: d.email_notifications.high_volume_sales,
                        failedPayouts: d.email_notifications.failed_payouts,
                    },
                    smsNotificationsEnabled: smsOn,
                    smsNotifications: {
                        adminAlerts: d.sms_notifications.admin_alerts,
                        fraudAlerts: d.sms_notifications.fraud_alerts,
                        highVolumeSales: d.sms_notifications.high_volume_sales,
                        failedPayouts: d.sms_notifications.failed_payouts,
                    },
                })
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
                const d = res.data.notifications
                const emailOn = Object.values(d.email_notifications).some(Boolean)
                const smsOn = Object.values(d.sms_notifications).some(Boolean)
                reset({
                    emailNotificationsEnabled: emailOn,
                    emailNotifications: {
                        adminAlerts: d.email_notifications.admin_alerts,
                        fraudAlerts: d.email_notifications.fraud_alerts,
                        highVolumeSales: d.email_notifications.high_volume_sales,
                        failedPayouts: d.email_notifications.failed_payouts,
                    },
                    smsNotificationsEnabled: smsOn,
                    smsNotifications: {
                        adminAlerts: d.sms_notifications.admin_alerts,
                        fraudAlerts: d.sms_notifications.fraud_alerts,
                        highVolumeSales: d.sms_notifications.high_volume_sales,
                        failedPayouts: d.sms_notifications.failed_payouts,
                    },
                })
                dispatch(openSuccessModal({ title: 'Settings Reset', description: 'All settings restored to factory defaults.', variant: 'success' }))
            } else {
                dispatch(showAlert({ title: 'Reset Failed', description: res.message, variant: 'destructive' }))
            }
        })
    }, [isConfirmed, lastConfirmedAction, dispatch, reset])

    const onSubmit = async (data: NotificationsSettingsFormData) => {
        const result = await updateNotificationSettings({
            email_notifications: {
                admin_alerts: data.emailNotifications.adminAlerts,
                fraud_alerts: data.emailNotifications.fraudAlerts,
                high_volume_sales: data.emailNotifications.highVolumeSales,
                failed_payouts: data.emailNotifications.failedPayouts,
            },
            sms_notifications: {
                admin_alerts: data.smsNotifications.adminAlerts,
                fraud_alerts: data.smsNotifications.fraudAlerts,
                high_volume_sales: data.smsNotifications.highVolumeSales,
                failed_payouts: data.smsNotifications.failedPayouts,
            },
        })
        if (result.success) {
            reset(data)
            dispatch(openSuccessModal({ title: 'Settings Saved', description: 'Notification preferences updated successfully.', variant: 'success' }))
        } else {
            dispatch(showAlert({ title: 'Save Failed', description: result.message, variant: 'destructive' }))
        }
    }

    const handleReset = () => reset()

    const handleResetSystem = () => {
        dispatch(openConfirmation({
            actionType: 'RESET_SETTINGS',
            title: 'Reset Notification Settings',
            description: 'This will restore all notification settings to defaults.',
            confirmText: 'Yes, Reset',
        }))
    }

    const emailEnabled = watch('emailNotificationsEnabled')
    const smsEnabled = watch('smsNotificationsEnabled')
    const emailNotifications = watch('emailNotifications')
    const smsNotifications = watch('smsNotifications')

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mt-4 pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, 'text-brand-secondary-8 font-bold text-lg')}>Notifications</h2>
                <button type="button" onClick={handleResetSystem}
                    className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors">
                    Reset System
                </button>
            </div>

            {/* Email Notifications */}
            <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between max-w-100">
                    <div>
                        <h3 className="text-base font-bold text-brand-secondary-8 mb-1">Email Notifications:</h3>
                        <p className="text-sm text-brand-secondary-9">Choose the type of emails you'd like to receive</p>
                    </div>
                    <Switch
                        checked={emailEnabled}
                        disabled={isLoading}
                        onCheckedChange={v => setValue('emailNotificationsEnabled', v, { shouldDirty: true })}
                    />
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />

                <div className="space-y-4 ml-4">
                    {NOTIFICATION_TYPES.map(type => (
                        <div key={type.value} className="flex items-center space-x-3">
                            <Checkbox
                                id={`email-${type.value}`}
                                checked={emailNotifications[type.value as keyof typeof emailNotifications]}
                                onCheckedChange={checked => setValue(`emailNotifications.${type.value}` as any, !!checked, { shouldDirty: true })}
                                disabled={!emailEnabled || isLoading}
                                className="data-[state=checked]:bg-brand-primary-6 data-[state=checked]:border-brand-primary-6"
                            />
                            <Label htmlFor={`email-${type.value}`}
                                className={cn('text-sm font-normal cursor-pointer', !emailEnabled ? 'text-brand-neutral-5' : 'text-brand-secondary-9')}>
                                {type.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* SMS Notifications */}
            <div className="space-y-6 mb-28">
                <div className="flex items-center justify-between max-w-100">
                    <div>
                        <h3 className="text-base font-bold text-brand-secondary-8 mb-1">SMS Notifications:</h3>
                        <p className="text-sm text-brand-secondary-9">Manage your SMS notification preferences</p>
                    </div>
                    <Switch
                        checked={smsEnabled}
                        disabled={isLoading}
                        onCheckedChange={v => setValue('smsNotificationsEnabled', v, { shouldDirty: true })}
                    />
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />

                <div className="space-y-4 ml-4">
                    {NOTIFICATION_TYPES.map(type => (
                        <div key={type.value} className="flex items-center space-x-3">
                            <Checkbox
                                id={`sms-${type.value}`}
                                checked={smsNotifications[type.value as keyof typeof smsNotifications]}
                                onCheckedChange={checked => setValue(`smsNotifications.${type.value}` as any, !!checked, { shouldDirty: true })}
                                disabled={!smsEnabled || isLoading}
                                className="data-[state=checked]:bg-brand-primary-6 data-[state=checked]:border-brand-primary-6"
                            />
                            <Label htmlFor={`sms-${type.value}`}
                                className={cn('text-sm font-normal cursor-pointer', !smsEnabled ? 'text-brand-neutral-5' : 'text-brand-secondary-9')}>
                                {type.label}
                            </Label>
                        </div>
                    ))}
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