'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLogin } from '@/hooks/auth/useLogin'
import { useAuth } from '@/components/providers/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'
import { PasswordInput } from './PasswordInput'
import { AuthErrorBanner } from './AuthErrorBanner'

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const searchParams = useSearchParams()
    const router = useRouter()
    const registered = searchParams.get('registered')
    const { handleSubmit, loading, error } = useLogin()
    const { user, loading: authLoading } = useAuth()

    useEffect(() => {
        if (!authLoading && user) {
            router.replace('/')
        }
    }, [user, authLoading, router])
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSubmit(email, password)
    }

    return (
        <AuthCard
            title="WELCOME"
            highlight="BACK"
            subtitle="Track your gains and push your limits. Your next PR starts here."
        >
            {registered === 'true' && (
                <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-2xl mb-8 text-xs font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <span className="mt-0.5">✅</span>
                    Registration successful! Please sign in.
                </div>
            )}

            <AuthErrorBanner error={error} />

            <form onSubmit={onSubmit} className="space-y-4 relative">
                <AuthInput
                    label="Email address"
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="e.g. champion@gym.log"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="space-y-1">
                    <div className="flex items-center justify-between mb-1 ml-1">
                        <label className="gym-label !mb-0 text-[13px] font-medium">Password</label>
                        <Link 
                            href="/auth/forgot-password" 
                            className="text-[11px] font-display font-bold text-accent hover:border-b border-accent/30 tracking-widest pb-px"
                        >
                            FORGOT?
                        </Link>
                    </div>
                    <PasswordInput
                        label="" // Label handled above
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full text-sm font-bold h-14"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                                <span>CHALLENGING...</span>
                            </div>
                        ) : 'SIGN IN NOW'}
                    </button>
                </div>
            </form>

            <p className="mt-6 text-center text-xs font-display tracking-[0.1em] text-muted">
                NEW TO THE CLUB?{' '}
                <Link href="/auth/register" className="text-accent hover:border-b border-accent/30 pb-0.5 transition-all ml-1">
                    JOIN HERE
                </Link>
            </p>
        </AuthCard>
    )
}
