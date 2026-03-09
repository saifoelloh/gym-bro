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
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white text-lg leading-tight break-words mb-1">{workout.name}</p>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-mono">
            {new Date(workout.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
          <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-gray-400 uppercase tracking-tighter bg-surface/30 w-fit px-2 py-1 rounded">
            <span>{workout.workout_exercises.length} EX</span>
            {totalVolume > 0 && <span className="text-gray-600">·</span>}
            {totalVolume > 0 && <span>{totalVolume.toLocaleString()} KG</span>}
            {workout.rpe && <span className="text-gray-600">·</span>}
            {workout.rpe && <span>RPE {workout.rpe}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
            {groups.map(g => <Badge key={g} variant={g}>{g}</Badge>)}
          </div>
          {onDelete && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(workout.id) }}
              className="text-[10px] font-bold text-gray-500 hover:text-red-400 transition-colors px-2 py-1 bg-red-500/5 hover:bg-red-500/10 rounded-lg uppercase tracking-widest border border-transparent hover:border-red-500/20"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
