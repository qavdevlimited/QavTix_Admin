export const PLATFORM_CURRENCY = "USD"
export const LOCALE_MAP: Record<string, string> = {
    "USD": "en-US",
    "NGN": "en-NG",
    "GBP": "en-GB",
    "EUR": "en-EU"
}

export function formatPrice(
    amount: number,
    currency?: string,
    useSymbol: boolean = true,
    compact?: boolean
): string {
    const code = currency ? currency.toUpperCase() : PLATFORM_CURRENCY
    const locale = LOCALE_MAP[code] ?? "en-US"

    if (compact) {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: code,
            currencyDisplay: useSymbol ? "symbol" : "code",
            notation: "compact",
            maximumFractionDigits: 2,
        }).format(amount)
    }

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: code,
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
        currencyDisplay: useSymbol ? "symbol" : "code",
    }).format(amount)
}

export const parsePrice = (val: string | number | undefined): number | null => {
    if (val == null || val === "") return null
    const n = typeof val === "number" ? val : parseFloat(val)
    return isNaN(n) ? null : n
}