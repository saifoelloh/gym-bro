import { Button } from '@/components/ui/Button'
import { Download } from 'lucide-react'
import type { Workout } from '@/types'
import { RPE_DATA } from '@/components/log/RPESlider'

interface Props { workouts: Workout[]; selectedIds: Set<string> }

export function ExportControls({ workouts, selectedIds }: Props) {
  const target = workouts.filter(w => selectedIds.has(w.id))

  const exportMD = () => {
    if (target.length === 0) return

    const md = target.map(w => {
      const dateStr = new Date(w.date).toLocaleDateString()
      const rpeInfo = w.rpe ? RPE_DATA[w.rpe] : null
      const rpeStr = w.rpe ? `\n**RPE:** ${w.rpe}/10 ${rpeInfo?.emoji || '💪'}\n` : '\n'

      let lines = [`# Workout: ${w.name}`, `**Date:** ${dateStr}`, rpeStr, `## Exercises`, '']

      for (const we of w.workout_exercises || []) {
        lines.push(`### ${we.exercises?.name || 'Unknown'}`)
        if (!we.sets || we.sets.length === 0) {
          lines.push(`- No sets recorded\n`)
          continue
        }
        we.sets.forEach(set => {
          let details = []
          if (set.weight_kg) details.push(`${set.weight_kg}kg`)
          if (set.reps) details.push(`${set.reps} reps`)
          if (set.duration_seconds) {
            const mins = Math.floor(set.duration_seconds / 60)
            const secs = String(set.duration_seconds % 60).padStart(2, '0')
            details.push(`${mins}:${secs}`)
          }
          lines.push(`- Set ${set.set_number}: ${details.join(' × ')}`)
        })
        lines.push('')
      }
      return lines.join('\n')
    }).join('\n---\n\n')

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Gym_Log_Export_${new Date().getTime()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="secondary"
      onClick={exportMD}
      disabled={selectedIds.size === 0}
      className={`h-10 px-4 rounded-xl text-[11px] uppercase italic tracking-widest font-black transition-all ${selectedIds.size === 0
        ? 'opacity-50 cursor-not-allowed bg-surface border border-border text-muted'
        : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
        }`}
    >
      <Download size={16} className="mr-2" />
      Export {selectedIds.size > 0 ? selectedIds.size : ''} Selected
    </Button>
  )
}
