/**
 * Globally extracts configuration (colors, labels, icons) based on a status key.
 * @template K - The status keys (e.g., 'active' | 'pending')
 * @template V - The shape of the config object
 */
export default function getStatusConfig<K extends string | number, V>(
    status: K,
    config: Record<K, V>,
    defaultKey?: K
): V {
    // Direct match
    if (config[status]) return config[status]

    // Fallback to user-defined default
    if (defaultKey && config[defaultKey]) return config[defaultKey]

    // Last resort: Return the first available config in the object
    const values = Object.values(config) as V[]
    if (values.length === 0) {
        throw new Error("getStatusConfig: The provided config object is empty.")
    }
    
    return values[0]
}