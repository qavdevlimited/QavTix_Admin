import { Icon } from "@iconify/react";
import { useState } from "react";
import ErrorPara from './ErrorPara';

interface IPasswordInput1Props {
    placeholder?: string;
    error?: string;
    value?: string;
    helperText?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
}

export default function PasswordInput1({ 
    placeholder = 'Password',
    error,
    value,
    helperText,
    onChange,
    ...props 
}: IPasswordInput1Props) {
    
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="w-full">
            <div 
                className={`
                    relative flex items-center gap-3 px-4 py-3.5 
                    rounded-[6px] border-[1.4px] h-14 text-sm transition-all duration-200
                    bg-white
                    ${error 
                        ? 'border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500' 
                        : 'border-brand-neutral-5 focus-within:border-brand-primary-6 focus-within:shadow-sm'
                    }
                `}
            >
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 outline-none text-sm text-brand-neutral-9 placeholder:text-brand-neutral-7 bg-transparent peer"
                    {...props}
                />
                
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 p-1 rounded transition-colors"
                    tabIndex={-1}
                >
                    <Icon 
                        icon={showPassword ? "octicon:eye-16" : "octicon:eye-closed-16"} 
                        className={`w-5 h-5 transition-colors ${
                            error 
                                ? 'text-red-400' 
                                : 'text-brand-neutral-8 peer-focus:text-brand-primary-6'
                        }`} 
                    />
                </button>
            </div>

            {helperText && !error && (
                <p className='text-sm text-brand-neutral-8 mt-1'>{helperText}</p>
            )}

            {error && (
                <ErrorPara error={error} />
            )}
        </div>
    )
}