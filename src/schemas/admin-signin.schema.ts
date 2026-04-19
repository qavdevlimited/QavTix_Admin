import { z } from "zod";

export const adminSignInSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string(),
    rememberDevice: z.boolean(),
})

export type AdminSignInValues = z.infer<typeof adminSignInSchema>