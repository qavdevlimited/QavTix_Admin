"use client"

import { useState } from "react"

export function useLogOut() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogOut = async () => {
        if (isLoggingOut) return
        setIsLoggingOut(true)

        try {
            // Call the logout API route which clears HttpOnly cookies
            await fetch("/api/auth/logout", { method: "POST" })
        } finally {
            // Use hard navigation so the middleware sees the cleared cookies
            // and doesn't silently re-log the user back in via token restore
            window.location.href = process.env.NEXT_PUBLIC_APP_DOMAIN || "/"
        }
    }

    return { handleLogOut, isLoggingOut }
}