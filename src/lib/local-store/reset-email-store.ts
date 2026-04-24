const KEY = "admin_password_reset_email"

export const resetEmailStore = {
    set: (email: string) => {
        sessionStorage.setItem(KEY, email)
    },
    get: (): string | null => {
        return sessionStorage.getItem(KEY)
    },
    clear: () => {
        sessionStorage.removeItem(KEY)
    },
}
