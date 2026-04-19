'use client'

import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation } from "@/lib/redux/slices/confirmationSlice"
import SettingsFormActions from "@/components/custom-utils/buttons/SettingsFormActionBtn"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { LocalizationSettingsFormData, localizationSettingsSchema } from "@/schemas/settings.schema"
import { COUNTRIES, CURRENCIES, DATE_TIME_FORMATS, LANGUAGES } from "@/components-data/settings-data-options"
import SettingsLocalizationTag from "@/components/custom-utils/tags/SettingsLocalizationTag"



export default function LocalizationPage() {
    
    const { lastConfirmedAction, isConfirmed } = useAppSelector(store => store.confirmation)
    const dispatch = useAppDispatch()

    const defaultValues: LocalizationSettingsFormData = {
        supportedCountries: ['GH', 'IN', 'NG', 'ZA', 'GB', 'US'],
        supportedCurrencies: ['GHC', 'INR', 'NGN', 'ZAR', 'GBP', 'USD'],
        defaultLanguage: 'en',
        dateTimeFormat: '24h'
    }

    const {
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting }
    } = useForm<LocalizationSettingsFormData>({
        resolver: zodResolver(localizationSettingsSchema),
        defaultValues
    })

    const supportedCountries = watch('supportedCountries')
    const supportedCurrencies = watch('supportedCurrencies')
    const defaultLanguage = watch('defaultLanguage')
    const dateTimeFormat = watch('dateTimeFormat')

    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
    const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)

    const onSubmit : SubmitHandler<LocalizationSettingsFormData> = async (data) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log('Saving localization settings:', data)
        reset(data)
    }

    const handleReset = () => {
        reset()
    }

    const handleResetSystem = () => {
        dispatch(openConfirmation({
            actionType: "RESET_SETTINGS",
            description: "Are you sure you want to reset localization settings? This will restore all defaults.",
            title: "Reset System"
        }))
    }

    const addCountry = (countryCode: string) => {
        if (!supportedCountries.includes(countryCode)) {
            setValue('supportedCountries', [...supportedCountries, countryCode], { shouldDirty: true })
        }
    }

    const removeCountry = (countryCode: string) => {
        setValue(
            'supportedCountries',
            supportedCountries.filter(c => c !== countryCode),
            { shouldDirty: true }
        )
    }

    const addCurrency = (currencyCode: string) => {
        if (!supportedCurrencies.includes(currencyCode)) {
            setValue('supportedCurrencies', [...supportedCurrencies, currencyCode], { shouldDirty: true })
        }
    }

    const removeCurrency = (currencyCode: string) => {
        setValue(
            'supportedCurrencies',
            supportedCurrencies.filter(c => c !== currencyCode),
            { shouldDirty: true }
        )
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
                    Localization
                </h2>
                <button
                    type="button"
                    onClick={handleResetSystem}
                    className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                >
                    Reset System
                </button>
            </div>

            {/* Supported Countries */}
            <div className="space-y-6 mb-10">
                <div>
                    <h3 className="text-base font-bold text-brand-secondary-8 mb-1">
                        Supported Countries:
                    </h3>
                    <p className="text-sm text-brand-secondary-9">
                        Countries where the Qavtix is active.
                    </p>
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />

                <div className="flex flex-wrap gap-3">
                    {supportedCountries.map(countryCode => {
                        const country = COUNTRIES.find(c => c.value === countryCode)
                        if (!country) return null
                        return (
                            <SettingsLocalizationTag
                                key={countryCode}
                                flag={country.flag}
                                label={country.label}
                                onRemove={() => removeCountry(countryCode)}
                            />
                        )
                    })}
                </div>

                <DropdownMenu open={countryDropdownOpen} onOpenChange={setCountryDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                        >
                            <Icon icon="mdi:plus" className="size-5" />
                            Add Country
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        {COUNTRIES.map(country => (
                            <DropdownMenuCheckboxItem
                                key={country.value}
                                checked={supportedCountries.includes(country.value)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        addCountry(country.value)
                                    } else {
                                        removeCountry(country.value)
                                    }
                                }}
                            >
                                <span className="text-base mr-2">{country.flag}</span>
                                {country.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Supported Currencies */}
            <div className="space-y-6 mb-10">
                <div>
                    <h3 className="text-base font-bold text-brand-secondary-8 mb-1">
                        Supported Currencies:
                    </h3>
                    <p className="text-sm text-brand-secondary-9">
                        Currencies supported by the Qavtix.
                    </p>
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />

                <div className="flex flex-wrap gap-3">
                    {supportedCurrencies.map(currencyCode => {
                        const currency = CURRENCIES.find(c => c.value === currencyCode)
                        if (!currency) return null
                        return (
                            <SettingsLocalizationTag
                                key={currencyCode}
                                flag={currency.flag}
                                label={currency.label}
                                onRemove={() => removeCurrency(currencyCode)}
                            />
                        )
                    })}
                </div>

                <DropdownMenu open={currencyDropdownOpen} onOpenChange={setCurrencyDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                        >
                            <Icon icon="mdi:plus" className="size-5" />
                            Add Currency
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        {CURRENCIES.map(currency => (
                            <DropdownMenuCheckboxItem
                                key={currency.value}
                                checked={supportedCurrencies.includes(currency.value)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        addCurrency(currency.value)
                                    } else {
                                        removeCurrency(currency.value)
                                    }
                                }}
                            >
                                <span className="text-base mr-2">{currency.flag}</span>
                                {currency.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Select Language */}
            <div className="space-y-2 mb-8 max-w-sm">
                <Label htmlFor="language" className="text-sm font-medium text-brand-secondary-9">
                    Select Language
                </Label>
                <Select
                    value={defaultLanguage}
                    onValueChange={(value) => setValue('defaultLanguage', value, { shouldDirty: true })}
                >
                    <SelectTrigger
                        id="language"
                        className="h-14! w-full bg-white rounded-md outline-none text-brand-neutral-9 placeholder:text-brand-secondary-5 border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Date & Time Format */}
            <div className="space-y-2 mb-28 max-w-sm">
                <Label htmlFor="datetime" className="text-sm font-medium text-brand-secondary-9">
                    Date & Time format
                </Label>
                <Select
                    value={dateTimeFormat}
                    onValueChange={(value) => setValue('dateTimeFormat', value, { shouldDirty: true })}
                >
                    <SelectTrigger
                        id="datetime"
                        className="h-14! w-full bg-white rounded-md outline-none text-brand-neutral-9 placeholder:text-brand-secondary-5 border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {DATE_TIME_FORMATS.map(format => (
                            <SelectItem key={format.value} value={format.value}>
                                {format.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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