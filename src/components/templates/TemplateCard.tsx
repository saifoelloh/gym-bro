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
        <Card className="p-4 sm:p-5 hover:border-blue-500/30 transition-colors relative group">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{t.name}</h3>
                    {t.description && (
                        <p className="text-sm text-gray-400 mt-1">{t.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                        <span className="text-[11px] text-gray-400 font-medium">
                            {allExercises.length} Exercises
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                            ~{totalSets} Total Sets
                        </span>
                        <span className="text-[11px] text-gray-500">
                            {format(new Date(t.updated_at), 'dd MMM yyyy')}
                        </span>
                    </div>

                    <div className="flex gap-1.5 mt-3 flex-wrap">
                        {muscleGroups.map((mg) => (
                            <Badge key={mg} variant={mg}>{mg}</Badge>
                        ))}
                    </div>

                    <div className="mt-4 space-y-2 border-t border-gray-800 pt-3">
                        {visibleExercises.map((te) => (
                            <div key={te.id} className="flex items-center justify-between text-xs">
                                <span className="text-gray-300 truncate pr-2">
                                    {te.exercise?.name}
                                </span>
                                <span className="text-gray-500 whitespace-nowrap">
                                    {te.target_sets} sets
                                </span>
                            </div>
                        ))}

                        {hasMore && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-[11px] text-blue-400 font-medium mt-1 hover:text-blue-300 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    {expanded ? 'Show Less' : `Show ${allExercises.length - 3} More`}
                                    {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-2 sm:mt-0 flex-shrink-0 min-w-0 sm:w-28">
                    <Link
                        href={`/log?template=${t.id}`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 text-xs py-3 sm:py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/10"
                    >
                        <Play size={14} className="fill-current" />
                        START
                    </Link>

                    <div className="grid grid-cols-3 sm:flex sm:flex-col gap-2">
                        <button
                            onClick={() => onEdit(t)}
                            className="flex items-center justify-center p-2.5 sm:py-2 sm:px-3 text-[10px] font-bold text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors border border-gray-800"
                            title="Edit"
                        >
                            <Pencil size={12} className="sm:mr-1.5" />
                            <span className="hidden sm:inline">EDIT</span>
                        </button>
                        <button
                            onClick={() => onDuplicate(t.id)}
                            className="flex items-center justify-center p-2.5 sm:py-2 sm:px-3 text-[10px] font-bold text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors border border-gray-800"
                            title="Copy"
                        >
                            <Copy size={12} className="sm:mr-1.5" />
                            <span className="hidden sm:inline">COPY</span>
                        </button>
                        <button
                            onClick={() => onDelete(t.id)}
                            className="flex items-center justify-center p-2.5 sm:py-2 sm:px-3 text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-900/10 hover:bg-red-900/20 rounded-lg transition-colors border border-red-900/20"
                            title="Delete"
                        >
                            <Trash2 size={12} className="sm:mr-1.5" />
                            <span className="hidden sm:inline">DELETE</span>
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
