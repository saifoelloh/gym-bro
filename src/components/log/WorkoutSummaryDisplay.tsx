import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowRight, ChevronDown, ChevronUp, Download, Edit } from 'lucide-react'
import type { Workout } from '@/types'
import { RPE_DATA } from './RPESlider'

interface Props {
    workout: Workout
}

export function WorkoutSummaryDisplay({ workout }: Props) {
    const router = useRouter()
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const rpeInfo = workout.rpe ? RPE_DATA[workout.rpe] : null
    const emoji = rpeInfo?.emoji || '💪'
    const bgColor = rpeInfo?.color || 'rgb(34, 197, 94)'

    const exportToMarkdown = () => {
        const dateStr = new Date(workout.date).toLocaleDateString()
        let md = `# Workout: ${workout.name}\n`
        md += `**Date:** ${dateStr}\n`
        if (workout.rpe) md += `**RPE:** ${workout.rpe}/10 ${emoji}\n`
        md += `\n## Exercises\n\n`

        workout.workout_exercises?.forEach(we => {
            md += `### ${we.exercises?.name || 'Unknown Exercise'}\n`
            if (we.notes) {
                md += `*Note: ${we.notes}*\n\n`
            }
            if (!we.sets || we.sets.length === 0) {
                md += `- No sets recorded\n\n`
                return
            }
            we.sets.forEach(set => {
                let setDetails = []
                if (set.weight_kg) setDetails.push(`${set.weight_kg}kg`)
                if (set.reps) setDetails.push(`${set.reps} reps`)
                if (set.duration_seconds) {
                    const mins = Math.floor(set.duration_seconds / 60)
                    const secs = String(set.duration_seconds % 60).padStart(2, '0')
                    setDetails.push(`${mins}:${secs}`)
                }
                let setString = setDetails.length > 0 ? setDetails.join(' × ') : '(Empty Set)'
                md += `- Set ${set.set_number}: ${setString}\n`
                if (set.notes) {
                    md += `  > ${set.notes}\n`
                }
            })
            md += '\n'
        })

        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Workout_${workout.name.replace(/\s+/g, '_')}_${workout.date}_${new Date().getTime()}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="max-w-xl mx-auto space-y-6 pb-24 z-10 relative">
            <div className="text-center space-y-2 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div
                    className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 text-5xl shadow-lg border border-border/50"
                    style={{ backgroundColor: `${bgColor}33` }} // 33 for 20% opacity hex
                >
                    {emoji}
                </div>
                <h1 className="text-3xl font-black italic uppercase tracking-widest text-foreground">
                    Workout Complete
                </h1>
                <p className="text-muted font-medium px-4">
                    {workout.name} • {new Date(workout.date).toLocaleDateString()}
                </p>

                {workout.notes && (
                    <div className="mt-6 mx-auto max-w-md p-4 bg-surface/30 border border-border/50 rounded-2xl text-left animate-in slide-in-from-bottom-2 fade-in duration-700 delay-200 fill-mode-both">
                        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1 italic">Workout Notes</p>
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{workout.notes}</p>
                    </div>
                )}
            </div>

            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                <h3 className="text-micro font-black italic uppercase tracking-widest text-muted px-1">
                    Workout Summary
                </h3>
                <Card className="p-4 divide-y divide-border">
                    {workout.workout_exercises?.map((we) => (
                        <div key={we.id} className="py-3 first:pt-0 last:pb-0">
                            <div
                                className="flex justify-between items-center mb-2 cursor-pointer group"
                                onClick={() => setExpandedId(expandedId === we.id ? null : we.id)}
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-foreground truncate max-w-[80%] group-hover:text-info transition-colors">{we.exercises?.name || 'Unknown Exercise'}</span>
                                    <span className="text-micro text-muted font-bold tracking-widest uppercase italic mt-0.5">{we.sets?.length || 0} Sets</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted group-hover:text-foreground transition-colors">
                                    {expandedId === we.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </div>

                            {expandedId === we.id && (
                                <div className="mt-3 space-y-2 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300">
                                    {we.notes && (
                                        <div className="bg-surface-lighter/50 border border-info/20 rounded-lg p-2.5 mb-2">
                                            <p className="text-xs text-blue-100 flex gap-2"><span className="font-bold text-info italic">NOTE:</span> {we.notes}</p>
                                        </div>
                                    )}
                                    {we.sets && we.sets.length > 0 ? we.sets.map((set, idx) => (
                                        <div key={set.id || idx} className="flex flex-col text-xs px-3 py-2 bg-surface/50 rounded-lg border border-border/50">
                                            <div className="flex justify-between items-center w-full">
                                                <span className="text-muted font-bold uppercase tracking-wider text-micro">Set {set.set_number}</span>
                                                <span className="text-foreground font-black italic">
                                                    {set.weight_kg ? `${set.weight_kg}kg × ` : ''}
                                                    {set.duration_seconds ? `${Math.floor(set.duration_seconds / 60)}:${String(set.duration_seconds % 60).padStart(2, '0')} × ` : ''}
                                                    {set.reps ? `${set.reps} reps` : ''}
                                                </span>
                                            </div>
                                            {set.notes && (
                                                <div className="mt-2 pt-2 border-t border-border/30 text-micro text-muted-foreground italic">
                                                    "{set.notes}"
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="text-center text-xs text-muted py-2">No sets recorded</div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {(!workout.workout_exercises || workout.workout_exercises.length === 0) && (
                        <div className="py-2 text-center text-muted text-sm">No exercises logged.</div>
                    )}
                </Card>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-bg via-bg to-transparent z-40 transform translate-y-0 duration-500 delay-500 animate-in slide-in-from-bottom-full fill-mode-both">
                <div className="max-w-xl mx-auto flex gap-3">
                    <Button
                        variant="secondary"
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-surface border border-border text-foreground hover:bg-surface"
                        onClick={exportToMarkdown}
                        title="Export to Markdown"
                    >
                        <Download size={20} />
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-surface border border-border text-foreground hover:bg-surface"
                        onClick={() => router.push(`/workout/${workout.id}/edit`)}
                        title="Edit Workout"
                    >
                        <Edit size={20} />
                    </Button>
                    <Button
                        className="flex-1 h-12 rounded-xl text-micro uppercase italic tracking-widest font-black"
                        onClick={() => router.push('/')}
                    >
                        Back to Home
                        <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
