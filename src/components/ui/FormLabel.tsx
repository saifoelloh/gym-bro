import React from 'react'

export function FormLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <label className={`text-xs uppercase font-bold text-muted tracking-widest mb-1.5 block italic leading-none ${className}`}>
            {children}
        </label>
    )
}
