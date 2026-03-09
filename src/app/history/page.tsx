'use client'
import { useState }       from 'react'
import { useWorkouts }    from '@/hooks/useWorkouts'
import { WorkoutList }    from '@/components/history/WorkoutList'
import { ExportControls } from '@/components/history/ExportControls'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function HistoryPage() {
  const { workouts, loading, error, remove } = useWorkouts(100)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setSel(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n })

  if (loading) return <LoadingSpinner label="Loading history..." />
  if (error)   return <p className="text-red-500 p-4">{error}</p>
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">History</h1>
        <ExportControls workouts={workouts} selectedIds={sel} />
      </div>
      <p className="text-xs text-gray-500">Click to select workouts for export</p>
      <WorkoutList workouts={workouts} selectedIds={sel} onToggle={toggle} onDelete={remove} />
    </main>
  )
}
