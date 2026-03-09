import React, { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    // Add any custom props here if needed
}

export function Input({ className = '', ...props }: Props) {
    return (
        <input
            className={`w-full rounded-xl bg-surface border border-border px-4 py-3 text-sm text-text placeholder-muted focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all font-medium ${className}`}
            {...props}
        />
    )
}
