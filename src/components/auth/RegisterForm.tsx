'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRegister } from '@/hooks/auth/useRegister'
import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'
import { PasswordInput } from './PasswordInput'
import { AuthErrorBanner } from './AuthErrorBanner'

export function RegisterForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [validationError, setValidationError] = useState<string | null>(null)
    const { handleSubmit, loading, error } = useRegister()

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setValidationError(null)

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match')
            return
        }

        handleSubmit(email, password)
    }

    return (
        <AuthCard
            title="JOIN THE"
            highlight="CLUB"
            subtitle="Your journey to absolute strength begins with a single log."
        >
            <AuthErrorBanner error={error || validationError} />

            <form onSubmit={onSubmit} className="space-y-4 relative">
                <AuthInput
                    label="Email address"
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="e.g. warrior@gym.log"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordInput
                    label="Password"
                    id="password"
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <PasswordInput
                    label="Confirm password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full text-sm font-bold h-14"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                                <span>ENLISTING...</span>
                            </div>
                        ) : 'START TRAINING'}
                    </button>
                </div>
            </form>

            <p className="mt-6 text-center text-xs font-display tracking-[0.1em] text-muted">
                ALREADY A MEMBER?{' '}
                <Link href="/auth/login" className="text-accent hover:border-b border-accent/30 pb-0.5 transition-all ml-1">
                    LOG IN
                </Link>
            </p>
        </AuthCard>
    )
}
