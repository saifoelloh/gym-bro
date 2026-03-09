import { Card } from '@/components/ui/Card'
import type { Workout } from '@/types'

export function StatsGrid({ workouts }: { workouts: Workout[] }) {
  const totalVolume = workouts
    .flatMap(w => w.workout_exercises.flatMap(we => we.sets))
    .reduce((acc, s) => acc + (s.weight_kg ?? 0) * (s.reps ?? 0), 0)
  const thisWeek = workouts.filter(w =>
    (Date.now() - new Date(w.date).getTime()) / 86400000 <= 7
  ).length
  const muscleGroups = new Set(
    workouts.flatMap(w => w.workout_exercises.map(we => we.exercises.muscle_group))
  ).size

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: 'Total Workouts', value: workouts.length },
        { label: 'This Week', value: thisWeek },
        { label: 'Total Volume (kg)', value: totalVolume.toLocaleString() },
        { label: 'Muscle Groups Hit', value: muscleGroups },
      ].map(({ label, value }) => (
        <Card key={label} className="text-center">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{label}</p>
        </Card>
      ))}
    </div>
  )
}
