'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api/client'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { WorkoutSummaryDisplay } from '@/components/log/WorkoutSummaryDisplay'
import type { Workout } from '@/types'
import { ArrowLeft } from 'lucide-react'

export default function WorkoutSummaryPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    const [workout, setWorkout] = useState<Workout | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        let mounted = true
        setLoading(true)

        api.workouts.get(id)
            .then((data) => {
                if (mounted) setWorkout(data)
            })
            .catch((err) => {
                if (mounted) setError(err.message || 'Failed to load workout')
            })
            .finally(() => {
                if (mounted) setLoading(false)
            })

        return () => { mounted = false }
    }, [id])

    if (loading) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center h-screen">
                <LoadingSpinner label="Loading summary..." />
            </div>
        )
    }

    if (error || !workout) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center h-screen p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                    <ArrowLeft size={32} className="text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-text mb-2">Oops! Something went wrong</h2>
                <p className="text-muted mb-6">{error || 'Workout not found'}</p>
                <button
                    onClick={() => router.push('/')}
                    className="h-12 px-6 rounded-xl bg-surface border border-border text-text font-black uppercase italic tracking-widest text-[11px] hover:bg-surface-hover"
                >
                    Return to Home
                </button>
            </div>
        )
    }

    return (
        <main className="min-h-screen pt-12 px-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-green-500/5 via-transparent to-transparent -z-10 pointer-events-none" />
            <WorkoutSummaryDisplay workout={workout} />
        </main>
    )
}
