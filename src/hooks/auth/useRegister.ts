import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthContext'
import { useRouter } from 'next/navigation'

export function useRegister() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { signUp } = useAuth()
    const router = useRouter()

    const handleSubmit = async (email: string, password: string) => {
        setError(null)
        setLoading(true)

        try {
            const { error } = await signUp(email, password, '')
            if (error) throw error
            // Redirect to login with success query param (no alert)
            router.push('/auth/login?registered=true')
        } catch (err: any) {
            setError(err.message || 'Failed to register')
        } finally {
            setLoading(false)
        }
    }

    return { handleSubmit, loading, error }
}
