import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Workout } from '@/types'

interface Props { workout: Workout; selected: boolean; onToggle: (id: string) => void; onDelete?: (id: string) => void }

export function WorkoutCard({ workout, selected, onToggle, onDelete }: Props) {
  const totalVolume = workout.workout_exercises
    .flatMap(we => we.sets)
    .reduce((acc, s) => acc + (s.weight_kg ?? 0) * (s.reps ?? 0), 0)
  const groups = Array.from(new Set(workout.workout_exercises.map(we => we.exercises.muscle_group)))

  return (
    <Card onClick={() => onToggle(workout.id)}
      className={`cursor-pointer border-2 transition-colors ${selected ? 'border-blue-500' : 'border-transparent hover:border-gray-700'}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{workout.name}</p>
          <p className="text-sm text-gray-500">
            {new Date(workout.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {workout.workout_exercises.length} exercises
            {totalVolume > 0 && ` · ${totalVolume.toLocaleString()} kg`}
            {workout.rpe && ` · RPE ${workout.rpe}`}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex flex-wrap gap-1 justify-end">
            {groups.map(g => <Badge key={g} variant={g}>{g}</Badge>)}
          </div>
          {onDelete && (
            <button onClick={e => { e.stopPropagation(); onDelete(workout.id) }}
              className="text-xs text-gray-600 hover:text-red-400 mt-1">Delete</button>
          )}
        </div>
      </div>
    </Card>
  )
}
