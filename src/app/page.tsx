'use client'
import Link from 'next/link'
import { useWorkouts }        from '@/hooks/useWorkouts'
import { StatsGrid }          from '@/components/dashboard/StatsGrid'
import { RecentWorkoutsList } from '@/components/dashboard/RecentWorkoutsList'
import { MuscleGroupSummary } from '@/components/dashboard/MuscleGroupSummary'
import { LoadingSpinner }     from '@/components/ui/LoadingSpinner'

export default function DashboardPage() {
  const { workouts, loading, error } = useWorkouts(10)
  if (loading) return <LoadingSpinner label="Loading dashboard..." />
  if (error)   return <p className="text-error p-4">{error}</p>
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <Link href="/log" className="rounded-lg bg-info px-4 py-2 text-sm font-medium text-foreground hover:bg-info/80">
          + Log Workout
        </Link>
      </div>
      <StatsGrid workouts={workouts} />
      <MuscleGroupSummary workouts={workouts} />
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Recent Workouts</h2>
        <RecentWorkoutsList workouts={workouts} />
      </div>
    </main>
  )
}
