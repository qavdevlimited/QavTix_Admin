'use client'

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { CURRENCIES, TIMEZONES } from "@/components-data/settings-data-options"
import { openConfirmation } from "@/lib/redux/slices/confirmationSlice"
import SettingsFormActions from "@/components/custom-utils/buttons/SettingsFormActionBtn"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import CustomInput2 from "@/components/custom-utils/inputs/CustomInput2"

interface GeneralSettingsForm {
    platformEmail: string
    defaultCurrency: string
    defaultTimezone: string
    sellerVerificationRequired: boolean
    autoApproveListing: boolean
}

export default function GeneralSettingsPage() {
    
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    
    // Initial saved state
    const [savedSettings] = useState<GeneralSettingsForm>({
        platformEmail: 'inquiries@qavtix.com',
        defaultCurrency: 'USD',
        defaultTimezone: 'GMT+1',
        sellerVerificationRequired: true,
        autoApproveListing: false
    })
    
    // Current form state
    const [formData, setFormData] = useState<GeneralSettingsForm>(savedSettings)

    const { lastConfirmedAction, isConfirmed } = useAppSelector(store => store.confirmation)
    const dispatch = useAppDispatch()
    
    // Track changes
    const handleChange = (field: keyof GeneralSettingsForm, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setHasChanges(true)
    }
    
    const handleSave = async () => {
        setIsSaving(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        console.log('Saving settings:', formData)
        setIsSaving(false)
        setHasChanges(false)
    }
    
    const handleReset = () => {
        setFormData(savedSettings)
        setHasChanges(false)
    }
    
    const handleResetSystem = () => {
        dispatch(openConfirmation({
            actionType: "RESET_SETTINGS",
            description: "Are you sure you want to reset system? This will erase all previous settings to default",
            title: "Reset System"
        }))
    }
    
    const selectedCurrency = CURRENCIES.find(c => c.value === formData.defaultCurrency)


    useEffect(() => {
        if (isConfirmed && lastConfirmedAction === "RESET_SETTINGS") {
            // Reset to factory defaults
            const defaults: GeneralSettingsForm = {
                platformEmail: 'support@qavtix.com',
                defaultCurrency: 'USD',
                defaultTimezone: 'GMT+0',
                sellerVerificationRequired: false,
                autoApproveListing: true
            }
            setFormData(defaults)
            setHasChanges(true)
        }
    },[isConfirmed, lastConfirmedAction])
    
    return (
        <div className="max-w-5xl mt-4 pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>General Settings</h2>
                <button
                    onClick={handleResetSystem}
                    className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                >
                    Reset System
                </button>
            </div>
            
            {/* System Section */}
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
                        value={formData.platformEmail}
                        onChange={(e) => handleChange('platformEmail', e.target.value)}
                        placeholder="inquiries@qavtix.com"
                        className="h-14 rounded-md!"
                    />
                </div>
                
                {/* Default Currency */}
                <div className="max-w-sm">
                    <Label htmlFor="default-currency" className="text-sm font-medium text-brand-secondary-9 mb-2 block">
                        Default Currency
                    </Label>
                    <Select 
                        value={formData.defaultCurrency} 
                        onValueChange={(value) => handleChange('defaultCurrency', value)}
                    >
                        <SelectTrigger 
                            id="default-currency" 
                            className="h-14! w-full bg-white rounded-md outline-none  text-brand-neutral-9 placeholder:text-brand-secondary-5 border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6"
                        >
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
                            {CURRENCIES.map((currency) => (
                                <SelectItem key={currency.value} value={currency.value}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{currency.flag}</span>
                                        <span>{currency.label}</span>
                                        <span className="text-brand-neutral-6 text-xs">({currency.code})</span>
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
                        value={formData.defaultTimezone} 
                        onValueChange={(value) => handleChange('defaultTimezone', value)}
                    >
                        <SelectTrigger 
                            id="default-timezone" 
                            className="h-14! w-full bg-white rounded-md outline-none  text-brand-neutral-9 placeholder:text-brand-secondary-5 border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {TIMEZONES.map((timezone) => (
                                <SelectItem key={timezone.value} value={timezone.value}>
                                    {timezone.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {/* User & Seller Policies Section */}
            <div className="space-y-6 mb-28">
                <div>
                    <h2 className="text-base font-bold text-brand-secondary-9 mb-1">User & Seller Policies:</h2>
                    <p className="text-sm text-brand-secondary-9">Manage Verification & Approval preferences</p>
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />
                
                {/* Seller verification required */}
                <div className="flex items-center justify-between max-w-sm">
                    <Label htmlFor="seller-verification" className="font-normal text-sm text-brand-secondary-9 cursor-pointer">
                        Seller verification required
                    </Label>
                    <Switch
                        id="seller-verification"
                        checked={formData.sellerVerificationRequired}
                        onCheckedChange={(checked) => handleChange('sellerVerificationRequired', checked)}
                    />
                </div>
                
                {/* Auto-approve listing */}
                <div className="flex items-center justify-between max-w-sm">
                    <Label htmlFor="auto-approve" className="text-sm font-normal text-brand-secondary-9 cursor-pointer">
                        Auto-approve listing
                    </Label>
                    <Switch
                        id="auto-approve"
                        checked={formData.autoApproveListing}
                        onCheckedChange={(checked) => handleChange('autoApproveListing', checked)}
                    />
                </div>
            </div>
            
            <SettingsFormActions
                onSave={handleSave}
                onReset={handleReset}
                isSaving={isSaving}
                isDisabled={!hasChanges}
            />
        </div>
    )
}