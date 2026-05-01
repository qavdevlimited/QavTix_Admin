'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { openConfirmation, resetConfirmationStatus } from '@/lib/redux/slices/confirmationSlice'
import { openSuccessModal } from '@/lib/redux/slices/successModalSlice'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import SettingsFormActions from '@/components/custom-utils/buttons/SettingsFormActionBtn'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import { LocalizationSettingsFormData, localizationSettingsSchema } from '@/schemas/settings.schema'
import { COUNTRIES, CURRENCIES, DATE_TIME_FORMATS, LANGUAGES } from '@/components-data/settings-data-options'
import SettingsLocalizationTag from '@/components/custom-utils/tags/SettingsLocalizationTag'
import { getLocalizationSettings } from "@/actions/settings/client"
import { updateLocalizationSettings, ResetAllSettings } from "@/actions/settings/client"
import { getAuthToken } from "@/helper-fns/getAuthToken"
// API sends country names like "Nigeria"; our COUNTRIES uses codes like "NG".
// These helpers bridge the gap.
const countryNameToCode = (name: string): string | undefined =>
    COUNTRIES.find(c => c.label.toLowerCase() === name.toLowerCase())?.value

const countryCodeToName = (code: string): string =>
    COUNTRIES.find(c => c.value === code)?.label ?? code

