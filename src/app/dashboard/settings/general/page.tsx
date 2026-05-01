'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
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
import { getGeneralSettings, getPoliciesSettings } from "@/actions/settings/client"
import { updateGeneralSettings, updatePoliciesSettings, ResetAllSettings } from "@/actions/settings/client"
import { getAuthToken } from "@/helper-fns/getAuthToken"
import { Icon } from '@iconify/react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
export default function GeneralSettingsPage() {
    const dispatch = useAppDispatch()
    const { lastConfirmedAction, isConfirmed } = useAppSelector(s => s.confirmation)

    const form = useForm<GeneralSettingsForm>({
        resolver: zodResolver(generalSettingsSchema),
        defaultValues: {
            platformSupportEmail: '',
            defaultCurrencyCode: 'USD',
            defaultTimezone: 'Africa/Lagos',
            sellerVerificationRequired: true,
            autoApproveListing: false,
        },
    })

    const { formState: { isDirty, isSubmitting }, reset, handleSubmit, watch, setValue } = form

    // ── Fetch initial data (general + policies in parallel) ─────────────────
    useEffect(() => {
        getAuthToken().then(token => {
            Promise.all([getGeneralSettings(token), getPoliciesSettings(token)]).then(([genRes, polRes]) => {
                const patch: Partial<GeneralSettingsForm> = {}

                if (genRes.success) {
                    patch.platformSupportEmail = genRes.data.platform_support_email
                    patch.defaultCurrencyCode = genRes.data.default_currency.code
                    patch.defaultTimezone = genRes.data.default_timezone
                } else {
                    dispatch(showAlert({ title: 'Failed to load settings', description: genRes.message, variant: 'destructive' }))
                }

                if (polRes.success) {
                    patch.sellerVerificationRequired = polRes.data.seller_verification_required
                    patch.autoApproveListing = polRes.data.auto_approve_listing
                } else {
                    dispatch(showAlert({ title: 'Failed to load policies', description: polRes.message, variant: 'destructive' }))
                }

                reset(patch as GeneralSettingsForm)
                dispatch(resetConfirmationStatus())
            })
        })
    }, [reset, dispatch])

    // ── Reset to factory defaults ────────────────────────────────────────────
    useEffect(() => {
        if (!isConfirmed || lastConfirmedAction !== 'RESET_SETTINGS') return
        ResetAllSettings().then(res => {
            if (res.success) {
                const g = res.data.general
                const p = res.data.policies
                reset({
                    platformSupportEmail: g.platform_support_email,
                    defaultCurrencyCode: g.default_currency.code,
                    defaultTimezone: g.default_timezone,
                    sellerVerificationRequired: p?.seller_verification_required ?? true,
                    autoApproveListing: p?.auto_approve_listing ?? false,
                })
                dispatch(openSuccessModal({ title: 'Settings Reset', description: 'All settings restored to factory defaults.', variant: 'success' }))
            } else {
                dispatch(showAlert({ title: 'Reset Failed', description: res.message, variant: 'destructive' }))
            }
        })
    }, [isConfirmed, lastConfirmedAction, dispatch, reset])

    // ── Submit: fire general + policies PATCHes concurrently ─────────────────
    const onSubmit = async (data: GeneralSettingsForm) => {
        const [generalResult, policiesResult] = await Promise.all([
            updateGeneralSettings({
                platform_support_email: data.platformSupportEmail,
                default_currency: {
                    code: data.defaultCurrencyCode,
                    label: CURRENCIES.find(c => c.value === data.defaultCurrencyCode)?.label ?? data.defaultCurrencyCode,
                },
                default_timezone: data.defaultTimezone,
            }),
            updatePoliciesSettings({
                seller_verification_required: data.sellerVerificationRequired,
                auto_approve_listing: data.autoApproveListing,
            }),
        ])

        const failed = [generalResult, policiesResult].filter(r => !r.success)
        if (failed.length === 0) {
            reset(data)
            dispatch(openSuccessModal({ title: 'Settings Saved', description: 'General settings updated successfully.', variant: 'success' }))
        } else {
            dispatch(showAlert({ title: 'Save Failed', description: failed.map(r => r.message).join(' '), variant: 'destructive' }))
        }
    }

    const selectedCurrency = CURRENCIES.find(c => c.value === watch('defaultCurrencyCode'))

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mt-4 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className={cn(space_grotesk.className, 'text-brand-secondary-8 font-bold text-lg')}>General Settings</h2>
                    <button
                        type="button"
                        onClick={() => dispatch(openConfirmation({
                            actionType: 'RESET_SETTINGS',
                            title: 'Reset General Settings',
                            description: 'This will restore all general settings to factory defaults. Continue?',
                            confirmText: 'Yes, Reset',
                        }))}
                        className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                    >
                        Reset System
                    </button>
                </div>

                {/* ── System ────────────────────────────────────────────── */}
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
                            disabled={isSubmitting}
                            {...form.register('platformSupportEmail')}
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
                            disabled={true}
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
                            disabled={isSubmitting}
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

                {/* ── User & Seller Policies ─────────────────────────────── */}
                <div className="space-y-6 mb-28">
                    <div>
                        <h2 className="text-base font-bold text-brand-secondary-9 mb-1">User &amp; Seller Policies</h2>
                        <p className="text-sm text-brand-secondary-9">Manage Verification &amp; Approval preferences</p>
                    </div>

                    <hr className="block border border-dashed border-brand-secondary-2" />

                    {/* Seller verification required */}
                    <FormField
                        control={form.control}
                        name="sellerVerificationRequired"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between max-w-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Label
                                            htmlFor="seller-verification"
                                            className="text-sm font-normal text-brand-secondary-9 cursor-pointer"
                                        >
                                            Seller verification required
                                        </Label>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    id="seller-verification-info"
                                                    aria-label="Seller verification required: what this means"
                                                    className="text-neutral-6 hover:text-neutral-8 transition-colors"
                                                >
                                                    <Icon icon="carbon:information" className="size-4 text-accent-6" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>When enabled, sellers must be verified before listing events.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            id="seller-verification"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isSubmitting}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Auto-approve listing */}
                    <FormField
                        control={form.control}
                        name="autoApproveListing"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between max-w-sm">
                                    <Label
                                        htmlFor="auto-approve-listing"
                                        className="text-sm font-normal text-brand-secondary-9 cursor-pointer"
                                    >
                                        Auto-approve listing
                                    </Label>
                                    <FormControl>
                                        <Switch
                                            id="auto-approve-listing"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isSubmitting}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <SettingsFormActions
                    onSave={() => handleSubmit(onSubmit)()}
                    onReset={() => reset()}
                    isSaving={isSubmitting}
                    isDisabled={!isDirty || isSubmitting}
                />
            </form>
        </Form>
    )
}