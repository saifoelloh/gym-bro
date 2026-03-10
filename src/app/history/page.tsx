'use client'
import { useEffect, useRef } from 'react'
import { useWorkouts } from '@/hooks/useWorkouts'
import { WorkoutList } from '@/components/history/WorkoutList'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Search } from 'lucide-react'

export default function HistoryPage() {
  const { workouts, loading, loadingMore, hasMore, search, setSearch, loadMore, error, remove } = useWorkouts(20)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, loadingMore, loadMore])

  if (loading && workouts.length === 0) return <LoadingSpinner label="Loading history..." />
  if (error) return <p className="text-error p-4">{error}</p>

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-4">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl font-black italic uppercase tracking-widest text-foreground">History</h1>
          <p className="text-micro uppercase font-bold tracking-widest text-muted mt-1">Review Sessions</p>
        </div>

        <div className="w-full md:w-auto flex-1 md:max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            placeholder="Search workouts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-success/50 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-4">
        <WorkoutList workouts={workouts} onDelete={remove} />

        {hasMore && (
          <div ref={loaderRef} className="py-8 flex justify-center">
            {loadingMore && <LoadingSpinner label="Loading more..." />}
          </div>
        )}
      </div>
    </main>
  )
}
