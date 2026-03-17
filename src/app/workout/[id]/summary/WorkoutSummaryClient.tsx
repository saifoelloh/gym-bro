'use client'

import { useRouter } from 'next/navigation'
import { WorkoutSummaryDisplay } from '@/components/log/WorkoutSummaryDisplay'
import type { Workout } from '@/types'
import { AlertCircle } from 'lucide-react'

interface Props {
    workout: Workout | null
    error: string | null
}

export default function WorkoutSummaryClient({ workout, error }: Props) {
    const router = useRouter()

    if (error || !workout) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center h-screen p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-error" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Oops! Something went wrong</h2>
                <p className="text-muted mb-6">{error || 'Workout not found'}</p>
                <button
                    onClick={() => router.push('/')}
                    className="h-12 px-6 rounded-xl bg-surface border border-border text-foreground font-black uppercase italic tracking-widest text-micro hover:bg-surface-hover"
                >
                    Return to Home
                </button>
            </div>
        )
    }

    return (
        <main className="min-h-screen pt-12 px-4 relative overflow-hidden">
            <WorkoutSummaryDisplay workout={workout} />
        </main>
    )
}
