'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Trash2, CheckCircle2, MoreVertical, Eye } from 'lucide-react'
import type { Workout } from '@/types'

interface Props { workout: Workout; selected: boolean; onToggle: (id: string) => void; onDelete?: (id: string) => void }

export function WorkoutCard({ workout, selected, onToggle, onDelete }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const totalVolume = workout.workout_exercises
    .flatMap(we => we.sets)
    .reduce((acc, s) => acc + (s.weight_kg ?? 0) * (s.reps ?? 0), 0)
  const groups = Array.from(new Set(workout.workout_exercises.map(we => we.exercises.muscle_group)))

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  return (
    <div className="relative group">
      <Card
        onClick={() => onToggle(workout.id)}
        className={`cursor-pointer transition-all relative overflow-hidden ${selected
          ? 'border-green-500 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.15)] ring-1 ring-green-500/50'
          : 'border-border hover:border-muted hover:bg-surface/50'
          }`}
      >
        {/* Selection Indicator Overlay */}
        {selected && (
          <div className="absolute top-0 right-0 p-3 text-green-500 animate-in zoom-in-50 duration-200">
            <CheckCircle2 size={24} className="fill-green-500/20" />
          </div>
        )}

        <div className={`flex flex-col gap-3 transition-opacity ${selected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
          <div className="min-w-0 flex-1 pr-8">
            <p className="font-black italic text-text text-xl leading-tight truncate mb-1">{workout.name}</p>
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold italic">
              {new Date(workout.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="flex items-center gap-2 mt-3 font-mono text-[10px] text-muted uppercase tracking-tighter bg-surface/50 border border-border/50 w-fit px-2 py-1.5 rounded-lg">
              <span className="font-bold text-text">{workout.workout_exercises.length} EX</span>
              {totalVolume > 0 && <span className="text-muted">·</span>}
              {totalVolume > 0 && <span className="font-bold text-text">{totalVolume.toLocaleString()} KG</span>}
              {workout.rpe && <span className="text-muted">·</span>}
              {workout.rpe && <span className="font-bold text-text">RPE {workout.rpe}</span>}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-4 items-end pt-2 border-t border-border/30 relative">
            {groups.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 min-h-[24px] items-center">
                {groups.map(g => <Badge key={g} variant={g} className="text-[8px] px-1.5 py-0.5">{g}</Badge>)}
              </div>
            ) : <div />}

            <div className="relative" ref={menuRef}>
              <button
                onClick={e => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors border ${showMenu ? 'bg-surface border-border text-text' : 'text-muted hover:text-text hover:bg-surface border-transparent hover:border-border/50'
                  }`}
                title="Options"
              >
                <MoreVertical size={14} />
              </button>

              {showMenu && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-36 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2 duration-200"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex flex-col py-1">
                    <Link
                      href={`/workout/${workout.id}/summary`}
                      className="flex items-center px-3 py-2.5 text-xs font-bold text-muted hover:text-text hover:bg-surface-lighter transition-colors w-full text-left"
                    >
                      <Eye size={12} className="mr-2" />
                      View Details
                    </Link>
                    {onDelete && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setShowMenu(false)
                          onDelete(workout.id)
                        }}
                        className="flex items-center px-3 py-2.5 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
                      >
                        <Trash2 size={12} className="mr-2" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
