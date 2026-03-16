/**
 * NEXT.JS SERVER COMPONENT
 * Handles metadata and core layout for the Register page.
 */
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Register — GYM.LOG',
    description: 'Join the GYM.LOG club and start tracking your strength journey.'
}

export default function RegisterPage() {
    return <RegisterForm />
}
