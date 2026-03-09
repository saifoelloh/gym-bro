import { WorkoutCard } from './WorkoutCard'
import type { Workout } from '@/types'

interface Props { workouts:Workout[]; selectedIds:Set<string>; onToggle:(id:string)=>void; onDelete?:(id:string)=>void }

export function WorkoutList({ workouts, selectedIds, onToggle, onDelete }: Props) {
  if (!workouts.length) return <p className="text-center text-gray-500 py-12">No workouts found.</p>
  return (
    <ul className="space-y-3">
      {workouts.map(w => (
        <li key={w.id}>
          <WorkoutCard workout={w} selected={selectedIds.has(w.id)} onToggle={onToggle} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}
