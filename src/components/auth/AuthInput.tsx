import { InputHTMLAttributes } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
}

export function AuthInput({ label, id, className = '', ...props }: AuthInputProps) {
    return (
        <div className="space-y-1">
            <label htmlFor={id} className="gym-label ml-1">
                {label}
            </label>
            <input
                id={id}
                className={`w-full bg-bg/50 border border-border rounded-2xl px-5 py-3 outline-none focus:border-accent/50 focus:bg-bg/80 transition-all font-medium text-sm placeholder:text-muted/30 ${className}`}
                {...props}
            />
        </div>
    )
}
