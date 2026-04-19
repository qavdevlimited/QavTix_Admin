import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1";
import TextInput1 from "@/components/custom-utils/inputs/TextInput1";
import { AUTH_LINKS } from "@/enums/navigation";
import { space_grotesk } from "@/lib/fonts";
import Link from "next/link";

export default function ForgotPasswordPage(){
    return (
        <div>
            <h1 className={`${space_grotesk.className} text-brand-secondary-9 text-2xl md:text-3xl font-bold mb-2 text-center`}>Forgot Password?</h1>
            <p className="text-brand-neutral-7 text-sm text-center">Enter the email address you used signing up, we’ll send you reset instructions.</p>

            <form className="space-y-5 mt-8">
                <div>
                    <label className="text-sm font-medium text-neutral-10 mb-2 block">Email Or Phone Number</label>
                    <TextInput1 placeholder="Enter Email or Phone number" />
                </div>
                <ActionButton1 buttonText="Continue" className="mt-6 w-full" />

                <p className="text-sm text-center text-brand-secondary-9">
                    Remembered Password? <Link href={AUTH_LINKS.SIGN_IN.href} className="text-brand-accent-6 font-medium hover:underline">Sign In</Link>
                </p>
            </form>
        </div>
    )
}