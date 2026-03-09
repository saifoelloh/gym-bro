import { PlusCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SetLogger } from './SetLogger'
import type { Exercise } from '@/types'

interface LoggedExercise { exercise: Exercise; sets: any[] }

interface Props {
    loggedExercise: LoggedExercise
    index: number
    onSetsChange: (sets: any[]) => void
    onAddExercise: () => void
}

export function WorkoutStep({ loggedExercise, index, onSetsChange, onAddExercise }: Props) {
    const { exercise, sets } = loggedExercise

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-start justify-between px-1 gap-4">
                <div className="min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-text uppercase tracking-tight italic break-words">{exercise.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant={exercise.muscle_group} className="text-[10px] px-2 py-0.5">
                            {exercise.muscle_group.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-muted uppercase font-bold tracking-widest italic">
                            {exercise.exercise_type}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-center shrink-0 pt-1">
                    <h2 className="text-3xl md:text-5xl font-bold text-text uppercase opacity-20">#{index + 1}</h2>
                </div>
            </div>

            <Card className="!p-0 overflow-hidden bg-surface/50 border-gray-800/50">
                <div className="p-4 sm:p-6">
                    <SetLogger
                        exercise={exercise}
                        sets={sets}
                        onChange={onSetsChange}
                    />
                </div>
            </Card>

            <div className="flex justify-center pt-2">
                <button
                    onClick={onAddExercise}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border transition-all uppercase tracking-[0.2em] italic group"
                >
                    <PlusCircle size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    Add Next Exercise
                </button>
            </div>
        </div>
    )
}
