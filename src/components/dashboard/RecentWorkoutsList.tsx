import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Workout } from '@/types'

export function RecentWorkoutsList({ workouts }: { workouts: Workout[] }) {
  if (!workouts.length) {
    return (
      <p className="text-center text-gray-500 py-8">
        No workouts yet.{' '}
        <Link href="/log" className="text-blue-400 underline">Log your first workout!</Link>
      </p>
    )
  }
  return (
    <ul className="space-y-3">
      {workouts.map(w => {
        const groups = Array.from(new Set(w.workout_exercises.map(we => we.exercises.muscle_group)))
        return (
          <li key={w.id}>
            <Link href={`/workout/${w.id}/summary`} className="block group cursor-pointer">
              <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors cursor-pointer group-hover:border-blue-500/50 group-hover:bg-surface/50">
                <div className="min-w-0 w-full sm:w-auto">
                  <p className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">{w.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(w.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                    {' · '}{w.workout_exercises.length} exercises
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 justify-start sm:justify-end">
                  {groups.map(g => <Badge key={g} variant={g}>{g}</Badge>)}
                </div>
              </Card>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
