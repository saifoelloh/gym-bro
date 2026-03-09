import { Button } from '@/components/ui/Button'
import type { Workout } from '@/types'

interface Props { workouts: Workout[]; selectedIds: Set<string> }

export function ExportControls({ workouts, selectedIds }: Props) {
  const target = selectedIds.size > 0 ? workouts.filter(w => selectedIds.has(w.id)) : workouts
  const dl = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'),{href:url,download:name}).click()
    URL.revokeObjectURL(url)
  }
  const exportJSON = () =>
    dl(new Blob([JSON.stringify(target,null,2)],{type:'application/json'}),'gym-log.json')
  const exportMD = () => {
    const md = target.map(w => {
      const lines = [`## ${w.name} — ${w.date}${w.rpe?` (RPE ${w.rpe})`:''}`,'']
      for (const we of w.workout_exercises) {
        lines.push(`### ${we.exercises.name} (${we.exercises.muscle_group})`)
        we.sets.forEach((s,i) => {
          if (s.weight_kg&&s.reps)    lines.push(`- Set ${i+1}: ${s.weight_kg}kg × ${s.reps} reps`)
          else if (s.reps)            lines.push(`- Set ${i+1}: ${s.reps} reps`)
          else if (s.duration_seconds) lines.push(`- Set ${i+1}: ${s.duration_seconds}s`)
        })
        lines.push('')
      }
      return lines.join('\n')
    }).join('\n---\n\n')
    dl(new Blob([md],{type:'text/markdown'}),'gym-log.md')
  }
  return (
    <div className="flex items-center gap-2">
      {selectedIds.size>0 && <span className="text-xs text-gray-500">{selectedIds.size} selected</span>}
      <Button variant="secondary" onClick={exportJSON}>JSON</Button>
      <Button variant="secondary" onClick={exportMD}>MD</Button>
    </div>
  )
}
