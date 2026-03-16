/**
 * NEXT.JS SERVER COMPONENT
 * Handles metadata and core layout for the Login page.
 */
import { LoginForm } from '@/components/auth/LoginForm'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'Login — GYM.LOG',
    description: 'Sign in to your GYM.LOG account to track your workouts and progress.'
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>}>
            <LoginForm />
        </Suspense>
    )
}
