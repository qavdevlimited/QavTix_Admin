import { formatPrice } from './formatPrice'

export function buildMetricsFromConfig(
    config: Record<string, any>,
    apiData: Record<string, any>,
    currency?: string,
) {
    return Object.keys(config).map(key => {
        const metricConfig = config[key]
        const value = apiData[key]
        return {
            ...metricConfig,
            value: metricConfig.valueFormatter
                ? metricConfig.valueFormatter(value, currency)
                : value,
        }
    })
}

export function formatStatValue(value: number, type: "currency" | "number" | "percent", currency?: string): string {
    if (value == null) return "0";
    if (type === "currency") return formatPrice(value, currency, true, true);
    if (type === "percent") return `${value}%`;
    return value.toLocaleString();
}


export function buildQuickActionMetricsFromConfig(config: any[], apiData: Record<string, any>) {
    return config.map((item: any) => {
        const description = apiData[item.id] ?? item.description;
        return { ...item, description };
    })
}
