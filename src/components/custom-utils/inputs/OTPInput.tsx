import { useState, useRef, useEffect, Dispatch, SetStateAction, KeyboardEvent, ClipboardEvent, MouseEvent } from 'react';

export default function OTPInput({ otp, setOtp }: { otp: string[], setOtp: Dispatch<SetStateAction<string[]>> }) {
    const [focusedIndex, setFocusedIndex] = useState(0)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    const activeIndex = otp.findIndex(val => !val) !== -1 ? otp.findIndex(val => !val) : otp.length - 1

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (value && !/^[a-zA-Z0-9]$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.toUpperCase()
        setOtp(newOtp)
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus()
            } else {
                const newOtp = [...otp]
                newOtp[index] = '';
                setOtp(newOtp)
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus()
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text/plain').trim().slice(0, 6 - index)
        const newOtp = [...otp];

        for (let i = 0; i < pastedData.length; i++) {
            if (/^[a-zA-Z0-9]$/.test(pastedData[i])) {
                newOtp[index + i] = pastedData[i].toUpperCase()
            }
        }

        setOtp(newOtp)
        const lastFilledIndex = Math.min(index + pastedData.length - 1, 5)
        const nextEmptyIndex  = newOtp.findIndex((val, i) => i >= index && !val)
        inputRefs.current[nextEmptyIndex !== -1 ? nextEmptyIndex : lastFilledIndex]?.focus()
    }

    const handleFocus = (index: number) => {
        setFocusedIndex(index)
    }

    const handleClick = (e: MouseEvent<HTMLInputElement>) => {
        e.preventDefault()
        inputRefs.current[activeIndex]?.focus()
        setFocusedIndex(activeIndex)
    }

    return (
        <div className="w-full max-w-lg mx-auto px-4 sm:px-0">
            <div className="flex gap-2 sm:gap-4 justify-center">
                {otp.map((digit, index) => {
                    const isActive = index === activeIndex
                    return (
                        <input
                            key={index}
                            ref={(el) => { if (el) inputRefs.current[index] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={(e) => handlePaste(index, e)}
                            onFocus={() => handleFocus(index)}
                            onClick={handleClick}
                            readOnly={!isActive}
                            className={`w-11 aspect-square sm:w-14 text-center text-2xl md:text-3xl border text-secondary-9 rounded-[13.5px] transition-all duration-200 outline-none
                            ${digit ? 'border-primary-6' : 'border-neutral-5'}
                            ${isActive ? 'border-blue-400 shadow-md hover:border-primary-5/80' : 'cursor-default'}
                            focus:border-primary-5 focus:shadow-md`}
                            aria-label={`Digit ${index + 1}`}
                        />
                    )
                })}
            </div>
        </div>
    )
}