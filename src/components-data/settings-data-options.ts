import { LocationData } from "@/lib/redux/slices/settingsSlice";

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar', symbol: '$', flag: '🇺🇸', code: 'USD' },
  { value: 'NGN', label: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', code: 'NGN' },
  { value: 'EUR', label: 'Euro', symbol: '€', flag: '🇪🇺', code: 'EUR' },
  { value: 'GBP', label: 'British Pound', symbol: '£', flag: '🇬🇧', code: 'GBP' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', code: 'CAD' },
  { value: 'AUD', label: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', code: 'AUD' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', code: 'JPY' },
  { value: 'CNY', label: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', code: 'CNY' },
  { value: 'INR', label: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', code: 'INR' },
  { value: 'ZAR', label: 'South African Rand', symbol: 'R', flag: '🇿🇦', code: 'ZAR' },
  { value: 'KES', label: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', code: 'KES' },
  { value: 'GHS', label: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭', code: 'GHS' }
] as const;

export const TIMEZONES = [
  { value: "Africa/Lagos", label: "Lagos, Nigeria (GMT+1)" },
  { value: "Africa/Johannesburg", label: "Johannesburg, South Africa (GMT+2)" },
  { value: "Africa/Accra", label: "Accra, Ghana (GMT+0)" },
  { value: "Africa/Nairobi", label: "Nairobi, Kenya (GMT+3)" },
] as const;

export const FRAUD_SENSITIVITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
] as const


export const NOTIFICATION_TYPES = [
  { value: 'adminAlerts', label: 'Admin Alerts' },
  { value: 'fraudAlerts', label: 'Fraud Alerts' },
  { value: 'highVolumeSales', label: 'High-volume Sales' },
  { value: 'failedPayouts', label: 'Failed Payouts' }
] as const



// Countries with emoji flags
export const COUNTRIES = [
  { value: 'GH', label: 'Ghana', flag: '🇬🇭' },
  { value: 'IN', label: 'India', flag: '🇮🇳' },
  { value: 'NG', label: 'Nigeria', flag: '🇳🇬' },
  { value: 'ZA', label: 'South Africa', flag: '🇿🇦' },
  { value: 'GB', label: 'UK', flag: '🇬🇧' },
  { value: 'US', label: 'USA', flag: '🇺🇸' },
  { value: 'CA', label: 'Canada', flag: '🇨🇦' },
  { value: 'AU', label: 'Australia', flag: '🇦🇺' },
  { value: 'KE', label: 'Kenya', flag: '🇰🇪' },
  { value: 'EG', label: 'Egypt', flag: '🇪🇬' }
]


// Languages
export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'sw', label: 'Swahili' },
  { value: 'yo', label: 'Yoruba' },
  { value: 'ig', label: 'Igbo' },
  { value: 'ha', label: 'Hausa' }
]

// Date/Time formats
export const DATE_TIME_FORMATS = [
  { value: '12h', label: '12-Hour Clock' },
  { value: '24h', label: '24-Hour Clock' }
]





export const REGION_CURRENCY_MAP: Record<string, LocationData> = {
  NG: {
    region: { code: 'NG', label: 'Nigeria', flag: '🇳🇬' },
    currency: { code: 'NGN', label: 'Naira', symbol: '₦' }
  },
  US: {
    region: { code: 'US', label: 'United States', flag: '🇺🇸' },
    currency: { code: 'USD', label: 'Dollar', symbol: '$' }
  },
  GB: {
    region: { code: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
    currency: { code: 'GBP', label: 'Pound', symbol: '£' }
  }
}

export const DEFAULT_LOCATION: LocationData = {
  region: { code: 'NG', label: 'Nigeria', flag: '🇳🇬' },
  currency: { code: 'NGN', label: 'Naira', symbol: '₦' }
}

export const regions = Object.values(REGION_CURRENCY_MAP)
  .map(({ region }) => region)
  .filter(
    (region, index, self) =>
      index === self.findIndex(r => r.code === region.code)
  )


export const currencies = Object.values(REGION_CURRENCY_MAP)
  .map(({ currency }) => currency)
  .filter(
    (currency, index, self) =>
      index === self.findIndex(c => c.code === currency.code)
  )
