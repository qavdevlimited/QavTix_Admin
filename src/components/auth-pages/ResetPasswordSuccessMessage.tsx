import { space_grotesk } from "@/lib/fonts";
import Image from "next/image";
import ActionButton1 from "../custom-utils/buttons/ActionBtn1";

export default function ResetPasswordSuccessMessage() {
    return (
        <div className="h-full">
            <div className="absolute top-0 inset-x-0 w-full h-64 pointer-events-none select-none">
                <Image src="/images/vectors/confetti.svg" alt="" aria-hidden="true" width={500} height={400} className="block md:hidden absolute w-full top-0 left-0 right-0 mx-auto pointer-events-none select-none" />
                <Image src="/images/vectors/confetti-lg.svg" alt="" aria-hidden="true" width={500} height={400} className="hidden md:block absolute w-full top-0 left-0 right-0 mx-auto pointer-events-none select-none" />
            </div>
            <div className="relative z-10 justify-center flex items-center flex-col gap-10">
                <Image src="/images/vectors/success-indicator.svg" alt="Success Indicator" width={200} height={200} className="mx-auto" />
                <div className="max-w-xs mx-auto">
                    <h2 className={`text-center text-2xl font-bold text-secondary-9 mb-2 ${space_grotesk.className}`}>Password changed successfully!</h2>
                    <p className="text-center text-[#616166] text-sm">
                        Your password has been changed successfully.
                    </p>
                </div>
                <ActionButton1 
                    buttonText="Login Now"
                    buttonType="button"
                    className="h-12!"
                />
            </div>
        </div>
    )
}