export default function LocalizationPage() {
    const dispatch = useAppDispatch()
    const { lastConfirmedAction, isConfirmed } = useAppSelector(s => s.confirmation)
    const [isLoading, setIsLoading] = useState(true)
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
    const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)

    const {
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm<LocalizationSettingsFormData>({
        resolver: zodResolver(localizationSettingsSchema),
        defaultValues: {
            supportedCountries: ['GH', 'NG', 'ZA', 'GB', 'US'],
            supportedCurrencies: ['GHS', 'NGN', 'ZAR', 'GBP', 'USD'],
            defaultLanguage: 'en',
            dateTimeFormat: '24h',
        },
    })

    // Fetch initial data
    useEffect(() => {
        getAuthToken().then(token => {
            getLocalizationSettings(token).then(res => {
                if (res.success) {
                    const d = res.data
                    // API sends country names — convert to codes for UI
                    const countryCodes = (d.supported_countries ?? [])
                        .map(countryNameToCode)
                        .filter(Boolean) as string[]

                    reset({
                        supportedCountries: countryCodes,
                        supportedCurrencies: d.supported_currencies ?? [],
                        defaultLanguage: d.language,
                        dateTimeFormat: d.date_time_format,
                    })
                } else {
                    dispatch(showAlert({ title: 'Failed to load settings', description: res.message, variant: 'destructive' }))
                }
                setIsLoading(false)
            })
        })
    }, [reset, dispatch])

    // RESET_SETTINGS confirmation — call API and use returned factory defaults
    useEffect(() => {
        if (!isConfirmed || lastConfirmedAction !== 'RESET_SETTINGS') return
        dispatch(resetConfirmationStatus())
        ResetAllSettings().then(res => {
            if (res.success) {
                const d = res.data.localization
                const countryCodes = (d.supported_countries ?? [])
                    .map(countryNameToCode)
                    .filter(Boolean) as string[]
                reset({
                    supportedCountries: countryCodes,
                    supportedCurrencies: d.supported_currencies ?? [],
                    defaultLanguage: d.language,
                    dateTimeFormat: d.date_time_format,
                })
                dispatch(openSuccessModal({ title: 'Settings Reset', description: 'All settings restored to factory defaults.', variant: 'success' }))
            } else {
                dispatch(showAlert({ title: 'Reset Failed', description: res.message, variant: 'destructive' }))
            }
        })
    }, [isConfirmed, lastConfirmedAction, dispatch, reset])

    const onSubmit = async (data: LocalizationSettingsFormData) => {
        // API expects country names, not codes
        const result = await updateLocalizationSettings({
            supported_countries: data.supportedCountries.map(countryCodeToName),
            supported_currencies: data.supportedCurrencies,
            language: data.defaultLanguage,
            date_time_format: data.dateTimeFormat,
        })
        if (result.success) {
            reset(data)
            dispatch(openSuccessModal({ title: 'Settings Saved', description: 'Localization settings updated successfully.', variant: 'success' }))
        } else {
            dispatch(showAlert({ title: 'Save Failed', description: result.message, variant: 'destructive' }))
        }
    }

    const handleReset = () => reset()

    const handleResetSystem = () => {
        dispatch(openConfirmation({
            actionType: 'RESET_SETTINGS',
            title: 'Reset Localization Settings',
            description: 'This will restore all localization settings to defaults.',
            confirmText: 'Yes, Reset',
        }))
    }

    const supportedCountries = watch('supportedCountries')
    const supportedCurrencies = watch('supportedCurrencies')
    const defaultLanguage = watch('defaultLanguage')
    const dateTimeFormat = watch('dateTimeFormat')

    const addCountry = (code: string) => {
        if (!supportedCountries.includes(code))
            setValue('supportedCountries', [...supportedCountries, code], { shouldDirty: true })
    }
    const removeCountry = (code: string) =>
        setValue('supportedCountries', supportedCountries.filter(c => c !== code), { shouldDirty: true })

    const addCurrency = (code: string) => {
        if (!supportedCurrencies.includes(code))
            setValue('supportedCurrencies', [...supportedCurrencies, code], { shouldDirty: true })
    }
    const removeCurrency = (code: string) =>
        setValue('supportedCurrencies', supportedCurrencies.filter(c => c !== code), { shouldDirty: true })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mt-4 pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, 'text-brand-secondary-8 font-bold text-lg')}>Localization</h2>
                <button type="button" onClick={handleResetSystem}
                    className="text-sm font-semibold bg-brand-primary-1 p-3 rounded-md text-brand-primary-6 hover:text-brand-primary-7 transition-colors">
                    Reset System
                </button>
            </div>

            {/* Supported Countries */}
            <div className="space-y-6 mb-10">
                <div>
                    <h3 className="text-base font-bold text-brand-secondary-8 mb-1">Supported Countries:</h3>
                    <p className="text-sm text-brand-secondary-9">Countries where Qavtix is active.</p>
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />

                <div className="flex flex-wrap gap-3">
                    {supportedCountries.map(code => {
                        const country = COUNTRIES.find(c => c.value === code)
                        if (!country) return null
                        return (
                            <SettingsLocalizationTag key={code} flag={country.flag} label={country.label} onRemove={() => removeCountry(code)} />
                        )
                    })}
                </div>

                <DropdownMenu open={countryDropdownOpen} onOpenChange={setCountryDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <button type="button" disabled={isLoading}
                            className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary-6 hover:text-brand-primary-7 transition-colors disabled:opacity-40">
                            <Icon icon="mdi:plus" className="size-5" />
                            Add Country
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto">
                        {COUNTRIES.map(country => (
                            <DropdownMenuCheckboxItem
                                key={country.value}
                                checked={supportedCountries.includes(country.value)}
                                onCheckedChange={checked => checked ? addCountry(country.value) : removeCountry(country.value)}
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
                    <h3 className="text-base font-bold text-brand-secondary-8 mb-1">Supported Currencies:</h3>
                    <p className="text-sm text-brand-secondary-9">Currencies supported by Qavtix.</p>
                </div>

                <hr className="block border border-dashed border-brand-secondary-2" />

                <div className="flex flex-wrap gap-3">
                    {supportedCurrencies.map(code => {
                        const currency = CURRENCIES.find(c => c.value === code)
                        if (!currency) return null
                        return (
                            <SettingsLocalizationTag key={code} flag={currency.flag} label={currency.label} onRemove={() => removeCurrency(code)} />
                        )
                    })}
                </div>

                <DropdownMenu open={currencyDropdownOpen} onOpenChange={setCurrencyDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <button type="button" disabled={isLoading}
                            className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary-6 hover:text-brand-primary-7 transition-colors disabled:opacity-40">
                            <Icon icon="mdi:plus" className="size-5" />
                            Add Currency
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto">
                        {CURRENCIES.map(currency => (
                            <DropdownMenuCheckboxItem
                                key={currency.value}
                                checked={supportedCurrencies.includes(currency.value)}
                                onCheckedChange={checked => checked ? addCurrency(currency.value) : removeCurrency(currency.value)}
                            >
                                <span className="text-base mr-2">{currency.flag}</span>
                                {currency.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Language */}
            <div className="space-y-2 mb-8 max-w-sm">
                <Label htmlFor="language" className="text-sm font-medium text-brand-secondary-9">Select Language</Label>
                <Select value={defaultLanguage} disabled={isLoading}
                    onValueChange={v => setValue('defaultLanguage', v, { shouldDirty: true })}>
                    <SelectTrigger id="language" className="h-14! w-full bg-white rounded-md outline-none text-brand-neutral-9 border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Date & Time Format */}
            <div className="space-y-2 mb-28 max-w-sm">
                <Label htmlFor="datetime" className="text-sm font-medium text-brand-secondary-9">Date & Time Format</Label>
                <Select value={dateTimeFormat} disabled={isLoading}
                    onValueChange={v => setValue('dateTimeFormat', v, { shouldDirty: true })}>
                    <SelectTrigger id="datetime" className="h-14! w-full bg-white rounded-md outline-none text-brand-neutral-9 border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {DATE_TIME_FORMATS.map(fmt => (
                            <SelectItem key={fmt.value} value={fmt.value}>{fmt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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