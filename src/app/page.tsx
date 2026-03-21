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
    <main className="max-w-5xl mx-auto px-4 py-4 lg:py-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0 space-y-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <Link href="/log" className="rounded-xl bg-info px-5 py-2.5 text-sm font-bold tracking-wide text-foreground hover:bg-info/80 transition-colors inline-block text-center w-full sm:w-auto">
            + Log Workout
          </Link>
        </div>
        <StatsGrid workouts={workouts} />
        <MuscleGroupSummary workouts={workouts} />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border">
          <h2 className="text-micro font-bold tracking-widest text-muted uppercase mb-4">Recent</h2>
          <RecentWorkoutsList workouts={workouts} />
        </div>
      </div>
    </main>
  )
}
