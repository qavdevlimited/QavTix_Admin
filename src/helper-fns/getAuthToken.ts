/**
 * Client-side utility to retrieve the admin access token via the API route.
 * This is useful when the token is needed in client components or other non-server contexts.
 */
export async function getAuthToken(): Promise<string | undefined> {
    try {
        const response = await fetch("/api/auth/token", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Ensure we don't cache this request to always get the current cookie value
            cache: "no-store",
        })

        if (!response.ok) {
            return undefined
        }

        const data = await response.json()
        return data.token
    } catch (error) {
        console.error("[getAuthToken] Failed to fetch token:", error)
        return undefined
    }
}
