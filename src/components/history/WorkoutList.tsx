import { WorkoutCard } from './WorkoutCard'
import type { Workout } from '@/types'

interface Props { workouts: Workout[]; onDelete?: (id: string) => void }

export function WorkoutList({ workouts, onDelete }: Props) {
  if (!workouts.length) return <p className="text-center text-muted py-12">No workouts found.</p>

  const groupedWorkouts = workouts.reduce((groups, workout) => {
    const dateKey = workout.date.split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(workout);
    return groups;
  }, {} as Record<string, Workout[]>);

  const sortedDateKeys = Object.keys(groupedWorkouts).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {sortedDateKeys.map(dateKey => {
        const dailyWorkouts = groupedWorkouts[dateKey];
        const dateObj = new Date(dailyWorkouts[0].date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
        const year = dateObj.getFullYear();

        return (
          <div key={dateKey} className="space-y-3">
            <h3 className="text-micro font-black tracking-[0.2em] text-muted uppercase ml-1">
              {day} {month} {year}
            </h3>
            <ul className="space-y-3">
              {dailyWorkouts.map(w => (
                <li key={w.id}>
                  <WorkoutCard workout={w} onDelete={onDelete} />
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
