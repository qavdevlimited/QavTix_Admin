'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import SettingsFormActions from '@/components/custom-utils/buttons/SettingsFormActionBtn'
import { openConfirmation, resetConfirmationStatus } from '@/lib/redux/slices/confirmationSlice'
import { openSuccessModal } from '@/lib/redux/slices/successModalSlice'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import CustomPercentageInput from '@/components/custom-utils/inputs/CustomPercentageInput'
import { FeesCommissionsForm, feesCommissionsSchema } from '@/schemas/settings.schema'
import { getFeesSettings, updateFeesSettings, ResetAllSettings } from '@/actions/settings'
import { AnimatePresence, motion } from 'framer-motion'

export default function FeesCommissionsPage() {
    const dispatch = useAppDispatch()
    const { lastConfirmedAction, isConfirmed } = useAppSelector(s => s.confirmation)
    const [isLoading, setIsLoading] = useState(true)

    const form = useForm<FeesCommissionsForm>({
        resolver: zodResolver(feesCommissionsSchema),
        defaultValues: {
            ticketResellCommission: 20,
            sellerServiceFee: 5,
            buyerServiceFee: 5,
            vatPercentage: 0,
            vatEnabled: false,
            pricesIncludeVat: false
        },
    })

    const { formState: { isDirty, isSubmitting }, reset, handleSubmit, watch } = form

    const vatEnabled = watch('vatEnabled')

    // Fetch initial data
    useEffect(() => {
        getFeesSettings().then(res => {
            if (res.success) {
                reset({
                    ticketResellCommission: res.data.ticket_resell_commission,
                    sellerServiceFee: res.data.seller_service_fee,
                    buyerServiceFee: res.data.buyer_service_fee,
                    vatPercentage: res.data.vat_percentage ?? 0,
                    vatEnabled: res.data.vat_enabled,
                    pricesIncludeVat: res.data.prices_include_vat,
                })
            } else {
                dispatch(showAlert({ title: 'Failed to load settings', description: res.message, variant: 'destructive' }))
            }
            setIsLoading(false)
        })
    }, [reset, dispatch])

    useEffect(() => {
        if (!isConfirmed || lastConfirmedAction !== 'RESET_SETTINGS') return
        dispatch(resetConfirmationStatus())
        ResetAllSettings().then(res => {
            if (res.success) {
                const f = res.data.fees
                reset({
                    ticketResellCommission: f.ticket_resell_commission,
                    sellerServiceFee: f.seller_service_fee,
                    buyerServiceFee: f.buyer_service_fee,
                    vatPercentage: f.vat_percentage ?? 0,
                    vatEnabled: f.vat_enabled,
                    pricesIncludeVat: f.prices_include_vat,
                })
                dispatch(openSuccessModal({ title: 'Settings Reset', description: 'All settings restored to factory defaults.', variant: 'success' }))
            } else {
                dispatch(showAlert({ title: 'Reset Failed', description: res.message, variant: 'destructive' }))
            }
        })
    }, [isConfirmed, lastConfirmedAction, dispatch, reset])

    const onSubmit = async (data: FeesCommissionsForm) => {
        const result = await updateFeesSettings({
            ticket_resell_commission: data.ticketResellCommission,
            seller_service_fee: data.sellerServiceFee,
            buyer_service_fee: data.buyerServiceFee,
            vat_percentage: data.vatPercentage as number,
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

    return (
        <div className="max-w-5xl pb-20">
            <div className="flex items-center justify-between mt-4 mb-8">
                <h2 className={cn(space_grotesk.className, 'text-brand-secondary-8 font-bold text-lg')}>Fees & Commissions</h2>
                <button type="button" onClick={() => dispatch(openConfirmation({
                    actionType: 'RESET_SETTINGS',
                    title: 'Reset Fee Settings',
                    description: 'This will restore all fee & commission settings to factory defaults. Continue?',
                    confirmText: 'Yes, Reset',
                }))}
                    className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors">
                    Reset System
                </button>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
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

                        {/* Conditionally Rendered VAT Percentage Input */}
                        <AnimatePresence>
                            {vatEnabled && (
                                <motion.div
                                    key='vat-percentage'
                                    initial={{ opacity: 0, height: 0, y: 20 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, scale: 0.95, transition: { duration: 0.3 } }}
                                    layout
                                    className="overflow-hidden"
                                >
                                    <FormField
                                        control={form.control}
                                        name="vatPercentage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <CustomPercentageInput
                                                    id="vat-percentage"
                                                    label="VAT Percentage"
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                    disabled={isLoading}
                                                    value={field.value}
                                                    onChange={(v) => field.onChange(parseFloat(v) || 0)}
                                                />
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-6 mb-28">
                        <div>
                            <h2 className="text-base font-bold text-brand-secondary-9 mb-1">Tax / VAT</h2>
                            <p className="text-sm text-brand-secondary-9">Set default pricing to include or exclude VAT.</p>
                        </div>

                        <hr className="block border border-dashed border-brand-secondary-2" />

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
                        onReset={() => reset()}
                        isSaving={isSubmitting}
                        isDisabled={!isDirty || isLoading}
                    />
                </form>
            </Form>
        </div>
    )
}