export interface ActionResult {
    success:  boolean
    message?: string
}

export interface VerifyOtpResult {
    success:  boolean
    token?:   string
    message?: string
}