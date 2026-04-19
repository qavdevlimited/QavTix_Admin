import { Icon } from '@iconify/react';
import ErrorPara from './ErrorPara';

interface ITextInput1Props {
    type?: 'text' | 'email';
    placeholder?: string;
    icon?: string
    error?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
}

export default function TextInput1({ 
    type = 'text',
    placeholder,
    icon,
    error,
    value,
    onChange,
    ...props 
}: ITextInput1Props) {
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
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 outline-none text-sm text-brand-neutral-9 placeholder:text-brand-neutral-7 bg-transparent peer"
                    {...props}
                />
                {icon && (
                    <Icon
                        icon={icon} 
                        className={`size-6 shrink-0 transition-colors ${
                            error 
                                ? 'text-red-400' 
                                : 'text-brand-neutral-8 peer-focus:text-brand-primary-6'
                        }`} 
                    />
                )}
            </div>
            {error && (
                <ErrorPara error={error} />
            )}
        </div>
    )
}