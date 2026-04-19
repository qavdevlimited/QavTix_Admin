'use client'

import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation } from "@/lib/redux/slices/confirmationSlice"
import SettingsFormActions from "@/components/custom-utils/buttons/SettingsFormActionBtn"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { NotificationsSettingsFormData, notificationsSettingsSchema } from "@/schemas/settings.schema"
import { NOTIFICATION_TYPES } from "@/components-data/settings-data-options"




export default function NotificationsPage() {
    
    const { lastConfirmedAction, isConfirmed } = useAppSelector(store => store.confirmation)
    const dispatch = useAppDispatch()

    const defaultValues: NotificationsSettingsFormData = {
        emailNotificationsEnabled: true,
        emailNotifications: {
            adminAlerts: true,
            fraudAlerts: false,
            highVolumeSales: false,
            failedPayouts: false
        },
        smsNotificationsEnabled: false,
        smsNotifications: {
            adminAlerts: false,
            fraudAlerts: false,
            highVolumeSales: false,
            failedPayouts: false
        }
    }

    const {
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting }
    } = useForm<NotificationsSettingsFormData>({
        resolver: zodResolver(notificationsSettingsSchema),
        defaultValues
    })

    const emailEnabled = watch('emailNotificationsEnabled')
    const smsEnabled = watch('smsNotificationsEnabled')
    const emailNotifications = watch('emailNotifications')
    const smsNotifications = watch('smsNotifications')

    const onSubmit : SubmitHandler<NotificationsSettingsFormData> = async (data) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log('Saving notifications settings:', data)
        reset(data)
    }

    const handleReset = () => {
        reset()
    }

    const handleResetSystem = () => {
        dispatch(openConfirmation({
            actionType: "RESET_SETTINGS",
            description: "Are you sure you want to reset notification settings? This will restore all defaults.",
            title: "Reset System"
        }))
    }

    useEffect(() => {
        if (isConfirmed && lastConfirmedAction === "RESET_SETTINGS") {
            reset(defaultValues)
        }
    }, [isConfirmed, lastConfirmedAction, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mt-4 pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>
                    Notifications
                </h2>
                <button
                    type="button"
                    onClick={handleResetSystem}
                    className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                >
                    Reset System
                </button>
            </div>

            {/* Email Notifications Section */}
            <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between max-w-100">
                    <div>
                        <h3 className="text-base font-bold text-brand-secondary-8 mb-1">
                            Email Notifications:
                        </h3>
                        <p className="text-sm text-brand-secondary-9">
                            Choose the type of emails you'd like to receive
                        </p>
                    </div>
                    <Switch
                        checked={emailEnabled}
                        onCheckedChange={(checked) => setValue('emailNotificationsEnabled', checked, { shouldDirty: true })}
                    />
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />


                <div className="space-y-4 ml-4">
                    {NOTIFICATION_TYPES.map((type) => (
                        <div key={type.value} className="flex items-center space-x-3">
                            <Checkbox
                                id={`email-${type.value}`}
                                checked={emailNotifications[type.value]}
                                onCheckedChange={(checked) => 
                                    setValue(`emailNotifications.${type.value}`, !!checked, { shouldDirty: true })
                                }
                                disabled={!emailEnabled}
                                className="data-[state=checked]:bg-brand-primary-6 data-[state=checked]:border-brand-primary-6"
                            />
                            <Label
                                htmlFor={`email-${type.value}`}
                                className={cn(
                                    "text-sm font-normal cursor-pointer",
                                    !emailEnabled ? "text-brand-neutral-5" : "text-brand-secondary-9"
                                )}
                            >
                                {type.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* SMS Notifications Section */}
            <div className="space-y-6 mb-28">
                <div className="flex items-center justify-between max-w-100">
                    <div>
                        <h3 className="text-base font-bold text-brand-secondary-8 mb-1">
                            SMS Notifications:
                        </h3>
                        <p className="text-sm text-brand-secondary-9">
                            Manage your SMS notification preferences
                        </p>
                    </div>
                    <Switch
                        checked={smsEnabled}
                        onCheckedChange={(checked) => setValue('smsNotificationsEnabled', checked, { shouldDirty: true })}
                    />
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />


                <div className="space-y-4 ml-4">
                    {NOTIFICATION_TYPES.map((type) => (
                        <div key={type.value} className="flex items-center space-x-3">
                            <Checkbox
                                id={`sms-${type.value}`}
                                checked={smsNotifications[type.value]}
                                onCheckedChange={(checked) => 
                                    setValue(`smsNotifications.${type.value}`, !!checked, { shouldDirty: true })
                                }
                                disabled={!smsEnabled}
                                className="data-[state=checked]:bg-brand-primary-6 data-[state=checked]:border-brand-primary-6"
                            />
                            <Label
                                htmlFor={`sms-${type.value}`}
                                className={cn(
                                    "text-sm font-normal cursor-pointer",
                                    !smsEnabled ? "text-brand-neutral-5" : "text-brand-secondary-9"
                                )}
                            >
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
                isDisabled={!isDirty}
            />
        </form>
    )
}