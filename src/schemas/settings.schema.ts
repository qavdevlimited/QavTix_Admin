import { z } from 'zod'


// Fee and Commissions
export const feesCommissionsSchema = z.object({
    ticketResellCommission: z.number()
        .min(0, "Must be at least 0%")
        .max(100, "Cannot exceed 100%"),
    sellerServiceFee: z.number()
        .min(0, "Must be at least 0%")
        .max(100, "Cannot exceed 100%"),
    buyerServiceFee: z.number()
        .min(0, "Must be at least 0%")
        .max(100, "Cannot exceed 100%"),
    taxVatEnabled: z.boolean(),
})

export type FeesCommissionsForm = z.infer<typeof feesCommissionsSchema>


// Security & Abuse Prevention Schema
export const securitySettingsSchema = z.object({
    fraudDetectionSensitivity: z.enum(['low', 'medium', 'high'])
})

export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>

// Notifications Schema
export const notificationsSettingsSchema = z.object({
    emailNotificationsEnabled: z.boolean(),
    emailNotifications: z.object({
        adminAlerts: z.boolean(),
        fraudAlerts: z.boolean(),
        highVolumeSales: z.boolean(),
        failedPayouts: z.boolean()
    }),
    smsNotificationsEnabled: z.boolean(),
    smsNotifications: z.object({
        adminAlerts: z.boolean(),
        fraudAlerts: z.boolean(),
        highVolumeSales: z.boolean(),
        failedPayouts: z.boolean()
    })
})

export type NotificationsSettingsFormData = z.infer<typeof notificationsSettingsSchema>

// Localization Schema
export const localizationSettingsSchema = z.object({
    supportedCountries: z.array(z.string()),
    supportedCurrencies: z.array(z.string()),
    defaultLanguage: z.string(),
    dateTimeFormat: z.string()
})

export type LocalizationSettingsFormData = z.infer<typeof localizationSettingsSchema>