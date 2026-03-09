import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Workout, MuscleGroup } from '@/types'

const ALL_GROUPS: MuscleGroup[] = ['Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs', 'Cardio']

export function MuscleGroupSummary({ workouts }: { workouts: Workout[] }) {
  const hit = new Set(
    workouts
      .filter(w => (Date.now() - new Date(w.date).getTime()) / 86400000 <= 7)
      .flatMap(w => w.workout_exercises.map(we => we.exercises.muscle_group))
  )
  return (
    <Card>
      <p className="text-sm font-medium text-gray-400 mb-3">This week's coverage</p>
      <div className="flex flex-wrap gap-2">
        {ALL_GROUPS.map(g => (
          <Badge key={g} variant={hit.has(g) ? g : 'default'}>
            {hit.has(g) ? '✓' : '○'} {g}
          </Badge>
        ))}
      </div>
    </Card>
  )
}
