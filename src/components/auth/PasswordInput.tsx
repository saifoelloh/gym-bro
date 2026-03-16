'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AuthInput } from './AuthInput'

interface PasswordInputProps {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    autoComplete?: string
    id?: string
}

export function PasswordInput({ label, value, onChange, placeholder = '••••••••', autoComplete, id }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="space-y-1">
            <label htmlFor={id} className="gym-label ml-1">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full bg-bg/50 border border-border rounded-2xl pl-5 pr-12 py-3 outline-none focus:border-accent/50 focus:bg-bg/80 transition-all font-medium text-sm placeholder:text-muted/30"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-accent transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    )
}
