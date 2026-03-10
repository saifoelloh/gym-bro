'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { Play, Pencil, Copy, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { WorkoutTemplate, MuscleGroup } from '@/types'
import { useState } from 'react'

interface Props {
    template: WorkoutTemplate
    onEdit: (t: WorkoutTemplate) => void
    onDuplicate: (id: string) => void
    onDelete: (id: string) => void
}

export function TemplateCard({ template: t, onEdit, onDuplicate, onDelete }: Props) {
    const [expanded, setExpanded] = useState(false)

    const muscleGroups = Array.from(new Set(
        t.template_exercises?.map((te) => te.exercise?.muscle_group).filter(Boolean)
    )) as MuscleGroup[]

    const totalSets = t.template_exercises?.reduce(
        (acc, te) => acc + te.target_sets, 0
    ) ?? 0

    const allExercises = t.template_exercises ?? []
    const visibleExercises = expanded ? allExercises : allExercises.slice(0, 3)
    const hasMore = allExercises.length > 3

    return (
        <Card className="p-4 sm:p-5 hover:border-info/30 transition-colors relative group">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-foreground tracking-tight leading-tight">{t.name}</h3>
                    {t.description && (
                        <p className="text-sm text-muted mt-1">{t.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                        <span className="text-micro text-muted font-medium">
                            {allExercises.length} {allExercises.length === 1 ? 'Exercise' : 'Exercises'}
                        </span>
                        <span className="text-micro text-muted font-medium">
                            ~{totalSets} Total Sets
                        </span>
                        <span className="text-micro text-muted">
                            {format(new Date(t.updated_at), 'dd MMM yyyy')}
                        </span>
                    </div>

                    <div className="flex gap-1.5 mt-3 flex-wrap">
                        {muscleGroups.map((mg) => (
                            <Badge key={mg} variant={mg}>{mg}</Badge>
                        ))}
                    </div>

                    <div className="mt-4 space-y-2 border-t border-border pt-3">
                        {visibleExercises.map((te) => (
                            <div key={te.id} className="flex items-center justify-between text-xs">
                                <span className="text-foreground truncate pr-2">
                                    {te.exercise?.name}
                                </span>
                                <span className="text-muted whitespace-nowrap">
                                    {te.target_sets} sets
                                </span>
                            </div>
                        ))}

                        {hasMore && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-micro text-info font-medium mt-1 hover:text-blue-300 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    {expanded ? 'Show Less' : `Show ${allExercises.length - 3} More`}
                                    {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-4 sm:mt-0 flex-shrink-0 sm:w-32">
                    <Link
                        href={`/log?template=${t.id}`}
                        className="w-full bg-info hover:bg-info/90 text-foreground flex items-center justify-center gap-2 text-xs py-3.5 sm:py-2.5 rounded-xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-info/20 active:scale-95"
                    >
                        <Play size={14} className="fill-current" />
                        START
                    </Link>

                    <div className="grid grid-cols-3 sm:flex sm:flex-col gap-2">
                        <button
                            onClick={() => onEdit(t)}
                            className="flex flex-col sm:flex-row items-center justify-center py-2.5 sm:px-3 text-micro font-bold text-muted hover:text-foreground bg-surface/50 hover:bg-surface rounded-lg transition-colors border border-border gap-1.5"
                            title="Edit"
                        >
                            <Pencil size={12} />
                            <span>EDIT</span>
                        </button>
                        <button
                            onClick={() => onDuplicate(t.id)}
                            className="flex flex-col sm:flex-row items-center justify-center py-2.5 sm:px-3 text-micro font-bold text-muted hover:text-foreground bg-surface/50 hover:bg-surface rounded-lg transition-colors border border-border gap-1.5"
                            title="Copy"
                        >
                            <Copy size={12} />
                            <span>COPY</span>
                        </button>
                        <button
                            onClick={() => onDelete(t.id)}
                            className="flex flex-col sm:flex-row items-center justify-center py-2.5 sm:px-3 text-micro font-bold text-error/80 hover:text-error bg-error/5 hover:bg-error/10 rounded-lg transition-colors border border-transparent hover:border-error/20 gap-1.5"
                            title="Delete"
                        >
                            <Trash2 size={12} />
                            <span>DELETE</span>
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
