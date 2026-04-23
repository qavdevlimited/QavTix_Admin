export const successModalVariantConfig = {
    delete: {
        icon: "/images/vectors/red-trash-red.svg",
        type: "image"
    },
    success: {
        icon: "/images/vectors/blue-check.svg",
        type: "image"
    },
    account_deleted: {
        icon: "/images/vectors/uas-icon.svg",
        type: "image"
    }
}

export type SuccessModalVariant = keyof typeof successModalVariantConfig;