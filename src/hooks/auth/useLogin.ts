import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthContext'
import { useRouter } from 'next/navigation'

export function useLogin() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { signIn } = useAuth()
    const router = useRouter()

    const handleSubmit = async (email: string, password: string) => {
        setError(null)
        setLoading(true)

        try {
            const { error } = await signIn(email, password)
            if (error) throw error
            router.push('/')
        } catch (err: any) {
            setError(err.message || 'Failed to sign in')
        } finally {
            setLoading(false)
        }
    }

    return { handleSubmit, loading, error }
}
