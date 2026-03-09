import { Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormLabel } from '@/components/ui/FormLabel'
import { Badge } from '@/components/ui/Badge'
import type { Exercise } from '@/types'

interface LoggedExercise { exercise: Exercise; sets: any[] }

interface Props {
    name: string
    setName: (v: string) => void
    date: string
    setDate: (v: string) => void
    logged: LoggedExercise[]
    setLogged: (v: LoggedExercise[] | ((p: LoggedExercise[]) => LoggedExercise[])) => void
    onAddExercise: () => void
}

export function WorkoutSetup({ name, setName, date, setDate, logged, setLogged, onAddExercise }: Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="space-y-6">
                <div>
                    <FormLabel>Workout Name *</FormLabel>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Heavy Push Day"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FormLabel>Date</FormLabel>
                        <Input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button
                            variant="secondary"
                            className="w-full h-11 rounded-xl text-[11px] font-bold tracking-widest uppercase italic"
                            onClick={onAddExercise}
                        >
                            <Plus size={14} className="mr-1" />
                            Add Exercise
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="space-y-3">
                <FormLabel className="px-1">Exercise List</FormLabel>
                {logged.length > 0 ? (
                    logged.map((l, i) => (
                        <div key={i} className="group animate-in slide-in-from-bottom-2 duration-300">
                            <Card className="!p-3 border-border/50 hover:border-gray-700 transition-all relative overflow-hidden group-hover:shadow-xl group-hover:shadow-blue-500/5">
                                <div className="flex items-center justify-between pointer-events-none">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-muted font-mono">{i + 1}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-text truncate">{l.exercise.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant={l.exercise.muscle_group} className="text-[9px] px-1.5 py-0 italic">
                                                    {l.exercise.muscle_group.toUpperCase()}
                                                </Badge>
                                                <span className="text-[9px] text-muted uppercase font-bold tracking-tight">{l.exercise.exercise_type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setLogged(prev => prev.filter((_, idx) => idx !== i))}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl text-muted hover:text-red-400 hover:bg-red-400/10 transition-all pointer-events-auto"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="py-12 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted gap-2">
                        <Plus size={32} className="opacity-20" />
                        <p className="text-[11px] font-bold uppercase tracking-widest italic">No exercises added yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}
