'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import SettingsFormActions from '@/components/custom-utils/buttons/SettingsFormActionBtn'
import { openConfirmation, resetConfirmationStatus } from '@/lib/redux/slices/confirmationSlice'
import { openSuccessModal } from '@/lib/redux/slices/successModalSlice'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import CustomPercentageInput from '@/components/custom-utils/inputs/CustomPercentageInput'
import { FeesCommissionsForm, feesCommissionsSchema } from '@/schemas/settings.schema'
import { getFeesSettings, updateFeesSettings } from '@/actions/settings'

const FACTORY_DEFAULTS: FeesCommissionsForm = {
    ticketResellCommission: 20,
    sellerServiceFee: 5,
    buyerServiceFee: 5,
    vatEnabled: false,
    pricesIncludeVat: false,
}

export default function FeesCommissionsPage() {
    const dispatch = useAppDispatch()
    const { lastConfirmedAction, isConfirmed } = useAppSelector(s => s.confirmation)
    const [isLoading, setIsLoading] = useState(true)

    const form = useForm<FeesCommissionsForm>({
        resolver: zodResolver(feesCommissionsSchema),
        defaultValues: FACTORY_DEFAULTS,
    })

    const { formState: { isDirty, isSubmitting }, reset, handleSubmit, watch } = form

    // Fetch initial data
    useEffect(() => {
        getFeesSettings().then(res => {
            if (res.success) {
                reset({
                    ticketResellCommission: res.data.ticket_resell_commission,
                    sellerServiceFee: res.data.seller_service_fee,
                    buyerServiceFee: res.data.buyer_service_fee,
                    vatEnabled: res.data.vat_enabled,
                    pricesIncludeVat: res.data.prices_include_vat,
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
        reset(FACTORY_DEFAULTS, { keepDirty: true })
    }, [isConfirmed, lastConfirmedAction, dispatch, reset])

    const onSubmit = async (data: FeesCommissionsForm) => {
        const result = await updateFeesSettings({
            ticket_resell_commission: data.ticketResellCommission,
            seller_service_fee: data.sellerServiceFee,
            buyer_service_fee: data.buyerServiceFee,
            vat_enabled: data.vatEnabled,
            prices_include_vat: data.pricesIncludeVat,
        })
        if (result.success) {
            reset(data)
            dispatch(openSuccessModal({ title: 'Settings Saved', description: 'Fee & commission settings updated successfully.', variant: 'success' }))
        } else {
            dispatch(showAlert({ title: 'Save Failed', description: result.message, variant: 'destructive' }))
        }
    }

    const handleReset = () => reset()

    const handleResetSystem = () => {
        dispatch(openConfirmation({
            actionType: 'RESET_SETTINGS',
            title: 'Reset Fee Settings',
            description: 'This will restore all fee & commission settings to factory defaults. Continue?',
            confirmText: 'Yes, Reset',
        }))
    }

    const vatEnabled = watch('vatEnabled')

    return (
        <div className="max-w-5xl pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, 'text-brand-secondary-8 font-bold text-lg')}>Fees & Commissions</h2>
                <button type="button" onClick={handleResetSystem}
                    className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors">
                    Reset System
                </button>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Fee inputs */}
                    <div className="space-y-6 mb-10 max-w-52">
                        <FormField control={form.control} name="ticketResellCommission"
                            render={({ field }) => (
                                <FormItem>
                                    <CustomPercentageInput
                                        id="resell-commission"
                                        label="Ticket Resell Commission"
                                        min="0" max="100" step="0.1"
                                        disabled={isLoading}
                                        value={field.value}
                                        onChange={v => field.onChange(parseFloat(v) || 0)}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="sellerServiceFee"
                            render={({ field }) => (
                                <FormItem>
                                    <CustomPercentageInput
                                        id="seller-fee"
                                        label="Seller Service Fee"
                                        min="0" max="100" step="0.1"
                                        disabled={isLoading}
                                        value={field.value}
                                        onChange={v => field.onChange(parseFloat(v) || 0)}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="buyerServiceFee"
                            render={({ field }) => (
                                <FormItem>
                                    <CustomPercentageInput
                                        id="buyer-fee"
                                        label="Buyer Service Fee"
                                        min="0" max="100" step="0.1"
                                        disabled={isLoading}
                                        value={field.value}
                                        onChange={v => field.onChange(parseFloat(v) || 0)}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Tax/VAT section */}
                    <div className="space-y-6 mb-28">
                        <div>
                            <h2 className="text-base font-bold text-brand-secondary-9 mb-1">Tax / VAT</h2>
                            <p className="text-sm text-brand-secondary-9">Set default pricing to include or exclude VAT.</p>
                        </div>

                        <hr className="block border border-dashed border-brand-secondary-2" />

                        {/* VAT enabled toggle */}
                        <FormField control={form.control} name="vatEnabled"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between max-w-sm">
                                        <Label htmlFor="vat-enabled" className="text-sm font-normal text-brand-secondary-9 cursor-pointer">
                                            Enable VAT Charges
                                        </Label>
                                        <FormControl>
                                            <Switch id="vat-enabled" checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Prices include VAT — only relevant when VAT is on */}
                        <FormField control={form.control} name="pricesIncludeVat"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between max-w-sm">
                                        <Label htmlFor="prices-include-vat"
                                            className={cn('text-sm font-normal cursor-pointer', vatEnabled ? 'text-brand-secondary-9' : 'text-brand-neutral-5')}>
                                            Prices Include VAT
                                        </Label>
                                        <FormControl>
                                            <Switch id="prices-include-vat" checked={field.value} onCheckedChange={field.onChange}
                                                disabled={isLoading || !vatEnabled} />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <SettingsFormActions
                        onSave={() => handleSubmit(onSubmit)()}
                        onReset={handleReset}
                        isSaving={isSubmitting}
                        isDisabled={!isDirty || isLoading}
                    />
                </form>
            </Form>
        </div>
    )
}