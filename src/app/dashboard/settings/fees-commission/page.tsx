'use client'

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormField, FormItem, } from "@/components/ui/form"
import SettingsFormActions from "@/components/custom-utils/buttons/SettingsFormActionBtn"
import { openConfirmation } from "@/lib/redux/slices/confirmationSlice"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import CustomPercentageInput from "@/components/custom-utils/inputs/CustomPercentageInput"
import { FeesCommissionsForm, feesCommissionsSchema } from "@/schemas/settings.schema"


const DEFAULT_VALUES: FeesCommissionsForm = {
    ticketResellCommission: 25,
    sellerServiceFee: 10,
    buyerServiceFee: 10,
    taxVatEnabled: true,
}

const FACTORY_DEFAULTS: FeesCommissionsForm = {
    ticketResellCommission: 20,
    sellerServiceFee: 5,
    buyerServiceFee: 5,
    taxVatEnabled: false,
}


export default function FeesCommissionsPage() {

    const { lastConfirmedAction, isConfirmed } = useAppSelector(store => store.confirmation)
    const dispatch = useAppDispatch()

    const form = useForm<FeesCommissionsForm>({
        resolver: zodResolver(feesCommissionsSchema),
        defaultValues: DEFAULT_VALUES,
    })

    const { formState: { isDirty, isSubmitting }, reset, handleSubmit } = form


    const onSubmit = async (data: FeesCommissionsForm) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        console.log('Saving fees & commissions:', data)
        
        // Reset form with new values (marks as pristine)
        reset(data)
        
        alert('Fees & Commissions saved successfully!')
    }

    const handleReset = () => {
        reset(DEFAULT_VALUES)
    }

    const handleResetSystem = () => {
        dispatch(openConfirmation({
            actionType: "RESET_SETTINGS",
            description: "Are you sure you want to reset system? This will erase all previous settings to default",
            title: "Reset System"
        }))
    }


    useEffect(() => {
        if (isConfirmed && lastConfirmedAction === "RESET_SETTINGS") {
            reset(FACTORY_DEFAULTS)
        }
    }, [isConfirmed, lastConfirmedAction, reset])

    return (
        <div className="max-w-5xl pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>
                    Fees & Commissions
                </h2>
                <button
                    onClick={handleResetSystem}
                    className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                >
                    Reset System
                </button>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Fee Inputs */}
                    <div className="space-y-6 mb-10 max-w-52">
                        <FormField
                            control={form.control}
                            name="ticketResellCommission"
                            render={({ field }) => (
                                <FormItem>
                                    <CustomPercentageInput
                                        id="resell-commission"
                                        label="Ticket Resell Commission"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={field.value}
                                        onChange={(v) => field.onChange(parseFloat(v) || 0)}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sellerServiceFee"
                            render={({ field }) => (
                                <FormItem>
                                    <CustomPercentageInput
                                        id="seller-fee"
                                        label="Seller Service Fee"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={field.value}
                                        onChange={(v) => field.onChange(parseFloat(v) || 0)}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="buyerServiceFee"
                            render={({ field }) => (
                                <FormItem>
                                    <CustomPercentageInput
                                        id="buyer-fee"
                                        label="Buyer Service Fee"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={field.value}
                                        onChange={(v) => field.onChange(parseFloat(v) || 0)}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Tax/VAT Toggle Section */}
                    <div className="space-y-6 mb-28">
                        <div>
                            <h2 className="text-base font-bold text-brand-secondary-9 mb-1">Tax/VAT toggle</h2>
                            <p className="text-sm text-brand-secondary-9">Set default pricing to include or exclude VAT.</p>
                        </div>

                        <hr className="block border border-dashed border-brand-secondary-2" />

                        <FormField
                            control={form.control}
                            name="taxVatEnabled"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between max-w-sm">
                                        <Label htmlFor="tax-vat" className="text-sm font-normal text-brand-secondary-9 cursor-pointer">
                                            Turn on Tax/VAT Charges
                                        </Label>
                                        <FormControl>
                                            <Switch
                                                id="tax-vat"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <SettingsFormActions
                        onSave={handleSubmit(onSubmit)}
                        onReset={handleReset}
                        isSaving={isSubmitting}
                        isDisabled={!isDirty}
                    />
                </form>
            </Form>
        </div>
    )
}