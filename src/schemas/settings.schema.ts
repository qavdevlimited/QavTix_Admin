import { z } from 'zod'

// General settings
export const generalSettingsSchema = z.object({
    platformSupportEmail: z.string().email('Enter a valid email'),
    defaultCurrencyCode: z.string().min(1),
    defaultTimezone: z.string().min(1),
})
export type GeneralSettingsForm = z.infer<typeof generalSettingsSchema>

// Fees & commissions
export const feesCommissionsSchema = z.object({
    ticketResellCommission: z.number().min(0).max(100),
    sellerServiceFee: z.number().min(0).max(100),
    buyerServiceFee: z.number().min(0).max(100),
    vatEnabled: z.boolean(),
    pricesIncludeVat: z.boolean(),
})
export type FeesCommissionsForm = z.infer<typeof feesCommissionsSchema>

// Security / Fraud
export const securitySettingsSchema = z.object({
    fraudDetectionSensitivity: z.enum(['low', 'medium', 'high']),
})
export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>

// Notifications
export const notificationsSettingsSchema = z.object({
    emailNotificationsEnabled: z.boolean(),
    emailNotifications: z.object({
        adminAlerts: z.boolean(),
        fraudAlerts: z.boolean(),
        highVolumeSales: z.boolean(),
        failedPayouts: z.boolean(),
    }),
    smsNotificationsEnabled: z.boolean(),
    smsNotifications: z.object({
        adminAlerts: z.boolean(),
        fraudAlerts: z.boolean(),
        highVolumeSales: z.boolean(),
        failedPayouts: z.boolean(),
    }),
})
export type NotificationsSettingsFormData = z.infer<typeof notificationsSettingsSchema>

// Localization
export const localizationSettingsSchema = z.object({
    supportedCountries: z.array(z.string()),
    supportedCurrencies: z.array(z.string()),
    defaultLanguage: z.string(),
    dateTimeFormat: z.string(),
})
export type LocalizationSettingsFormData = z.infer<typeof localizationSettingsSchema>